import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Song() {
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
          <p className="text-xl">গানের এলবাম🎶</p>{" "}
          <Button className="p-2 bg-black text-white hover:text-red-800 border border-white">
            <Link
              aria-label="Index"
              className="text-white hover:text-red-800"
              href="https://www.last.fm/user/abusayed0206"
              target="_blank"
            >
              lastfm
            </Link>
          </Button>
        </div>
      </Card>

      <Card className="flex items-center justify-center">
        <Link
          aria-label="গানের এলবাম"
          className="text-white hover:text-red-800 ml-2"
          href={`https://www.last.fm/user/abusayed0206`}
          target="_blank"
        >
          <img
            src="https://songstitch.art/collage?username=abusayed0206&method=album&period=overall&artist=false&album=false&playcount=true&rows=12&columns=5&webp=true&cacheid=1719293995513"
            alt="Album Collage"
            className="mx-auto rounded-lg" // Use 'rounded-lg' or any other Tailwind CSS classes for styling
          />
        </Link>
      </Card>
    </div>
  );
}
