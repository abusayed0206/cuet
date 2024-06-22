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
              href="/en"
            >
              HomePage
            </Link>
          </Button>
          <p className="text-xl">Bookshelf📚</p>{" "}
          <Button className="p-2 bg-black text-white hover:text-red-800 border border-white">
            <Link
              aria-label="Index"
              className="text-white hover:text-red-800"
              href="https://index.sayed.page/en"
              target="_blank"
            >
              Index
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
