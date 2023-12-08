import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { GrLinkedin } from "react-icons/gr";
import { BsTwitterX } from "react-icons/bs";
import { VscGithubInverted } from "react-icons/vsc";
import { TfiEmail } from "react-icons/tfi";
import { FaHashnode } from "react-icons/fa6";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Link from "next/link";

export default function Component() {
  return (
    <div className="bg-[url('https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-US')] min-h-screen flex items-center justify-center">
      <Card className="max-w-[400px] mx-4 bg-[#ffffff] text-[#000000]">
        <CardHeader className="flex flex-col items-center pt-6">
          <Avatar className="w-28 h-28 mb-4">
            <AvatarImage
              alt="Profile Picture"
              className="rounded-full"
              src="https://cdn.hashnode.com/res/hashnode/image/upload/v1699648553222/cHpLJnlzJ.jpg?w=500&h=500&fit=crop&crop=faces&auto=compress,format&format=webp"
            />
            <AvatarFallback className="rounded-full">Sayed</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">Sayed</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Civil Engineering Student | CUET
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 border-t border-b ">
          <p className="text-sm text-center">
            Negative by Blood🩸 Just a Normie🙂
          </p>
        </CardContent>
        <CardFooter className="flex justify-around py-4">
          <Link
            aria-label="Email"
            className="text-gray-500 hover:text-gray-600"
            href="mailto:hello@sayed.page"
            target="_blank"
          >
            <TfiEmail />
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
            className="text-gray-900 hover:text-gray-800"
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
        </CardFooter>

        <div style={{ borderRadius: "10px", overflow: "hidden" }}>
          <img
            src="https://discord.c99.nl/widget/theme-5/852836480262209557.png"
            alt="Sayed"
            width="auto"
            height="auto"
          />
        </div>
      </Card>
    </div>
  );
}
