import { NextResponse } from 'next/server';
import { getContainer } from '@/lib/cosmos';

export async function GET() {
  try {
    // =====================================================================
    // PHẦN 1: LATEST COURSE ACTIVITY
    // =====================================================================
    
    const cqQuery = `SELECT TOP 5 * FROM c`; 
    // Nếu bạn muốn lấy từ Train, đổi "CQ-test-f1" thành "CQ-train" nhé
    const { resources: cqDocs } = await getContainer("CQ-test-f1").items.query(cqQuery).fetchAll();

    const cqCourseIds = Array.from(new Set(cqDocs.map(c => c.course_id).filter(id => id)));

    let cqCourseNames: any[] = [];
    if (cqCourseIds.length > 0) {
        const cqCourseNameQuery = {
            query: "SELECT c.id, c.name FROM c WHERE ARRAY_CONTAINS(@ids, c.id)",
            parameters: [{ name: "@ids", value: cqCourseIds }]
        };
        const res = await getContainer("course").items.query(cqCourseNameQuery).fetchAll();
        cqCourseNames = res.resources;
    }

    const courseList = cqDocs.map(item => {
        // LOGIC CHỐNG TRƯỢT ID: Ép về chữ thường và cắt khoảng trắng để so sánh
        const info = cqCourseNames.find(n => 
            String(n.id).trim().toLowerCase() === String(item.course_id).trim().toLowerCase()
        );
        
        return {
            id: item.course_id,
            // Nếu vẫn xui xẻo không tìm ra, sẽ hiện mã "Course C_123" thay vì "Unknown Course"
            name: info?.name || `Course ${item.course_id}`, 
            views: item.video_counts || item.attempts_sum || 0,
            exercises: item.ex_counts || item.problem_count || 0,
            label: item.label || item.label_f || "N/A"
        };
    });

    // =====================================================================
    // PHẦN 2: LATEST STUDENT ACTIVITY 
    // =====================================================================

    const loQuery = `SELECT TOP 5 * FROM c`; 
    const { resources: loDocs } = await getContainer("LO-test-f1").items.query(loQuery).fetchAll();

    const userIds = Array.from(new Set(loDocs.map(d => d.user_id).filter(id => id)));
    const courseIds = Array.from(new Set(loDocs.map(d => d.course_id).filter(id => id)));

    let userNames: any[] = [];
    let courseNames: any[] = [];

    if (userIds.length > 0 || courseIds.length > 0) {
        const [userNamesRes, courseNamesRes] = await Promise.all([
            getContainer("student-information").items.query({
                query: "SELECT c.id, c.name FROM c WHERE ARRAY_CONTAINS(@ids, c.id)",
                parameters: [{ name: "@ids", value: userIds }]
            }).fetchAll(),

            getContainer("course").items.query({
                query: "SELECT c.id, c.name FROM c WHERE ARRAY_CONTAINS(@ids, c.id)",
                parameters: [{ name: "@ids", value: courseIds }]
            }).fetchAll()
        ]);
        userNames = userNamesRes.resources;
        courseNames = courseNamesRes.resources;
    }

    const activeLearnersList = loDocs.map(item => {
        // Áp dụng logic chống trượt ID tương tự cho cả Học viên và Khóa học
        const studentInfo = userNames.find(u => 
            String(u.id).trim().toLowerCase() === String(item.user_id).trim().toLowerCase()
        );
        const courseInfo = courseNames.find(c => 
            String(c.id).trim().toLowerCase() === String(item.course_id).trim().toLowerCase()
        );

        return {
            name: studentInfo?.name || `User ${item.user_id}`, 
            course: courseInfo?.name || `Course ${item.course_id}`, 
            hours: item.video_counts || 0, 
            done: item.ex_counts || 0,     
            label: item.label_3 || item.label || "N/A" 
        };
    });

    return NextResponse.json({
        topCourses: courseList,
        activeLearners: activeLearnersList
    });

  } catch (error) {
    console.error("List stats error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}