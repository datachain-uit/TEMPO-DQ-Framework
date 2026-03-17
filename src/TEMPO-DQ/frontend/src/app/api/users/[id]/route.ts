// File: src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { getContainer } from '@/lib/cosmos';

// Định nghĩa Type cho Next.js 15
type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, props: Props) {
  try {
    // --- KHẮC PHỤC LỖI NEXT.JS 15 ---
    const params = await props.params; // Phải await ở đây!
    const rawId = params.id;
    const userId = decodeURIComponent(rawId).trim();

    // --- LOG KIỂM TRA (Xem ở Terminal) ---
    console.log(`🔍 Đang tìm User ID: [${userId}] (Raw: ${rawId})`);

    // 1. Query thông tin cá nhân từ 'student-information'
    // Lưu ý: Container này dùng 'id' làm khóa chính
    const userQuery = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: userId }]
    };

    // 2. Query Lịch sử (LO-train) - Dùng user_id để nối
    const historyQuery = {
      query: "SELECT c.course_id, c.label_3 FROM c WHERE c.user_id = @id",
      parameters: [{ name: "@id", value: userId }]
    };

    // 3. Query Đang học (LO-phase-f1) - Dùng user_id để nối
    const activeQuery = {
      query: "SELECT c.course_id, c.label FROM c WHERE c.user_id = @id",
      parameters: [{ name: "@id", value: userId }]
    };

    // Chạy song song tất cả query
    const [userRes, historyRes, activeRes] = await Promise.all([
      getContainer("student-information").items.query(userQuery).fetchAll(),
      getContainer("LO-train").items.query(historyQuery).fetchAll(),
      getContainer("LO-test-f1").items.query(activeQuery).fetchAll()
    ]);

    const userData = userRes.resources[0];

    // --- KIỂM TRA DỮ LIỆU ---
    if (!userData) {
      console.error(`❌ Không tìm thấy User trong 'student-information' với ID: [${userId}]`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } else {
      console.log(`✅ Đã tìm thấy User: ${userData.name}`);
    }

    // 4. Lấy tên khóa học (Để hiển thị thay vì hiện ID)
    const allCourseIds = new Set([
        ...historyRes.resources.map(i => i.course_id),
        ...activeRes.resources.map(i => i.course_id)
    ]);
    const uniqueCourseIds = Array.from(allCourseIds);

    let courseMap: Record<string, string> = {};

    if (uniqueCourseIds.length > 0) {
        // Lấy tên từ container 'course'
        const courseNameQuery = {
            query: "SELECT c.id, c.name FROM c WHERE ARRAY_CONTAINS(@ids, c.id)",
            parameters: [{ name: "@ids", value: uniqueCourseIds }]
        };
        const { resources: courses } = await getContainer("course").items.query(courseNameQuery).fetchAll();
        
        courses.forEach(c => {
            courseMap[c.id] = c.name;
        });
    }

    // 5. Map dữ liệu trả về
    const historyList = historyRes.resources.map(h => ({
        id: h.course_id,
        name: courseMap[h.course_id] || `Course ${h.course_id}`,
        label: h.label_3 || "N/A"
    }));

    const activeList = activeRes.resources.map(a => ({
        id: a.course_id,
        name: courseMap[a.course_id] || `Course ${a.course_id}`,
        label: a.label || "N/A"
    }));

    return NextResponse.json({
        ...userData,
        history_courses: historyList,
        active_courses: activeList
    });

  } catch (error) {
    console.error("User Detail API Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}