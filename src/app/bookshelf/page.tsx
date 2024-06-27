"use client";

import React from "react";
import Link from "next/link";
import GoodreadsBookshelf from "react-goodreads-shelf";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Book() {
  return (
    <div className="space-y-6">
      <Card className="relative p-6 flex flex-col items-center justify-center">
        <div className="flex justify-between w-full px-[3.4px] mb-4">
          {" "}
          <Button className="p-2 bg-black text-white hover:text-blue-800 border border-white">
            <Link
              aria-label="Homepage"
              className="text-white hover:text-blue-800"
              href="/"
            >
              বাড়ি
            </Link>
          </Button>
          <p className="text-xl">বইয়ের তাক📚</p>{" "}
          <Button className="p-2 bg-black text-white hover:text-red-800 border border-white">
            <Link
              aria-label="Index"
              className="text-white hover:text-red-800"
              href="https://www.goodreads.com/user/show/96441373-lutfor-rashid-sayed"
              target="_blank"
            >
              গুডরিড
            </Link>
          </Button>
        </div>
      </Card>

      <Card>
        <GoodreadsBookshelf userId="96441373" />
      </Card>
    </div>
  );
}
