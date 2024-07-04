"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import ParticleBackground from "@/components/ui/Particle";
import SuccessComponent from "@/components/ui/success-component";
import { CardFooter } from "@/components/ui/card";

export default function Success() {
  return (
    <>
      <div className="relative w-full h-screen overflow-auto">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
            <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
              <Link
                href="/_en"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                Home
              </Link>
              <Link
                href="/about_en"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                About Me
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
            </div>
          </nav>
          <Card className="bg-white text-black ">
            <CardFooter className="flex justify-around py-2">
              <div className="flex flex-col items-center text-center">
                <SuccessComponent />
                <p>For any assistance contact me </p>{" "}
                <p className="font-bold">
                  Contact me{" "}
                  <button className="text-red-500">
                    <Link href="/contact_en"> here</Link>
                  </button>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
