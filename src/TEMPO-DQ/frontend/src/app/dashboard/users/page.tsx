"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, Eye, User as UserIcon, Loader2, Filter 
} from "lucide-react";

// Định nghĩa kiểu dữ liệu User
interface UserData {
  id: string;
  name: string;
  gender: number;
  school: string;
  year_of_birth: number;
}

export default function UserListPage() {
  const router = useRouter();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // State cho Dropdown
  const [dataset, setDataset] = useState("train");

  const ITEMS_PER_PAGE = 20;

  // Hàm hiển thị tên Phase cho đẹp
  const getDatasetName = (val: string) => {
    switch(val) {
      case 'train': return 'All Data';
      case 'test_f1': return 'Phase 1';
      case 'test_f2': return 'Phase 2';
      case 'test_f3': return 'Phase 3';
      case 'test_f4': return 'Phase 4';
      default: return 'All Data';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users?page=${page}&limit=${ITEMS_PER_PAGE}&dataset=${dataset}`);
        
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        
        setUsers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
      } catch (error) {
        console.error("Lỗi Fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, dataset]); 

  const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataset(e.target.value);
    setPage(1); // Trở về trang 1 khi đổi dataset
  };

  const getGenderLabel = (g: number) => {
    if (g === 0) return { text: "Male", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    if (g === 1) return { text: "Female", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" };
    return { text: "Other", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-400 gap-2">
        <Loader2 className="animate-spin text-blue-500" /> 
        Loading {getDatasetName(dataset)}...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6 text-white min-h-screen bg-zinc-950">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Students</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Found <span className="text-white font-bold">{totalItems}</span> active students in {getDatasetName(dataset)}
          </p>
        </div>

        {/* UI Dropdown Bộ lọc */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 shrink-0">
            <Filter size={16} className="text-zinc-500 mr-2" />
            <select
              value={dataset}
              onChange={handleDatasetChange}
              className="bg-transparent text-sm text-zinc-300 font-medium focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="train" className="bg-zinc-900 text-white">All Data</option>
              <option value="test_f1" className="bg-zinc-900 text-white">Phase 1</option>
              <option value="test_f2" className="bg-zinc-900 text-white">Phase 2</option>
              <option value="test_f3" className="bg-zinc-900 text-white">Phase 3</option>
              <option value="test_f4" className="bg-zinc-900 text-white">Phase 4</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight size={14} className="text-zinc-500 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-zinc-900 border-b border-zinc-800">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] text-zinc-400 font-mono">No.</TableHead>
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400 text-center">Birth</TableHead>
              <TableHead className="text-zinc-400 text-center">Gender</TableHead>
              <TableHead className="text-zinc-400">School</TableHead>
              <TableHead className="text-right text-zinc-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => {
                const genderStyle = getGenderLabel(user.gender);
                const rowNumber = (page - 1) * ITEMS_PER_PAGE + index + 1;

                return (
                  <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors group">
                    <TableCell className="font-mono font-medium text-zinc-500 group-hover:text-white">
                      #{rowNumber}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                          <UserIcon size={16} className="text-zinc-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">
                                {user.name}
                            </span>
                            <span className="text-[10px] text-zinc-600 font-mono">{user.id}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-zinc-400">
                        {user.year_of_birth > 0 ? user.year_of_birth : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${genderStyle.color}`}>
                        {genderStyle.text}
                      </span>
                    </TableCell>

                    <TableCell className="text-zinc-400 truncate max-w-[200px] text-sm">
                      {user.school || "---"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-blue-500/20 hover:text-blue-400 text-zinc-500"
                        onClick={() => router.push(`/dashboard/users/${user.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                  No active users found in {getDatasetName(dataset)}.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Thanh phân trang */}
      <div className="flex items-center justify-between py-4 border-t border-zinc-800">
        <div className="text-sm text-zinc-500 font-mono">
          Page <span className="text-white font-bold">{page}</span> of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}