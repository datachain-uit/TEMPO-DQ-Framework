// File: src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getContainer } from '@/lib/cosmos';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '20');
    
    // Đọc tham số dataset từ URL (mặc định là train)
    const dataset = searchParams.get('dataset') || 'train';
    
    // --- LỰA CHỌN ĐÚNG CONTAINER THEO PHASE ---
    let containerName = "LO-train";
    switch (dataset) {
        case 'test_f1': 
            containerName = "LO-test-f1"; 
            break;
        case 'test_f2': 
            containerName = "LO-test-f2"; 
            break;
        case 'test_f3': 
            containerName = "LO-test-f3"; 
            break;
        case 'test_f4': 
            containerName = "LO-test-f4"; 
            break;
        default: 
            containerName = "LO-train";
    }

    // BƯỚC 1: Lấy danh sách ID từ container tương ứng
    const query = `SELECT TOP 500 c.user_id FROM c`;
    
    const { resources: rawDocs } = await getContainer(containerName).items.query(query).fetchAll();

    // Lọc trùng ID bằng Set
    const uniqueUserIds = Array.from(new Set(rawDocs.map(item => item.user_id).filter(id => id)));
    
    const totalItems = uniqueUserIds.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedIds = uniqueUserIds.slice(startIndex, startIndex + pageSize);

    if (paginatedIds.length === 0) {
      return NextResponse.json({ 
        data: [], 
        pagination: { page, pageSize, totalItems, totalPages } 
      });
    }

    // BƯỚC 2: Lấy thông tin chi tiết từ student-information
    const userInfoQuery = {
      query: "SELECT * FROM c WHERE ARRAY_CONTAINS(@ids, c.id)",
      parameters: [{ name: "@ids", value: paginatedIds }]
    };
    
    const { resources: userInfos } = await getContainer("student-information").items.query(userInfoQuery).fetchAll();

    // BƯỚC 3: Map dữ liệu để trả về
    const result = userInfos.map(u => ({
      id: u.id,
      name: u.name,
      gender: u.gender ?? 2, // Mặc định là 2 (Other) nếu null
      school: u.school || "Unknown",
      year_of_birth: u.year_of_birth || 0
    }));

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages
      }
    });

  } catch (error) {
    console.error("User List API Error:", error);
    return NextResponse.json({ error: String(error), data: [] }, { status: 500 });
  }
}