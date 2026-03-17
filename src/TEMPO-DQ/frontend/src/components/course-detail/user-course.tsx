"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shape } from "@/components/ui/shape";
import { Pagination } from "@/components/ui/pagination";

export default function UserCourse(id: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // mock data
  const users = Array.from({ length: 50 }).map((_, i) => ({
    id: `U_32132${i}`,
    name: `Nguyen Van A ${i + 1}`,
    totalComment: Math.floor(Math.random() * 50) + 10,
    totalExercise: 20,
    totalExerciseCorrect: Math.floor(Math.random() * 20),
    className: "A",
  }));

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query) ||
      user.className.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const safeTotalPages = totalPages > 0 ? totalPages : 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= safeTotalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="text-white font-sans relative overflow-hidden">
      <Shape />
      <div className="w-full mx-auto">
        <div className="flex items-center w-full justify-end py-4 relative z-10">
          <div className="relative w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by ID, Name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 bg-zinc-800/50 rounded-2xl focus-visible:ring-zinc-600 border-zinc-300 text-white placeholder:text-zinc-500 h-9"
            />
          </div>
        </div>

        <div className="bg-[linear-gradient(to_bottom,#2A2C2B_70%,#303231_100%)] border-0 text-white shadow-xxl shadow-black/30 rounded-b-xl rounded-tr-xl rounded-tl-xl relative z-0">
          <div className="animate-in fade-in zoom-in-95 duration-300 h-full">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-center h-16 text-base font-semibold text-zinc-300 w-[15%]">
                    User Id
                  </TableHead>
                  <TableHead className="h-16 text-center text-base font-semibold text-zinc-300 w-[25%]">
                    User Name
                  </TableHead>
                  <TableHead className="h-16 text-center text-base font-semibold text-zinc-300">
                    Total comment
                  </TableHead>
                  <TableHead className="h-16 text-center text-base font-semibold text-zinc-300">
                    Total excercise
                  </TableHead>
                  <TableHead className="h-16 text-center text-base font-semibold text-zinc-300">
                    <span className="block leading-tight">
                      Total excercise <br /> correct
                    </span>
                  </TableHead>
                  <TableHead className="h-16 text-center text-base font-semibold text-zinc-300 pr-4">
                    Class
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                      style={{
                        backgroundColor: index % 2 !== 0 ? "transparent" : "#3f403d",
                      }}
                    >
                      <TableCell className="font-sm text-center py-3">
                        {user.id}
                      </TableCell>
                      <TableCell className="text-center font-sm py-3">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-center font-sm py-3 text-zinc-400">
                        {user.totalComment}
                      </TableCell>
                      <TableCell className="text-center font-sm py-3 text-zinc-400">
                        {user.totalExercise}
                      </TableCell>
                      <TableCell className="text-center font-sm py-3 text-zinc-400">
                        {user.totalExerciseCorrect}
                      </TableCell>
                      <TableCell className="text-center font-sm py-3 pr-4 text-[#67AA50] font-bold">
                        {user.className}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                      No results found for &quot;{searchQuery}&quot;
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={safeTotalPages}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </div>
    </div>
  );
}
