import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchImageUrl = async () => {
  const imageUrl =
    "https://songstitch.art/collage?username=abusayed0206&method=album&period=overall&artist=false&album=false&playcount=true&rows=12&columns=5&webp=true&cacheid=1719293995513";
  return imageUrl;
};
 
const AlbumPage = async () => {
  const imageUrl = await fetchImageUrl();

  return (
    <div className="space-y-6">
      <Card className="relative p-6 flex flex-col items-center justify-center">
        <div className="flex justify-between w-full px-[3.4px] mb-4">
          <Button className="p-2 bg-black text-white hover:text-blue-800 border border-white">
            <Link
              aria-label="Homepage"
              className="text-white hover:text-blue-800"
              href="/about_en"
            >
              About
            </Link>
          </Button>
          <p className="text-xl">Song Albums🎶</p>
          <Button className="p-2 bg-black text-white hover:text-red-800 border border-white">
            <Link
              aria-label="LastFM"
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
          href="https://www.last.fm/user/abusayed0206"
          target="_blank"
        >
          <Image
            src={imageUrl}
            alt="Album Collage"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            className="mx-auto rounded-lg"
          />
        </Link>
      </Card>
    </div>
  );
};

export default AlbumPage;
