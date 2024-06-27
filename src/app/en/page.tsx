import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { LiaOrcid } from "react-icons/lia";
import { HiDownload } from "react-icons/hi";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(178,190,181)]">
        <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 w-full md:w-auto flex justify-center">
          <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
            <Link
              href="/"
              className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
            >
              Home
            </Link>
            <Link
              href="/about_en"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              About
            </Link>
            <Link
              href="/blog_en"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              Blog
            </Link>
            <Link
              href="/contact_en"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              Contact
            </Link>

            <Link
              href="/"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              বাংলা
            </Link>
          </div>
        </nav>
        <Card className="max-w-auto mx-4 bg-white text-black relative w-full md:w-auto">
          <CardHeader className="flex flex-col items-center pt-6">
            <Avatar className="w-28 h-28 mb-4">
              <AvatarImage
                alt="A smily face of Sayed"
                className="rounded-full"
                src="https://abusayed.vercel.app/static/media/sayed.5022f8e22eb97adb250a.jpg"
                width={250}
                height={250}
              />
              <AvatarFallback className="rounded-full">Sayed</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold">
              Lutfor Rashid Sayed
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Civil Engineering Student | CUET
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 border-t border-b">
            <p className="text-xl text-center">
              I am a Civil Engineering student currently in my fourth year at
              Chittagong University of Engineering and Technology (CUET). My
              major is Structural Engineering, and I have a keen interest in
              research related to water and the environment.
            </p>
          </CardContent>
          <CardFooter className="flex justify-around justify-center py-2">
            <Link
              className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
              href="/sayed_CV.pdf"
              target="_blank"
            >
              CV
              <HiDownload className="opacity-100 group-hover:translate-y-1 transition" />
            </Link>
            <Link
              className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
              href="https://orcid.org/0009-0007-8994-5252"
              target="_blank"
            >
              ORCID
              <LiaOrcid />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
