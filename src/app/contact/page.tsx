import React from "react";
import Link from "next/link";
import { GrLinkedin } from "react-icons/gr";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { FaKey } from "react-icons/fa6";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
  Card,
} from "@/components/ui/card";
import ParticleBackground from "@/components/ui/Particle";
import ContactFormbn from "@/components/ui/ContactFormbn";

export default function Contact() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
          <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
            <Link
              href="/"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              হোম
            </Link>
            <Link
              href="/about"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              সম্পর্কে
            </Link>
            <Link
              href="/blog"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              ব্লগ
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
            >
              যোগাযোগ
            </Link>

            <Link
              href="/contact_en"
              className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
            >
              English
            </Link>
          </div>
        </nav>
        <div className="w-full max-w-4xl mx-auto">
          <Card className="bg-white text-black mx-4 overflow-y-auto max-h-[80vh]">
            <CardHeader className="flex flex-col items-center pt-6">
              <CardTitle className="text-xl font-bold">যোগাযোগ</CardTitle>
              <CardDescription className="text-center text-gray-500">
                আমার সাথে যোগাযোগ করতে নিচের ফর্ম টা পূরণ করতে পারেন, ইমেইল করতে
                পারেন বা লিংকডইন এ মেসেজ করতে পারেন। অন্য মাধ্যমে প্রতিত্তোর
                পেতে দেরি হতে পারে। নিরাপদে ইমেইলের মাধ্যমে যোগাযোগের জন্য নিচের
                PGP কী ব্যবহার করুন।
              </CardDescription>
              <ContactFormbn />
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
                  <span className="text-sm italic">ইমেইল</span>
                </Link>
              </div>
              <div className="flex flex-col items-center text-center">
                <Link
                  aria-label="Email"
                  className="text-blue-800 hover:text-gray-600 flex flex-col items-center"
                  href="https://sayed.page/gpg-public-key.asc"
                  target="_blank"
                >
                  <FaKey className="text-base mb-1" />
                  <span className="text-sm italic">পিজিপি</span>
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
                  <span className="text-sm italic">লিংকডইন</span>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
