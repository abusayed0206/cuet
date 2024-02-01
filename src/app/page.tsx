import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { GrLinkedin } from "react-icons/gr";
import { BsTwitterX } from "react-icons/bs";
import { VscGithubInverted } from "react-icons/vsc";
import { TfiEmail } from "react-icons/tfi";
import { FaHashnode } from "react-icons/fa6";
import { BiKey } from "react-icons/bi";
import { SiTrakt } from "react-icons/si";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <>
      <div className="bg-[url('https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-US')] min-h-screen flex items-center justify-center">
        <Card className="max-w-auto mx-4 bg-[rgb(255,255,255)] text-[#000000]">
          <Button className="absolute top-0 right-0 mt-4 mr-4 text-white hover:text-red-800 ">
            <Link
              aria-label="বাংলা ভাষায় দেখুন"
              className="text-white hover:text-red-800 "
              href="/"
            >
              বাংলা
            </Link>
            |
            <Link
              aria-label="English"
              className="text-black hover:text-blue-800 underline"
              href="/en"
            >
              English
            </Link>
          </Button>
          <CardHeader className="flex flex-col items-center pt-6">
            <Avatar className="w-28 h-28 mb-4">
              <AvatarImage
                alt="A smily face of Sayed"
                className="rounded-full"
                src="https://cdn.hashnode.com/res/hashnode/image/upload/v1699648553222/cHpLJnlzJ.jpg?w=500&h=500&fit=crop&crop=faces&auto=compress,format&format=webp"
              />
              <AvatarFallback className="rounded-full">সাঈদ</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-bold">
              লূৎফুর রশীদ সাঈদ
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              পুরকৌশল শিক্ষার্থী | চুয়েট
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 border-t border-b ">
            <p className="text-sm text-center">
              রক্তে রক্তে নেগেটিভিটি🩸নর্মি একটা🙂
            </p>
          </CardContent>
          <CardFooter className="flex justify-around py-4">
            <Link
              aria-label="Email"
              className="text-blue-800 hover:text-gray-600"
              href="mailto:hello@sayed.page"
              target="_blank"
            >
              <TfiEmail />
            </Link>
            <Link
              aria-label="PGP Key"
              className="text-blue-700 hover:text-blue-800"
              href="Abu Sayed_0x081A22B2_public.asc"
              target="_blank"
            >
              <BiKey />
            </Link>
            <Link
              aria-label="Twitter"
              className="text-blue-500 hover:text-blue-600"
              href="https://twitter.com/abusayed0206"
              target="_blank"
            >
              <BsTwitterX />
            </Link>
            <Link
              aria-label="GitHub"
              className="text-blue-900 hover:text-gray-800"
              href="https://github.com/abusayed0206"
              target="_blank"
            >
              <VscGithubInverted />
            </Link>
            <Link
              aria-label="LinkedIn"
              className="text-blue-700 hover:text-blue-800"
              href="https://linkedin.com/in/abusayed0206"
              target="_blank"
            >
              <GrLinkedin />
            </Link>
            <Link
              aria-label="Blog"
              className="text-blue-700 hover:text-blue-800"
              href="https://abusayed.dev"
              target="_blank"
            >
              <FaHashnode />
            </Link>
            <Link
              aria-label="Trakt.tv"
              className="text-red-900 hover:text-gray-800"
              href="/tv"
            >
              <SiTrakt />
            </Link>
          </CardFooter>
          <div style={{ borderRadius: "16px", overflow: "hidden" }}>
            <img
              src="https://trakt-widgets.vercel.app/lrs/watched/banner"
              alt="Trakt.tv banner"
              width="395"
            />
          </div>
        </Card>
      </div>
    </>
  );
}
