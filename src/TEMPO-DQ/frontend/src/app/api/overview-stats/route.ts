// File: src/app/api/overview-stats/route.ts
import { NextResponse } from 'next/server';
import { getContainer } from '@/lib/cosmos';

export async function GET() {
  try {
    const queries = [
      // 1. Container 'course' 
      getContainer("course").items.query("SELECT VALUE COUNT(1) FROM (SELECT DISTINCT c.id FROM c)").fetchAll(),
      
      // 2. Container 'CQ-test-f1'
      getContainer("CQ-test-f1").items.query("SELECT VALUE COUNT(1) FROM (SELECT DISTINCT c.course_id FROM c)").fetchAll(),
      
      // 3. 
      getContainer("student-information").items.query("SELECT VALUE COUNT(1) FROM (SELECT DISTINCT c.id FROM c)").fetchAll(),
      
      // 4. Container 'LO-test-f1'
      getContainer("LO-test-f1").items.query("SELECT VALUE COUNT(1) FROM (SELECT DISTINCT c.user_id FROM c)").fetchAll(),
    ];

    const [courseRes, activeCourseRes, userRes, activeUserRes] = await Promise.all(queries);

    return NextResponse.json({
      totalCourses: courseRes.resources[0] || 0,
      activeCourses: activeCourseRes.resources[0] || 0,
      totalStudents: userRes.resources[0] || 0,
      activeLearners: activeUserRes.resources[0] || 0,
    });

  } catch (error) {
    console.error("Overview API Error:", error); // Xem lỗi chi tiết ở Terminal
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}