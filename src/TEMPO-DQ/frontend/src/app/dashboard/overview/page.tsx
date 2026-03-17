"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomPieChart } from "@/components/pie-chart";
import {
  BookOpen,
  Users,
  Activity,
  UserCheck,
  PlayCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// --- 1. HÀM TIỆN ÍCH: GÁN MÀU CHO BIỂU ĐỒ TRÒN ---
// Xử lý cả trường hợp tên đầy đủ (Excellent) và viết tắt (E, G, M, L, F)
const assignColor = (label: string) => {
  if (!label) return "#9CA3AF"; // Màu xám nếu null

  const l = String(label).toLowerCase().trim();

  // Nhóm Tốt (Xanh lá): Excellent, High, E, H
  // Dùng mảng regex hoặc check string để cover hết các trường hợp
  if (["excellent", "high", "e", "h"].some(k => l === k || l.includes(k))) 
    return "#67AA50"; 

  // Nhóm Trung bình (Vàng): Good, Average, Medium, G, A, M
  if (["good", "average", "medium", "g", "a", "m"].some(k => l === k || l.includes(k))) 
    return "#EFC690"; 

  // Nhóm Thấp/Cảnh báo (Đỏ): Failed, Risk, Low, F, L, R
  if (["failed", "risk", "low", "l", "f", "r"].some(k => l === k || l.includes(k))) 
    return "#EF5050"; 
  
  return "#9CA3AF"; // Mặc định
};

// --- 2. COMPONENT HIỂN THỊ NHÃN (BADGE) ---
const StatusBadge = ({ label }: { label: string }) => {
  const safeLabel = label || "N/A";
  const l = String(safeLabel).toLowerCase().trim();
  
  let colorClass = "text-gray-400 bg-gray-400/10"; // Mặc định xám

  // Logic màu tương tự như biểu đồ
  if (["excellent", "high", "e", "h"].some(k => l === k || l.includes(k))) 
      colorClass = "text-green-400 bg-green-400/10";
      
  else if (["good", "average", "medium", "g", "a", "m"].some(k => l === k || l.includes(k))) 
      colorClass = "text-yellow-400 bg-yellow-400/10";
      
  else if (["failed", "risk", "low", "l", "f", "r"].some(k => l === k || l.includes(k))) 
      colorClass = "text-red-400 bg-red-400/10";

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colorClass} border border-white/5`}>
      {safeLabel}
    </span>
  );
};

// --- 3. COMPONENT CHÍNH ---
export default function OverviewPage() {
  // State lưu dữ liệu
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    activeLearners: 0,
  });

  const [distributions, setDistributions] = useState({
    course: [], 
    user: [],   
  });

  const [lists, setLists] = useState({
    topCourses: [],     
    activeLearners: [], 
  });

  const [loading, setLoading] = useState(true);

  // Gọi API khi vào trang
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Gọi song song 3 API
        const [resStats, resDist, resList] = await Promise.all([
          fetch("/api/overview-stats"),
          fetch("/api/distribution-stats"),
          fetch("/api/list-stats"),
        ]);

        const dataStats = await resStats.json();
        const dataDist = await resDist.json();
        const dataList = await resList.json();

        // 1. Set Stats
        setStats(dataStats);
        
        // 2. Set Pie Charts (Map thêm màu vào)
        setDistributions({
          course: (dataDist.courseDistribution || []).map((item: any) => ({
            name: item.name || "Unknown",
            value: item.value,
            color: assignColor(item.name),
          })),
          user: (dataDist.userDistribution || []).map((item: any) => ({
            name: item.name || "Unknown",
            value: item.value,
            color: assignColor(item.name),
          })),
        });

        // 3. Set Lists
        setLists(dataList);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Map dữ liệu Stats để render
  const statsDisplay = [
    {
      label: "Total Courses",
      val: stats.totalCourses?.toLocaleString() || "0",
      sub: "Organized courses",
      icon: BookOpen,
    },
    {
      label: "Active Courses",
      val: stats.activeCourses?.toLocaleString() || "0",
      sub: "Happening now",
      icon: Activity,
    },
    {
      label: "Total Students",
      val: stats.totalStudents?.toLocaleString() || "0",
      sub: "Registered users",
      icon: Users,
    },
    {
      label: "Active Learners",
      val: stats.activeLearners?.toLocaleString() || "0",
      sub: "Currently learning",
      icon: UserCheck,
    },
  ];

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-zinc-400 gap-2">
        <Activity className="animate-spin w-8 h-8 text-blue-500" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-3xl font-bold mb-2 tracking-tight drop-shadow-md text-white">
        Overview
      </h1>

      {/* --- PHẦN 1: 4 THẺ STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {statsDisplay.map((item, i) => (
          <StatCard
            key={i}
            value={item.val}
            label={item.label}
            subtext={item.sub}
            icon={item.icon}
          />
        ))}
      </div>

      {/* --- PHẦN 2: CHIA 2 CỘT NỘI DUNG --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* === CỘT TRÁI: COURSES === */}
        <div className="space-y-6">
          <CustomPieChart 
            data={distributions.course} 
            title="Course Quality Distribution" 
          />

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2 text-zinc-200">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Latest Course Activity
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Course Name</TableHead>
                  <TableHead className="text-zinc-400 text-center">Views</TableHead>
                  <TableHead className="text-zinc-400 text-center">Ex. Count</TableHead>
                  <TableHead className="text-zinc-400 text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Fallback nếu mảng rỗng */}
                {lists.topCourses?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                      No course data available
                    </TableCell>
                  </TableRow>
                )}
                
                {lists.topCourses?.map((c: any, i: number) => (
                  <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="font-medium text-zinc-200 truncate max-w-[200px]" title={c.name}>
                        {c.name}
                    </TableCell>
                    <TableCell className="text-center text-zinc-400">
                      <div className="flex justify-center items-center gap-1">
                         <PlayCircle className="w-3 h-3 text-zinc-500" /> 
                         {Number(c.views).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-zinc-400">
                      {Number(c.exercises).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge label={c.label} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* === CỘT PHẢI: USERS === */}
        <div className="space-y-6">
          <CustomPieChart 
            data={distributions.user} 
            title="Student Performance Distribution" 
          />

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2 text-zinc-200">
                <Users className="w-4 h-4 text-green-400" />
                Latest Student Activity
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Student</TableHead>
                  <TableHead className="text-zinc-400">Course</TableHead>
                  <TableHead className="text-zinc-400 text-center">Hours</TableHead>
                  <TableHead className="text-zinc-400 text-center">Ex. Done</TableHead>
                  <TableHead className="text-zinc-400 text-right">Label</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Fallback nếu mảng rỗng */}
                {lists.activeLearners?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                      No student activity found
                    </TableCell>
                  </TableRow>
                )}

                {lists.activeLearners?.map((u: any, i: number) => (
                  <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="font-medium text-zinc-200 truncate max-w-[120px]" title={u.name}>
                        {u.name}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 truncate max-w-[120px]" title={u.course}>
                        {u.course}
                    </TableCell>
                    <TableCell className="text-center text-zinc-400">
                        <div className="flex justify-center items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" /> 
                            {Number(u.hours).toFixed(1)}
                        </div>
                    </TableCell>
                    <TableCell className="text-center text-zinc-400">
                      {u.done}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge label={u.label} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}