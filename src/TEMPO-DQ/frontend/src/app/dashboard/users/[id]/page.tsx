"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  User, School, Calendar, BookOpen, ChevronLeft, Activity, History, Loader2 
} from "lucide-react";

interface CourseItem {
  id: string;
  name: string;
  label: string;
}

interface UserDetail {
  id: string;
  name: string;
  gender: number;
  school: string;
  year_of_birth: number;
  history_courses: CourseItem[];
  active_courses: CourseItem[];
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? decodeURIComponent(params.id as string) : "";

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400 gap-2">
      <Loader2 className="animate-spin text-blue-500" /> Loading user profile...
    </div>
  );

  if (!user) return <div className="p-20 text-white text-center">User not found</div>;

  const getGenderText = (g: number) => {
      if (g === 0) return "Male";
      if (g === 1) return "Female";
      return "Other";
  };

  // Helper tô màu nhãn
  const getLabelColor = (label: string) => {
    const l = String(label).toLowerCase();
    if (["excellent", "high", "e", "h"].some(k => l.includes(k))) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (["good", "average", "medium", "g", "a", "m"].some(k => l.includes(k))) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-zinc-500 bg-zinc-800 border-zinc-700";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-8 font-sans">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-zinc-400 hover:text-white mb-6 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back list
      </button>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- PROFILE CARD --- */}
        <div className="bg-[#1E1E1E] border border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-700/50 flex items-center justify-center shrink-0">
              <User size={40} className="text-zinc-400" />
            </div>
            <div className="text-center md:text-left space-y-2 flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-zinc-500 font-mono text-sm bg-zinc-900/50 inline-block px-2 py-1 rounded">ID: {user.id}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300">
                    <School size={16}/> <span>{user.school || "Unknown School"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300">
                    <User size={16}/> <span>{getGenderText(user.gender)}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300">
                    <Calendar size={16}/> <span>Born: {user.year_of_birth}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- COURSES SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
          {/* CỘT 1: ĐANG HỌC (ACTIVE) */}
          <div className="bg-[#1E1E1E] border border-zinc-800 rounded-2xl p-6 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-400">
              <Activity size={20} /> Active Courses
            </h3>
            {user.active_courses.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500 italic">No active courses.</div>
            ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {user.active_courses.map((course, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-green-500/30 transition-all">
                            <h4 className="font-medium text-zinc-200 line-clamp-1" title={course.name}>{course.name}</h4>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-xs font-mono text-zinc-500">{course.id}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${getLabelColor(course.label)}`}>
                                    Status: {course.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* CỘT 2: LỊCH SỬ (HISTORY) */}
          <div className="bg-[#1E1E1E] border border-zinc-800 rounded-2xl p-6 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-400">
              <History size={20} /> Course History
            </h3>
             {user.history_courses.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-500 italic">No history found.</div>
            ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {user.history_courses.map((course, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-purple-500/30 transition-all flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-zinc-200 line-clamp-1" title={course.name}>{course.name}</h4>
                                <span className="text-xs font-mono text-zinc-500">{course.id}</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getLabelColor(course.label)}`}>
                                Result: {course.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}