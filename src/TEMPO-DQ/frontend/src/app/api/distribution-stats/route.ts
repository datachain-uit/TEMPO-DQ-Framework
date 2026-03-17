// File: src/app/api/distribution-stats/route.ts
import { NextResponse } from 'next/server';
import { getContainer } from '@/lib/cosmos';

export async function GET() {
  try {
    // --- SỬA LỖI SQL ---
    // Từ khóa 'VALUE' bị cấm dùng làm tên biến trong Cosmos DB.
    // Chúng ta đổi 'as value' thành 'as total'.
    
    // 1. Tỷ lệ nhãn Course (CQ-train)
    const courseQuery = "SELECT c.label as name, COUNT(1) as total FROM c GROUP BY c.label";
    
    // 2. Tỷ lệ nhãn Student (LO-train)
    const userQuery = "SELECT c.label_3 as name, COUNT(1) as total FROM c GROUP BY c.label_3";

    const queries = [
      getContainer("CQ-train").items.query(courseQuery).fetchAll(),
      getContainer("LO-train").items.query(userQuery).fetchAll()
    ];

    const [courseRes, userRes] = await Promise.all(queries);

    // --- HÀM MAP DỮ LIỆU ---
    // Đổi 'total' quay lại thành 'value' để Frontend hiểu
    const formatData = (items: any[]) => {
        return items.map(item => ({
            name: item.name,
            value: item.total // Map từ total sang value
        }));
    };

    return NextResponse.json({
      courseDistribution: formatData(courseRes.resources),
      userDistribution: formatData(userRes.resources)
    });

  } catch (error) {
    console.error("Distribution API Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}