import React from "react";
import Link from "next/link";
import { ImProfile } from "react-icons/im";
import { LiaOrcid } from "react-icons/lia";
import { GrLinkedin } from "react-icons/gr";
import { BsTwitterX } from "react-icons/bs";
import { VscGithubInverted } from "react-icons/vsc";
import { BiKey } from "react-icons/bi";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { SiTrakt } from "react-icons/si";
import { FaMastodon, FaHashnode, FaDiscord } from "react-icons/fa6";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 w-full md:w-auto flex justify-center">
        <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
          <Link href="/en" className="px-3 py-1 rounded-full mb-2 md:mb-0">
            Home
          </Link>
          <Link href="/about_en" className="px-3 py-1 rounded-full mb-2 md:mb-0">
            About
          </Link>
          <Link href="/blog_en" className="px-3 py-1 rounded-full mb-2 md:mb-0">
            Blog
          </Link>
          <Link
            href="/contact_en"
            className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
          >
            Contact
          </Link>

          <Link href="/contact" className="px-3 py-1 rounded-full mb-2 md:mb-0">
            বাংলা
          </Link>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center">
        <Card className="max-w-auto mx-4 bg-white text-black relative w-full md:w-auto">
          <CardHeader className="flex flex-col items-center pt-6">
            <CardTitle className="text-xl font-bold">Contact</CardTitle>
            <CardDescription className="text-center text-gray-500">
            You can reach me by email or message me on LinkedIn. Please note that responses may be delayed if you use other methods of contact. 

            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-around py-2">
            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="Email"
                className="text-blue-800 hover:text-gray-600 flex flex-col items-center"
                href="mailto:hello@sayed.page"
                target="_blank"
              >
                <MdOutlineMarkEmailUnread className="text-base mb-1" />
                <span className="text-sm italic">Email</span>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="LinkedIn"
                className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                href="https://linkedin.com/in/abusayed0206"
                target="_blank"
              >
                <GrLinkedin className="text-base mb-1" />
                <span className="text-sm italic">LinkedIn</span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
