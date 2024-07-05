import React from "react";
import Link from "next/link";
import { GrLinkedin } from "react-icons/gr";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import ParticleBackground from "@/components/ui/Particle";
import { FaKey } from "react-icons/fa6";
import ContactForm from "@/components/ui/ContactForm";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
  Card,
} from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
          <div className="flex flex-wrap justify-center space-x-0 md:space-x-2">
            <Link href="/en" className="px-3 py-1 rounded-full mb-2 md:mb-0">
              Home
            </Link>
            <Link
              href="/about_en"
              className="px-3 py-1 rounded-full mb-2 md:mb-0"
            >
              About
            </Link>
            <Link
              href="/blog_en"
              className="px-3 py-1 rounded-full mb-2 md:mb-0"
            >
              Blog
            </Link>
            <Link
              href="/contact_en"
              className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
            >
              Contact
            </Link>

            <Link
              href="/contact"
              className="px-3 py-1 rounded-full mb-2 md:mb-0"
            >
              বাংলা
            </Link>
          </div>
        </nav>
        <div className="w-full max-w-4xl mx-auto">
          <Card className="bg-white text-black mx-5 overflow-y-auto max-h-[80vh]">
            <CardHeader className="flex flex-col items-center pt-6">
              <CardTitle className="text-xl font-bold">Contact</CardTitle>
              <CardDescription className="text-center text-gray-500">
                To contact me, please fill the form below, email me, or message
                me on LinkedIn. Responses may be delayed if you use other
                methods. For secure communication, use the PGP key provided to
                encrypt your emails.
              </CardDescription>
              <ContactForm />
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
                  aria-label="Email"
                  className="text-blue-800 hover:text-gray-600 flex flex-col items-center"
                  href="https://sayed.page/gpg-public-key.asc
                "
                  target="_blank"
                >
                  <FaKey className="text-base mb-1" />
                  <span className="text-sm italic">PGP</span>
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
    </div>
  );
}
