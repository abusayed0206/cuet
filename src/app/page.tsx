"use client";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { CiBarcode } from "react-icons/ci";
import { HiDownload } from "react-icons/hi";
import ParticleBackground from "@/components/ui/Particle";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Link from "next/link";
import { getDate, getWeekDay } from "bangla-calendar";
import { BengaliDate } from "to-bengali";
import { useState, useEffect } from "react";

export default function Home() {
  const banglaDate = getDate(new Date(), {
    format: "D MMMM, YYYY",
    calculationMethod: "BD",
  });
  const banglaWeekDay = getWeekDay(new Date(), {
    format: "eeee",
    calculationMethod: "BD",
  });
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial date after component mounts to avoid hydration mismatch
    setCurrentDate(new Date());

    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!currentDate) {
    return null; // or a loading spinner
  }

  const banglaDateTime = new BengaliDate(currentDate).format("date");
  const banglaTime = new BengaliDate(currentDate).format("AAAA hh:mm:ss");

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
            <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
              <Link
                href="/"
                className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
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
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                যোগাযোগ
              </Link>
              <Link
                href="/en"
                className="px-3 py-1 rounded-full mb-2 md:mb-0 transform transition duration-300 ease-in-out hover:scale-110"
              >
                English
              </Link>
            </div>
          </nav>
          <div className="mx-6 rounded-2xl max-w-screen-md bg-white text-black">
            <Card className="bg-white text-black ">
              <CardHeader className="flex flex-col items-center pt-6">
                <Avatar className="w-28 h-28 mb-4">
                  <AvatarImage
                    alt="A smily face of Sayed"
                    className="rounded-full"
                    src="/dp.webp"
                    width={250}
                    height={250}
                  />
                  <AvatarFallback className="rounded-full">সাঈদ</AvatarFallback>
                </Avatar>
                <CardTitle className="text-3xl font-bold">
                  লূৎফুর রশীদ সাঈদ
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                  পুরকৌশল শিক্ষার্থী | চুয়েট
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 border-t border-b">
                <p className="text-lg md:text-xl text-center">
                  আমি একজন পুরকৌশল (সিভিল ইঞ্জিনিয়ারিং) শিক্ষার্থী। বর্তমানে
                  চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (চুয়েট) এর
                  পুরকৌশল বিভাগে চতুর্থ বর্ষে অধ্যয়নরত। আমি মূলত কাঠামোগত
                  প্রকৌশল (স্ট্রাকচারাল ইঞ্জিনিয়ারিং) নিয়ে পড়াশোনা করছি।
                </p>
              </CardContent>

              <CardContent className="p-2 border-t border-b">
                <p className="text-sm text-center">
                  {banglaWeekDay} | {banglaTime}{" "}
                </p>
                <p className="text-sm text-center">
                  {banglaDate} | {banglaDateTime}
                </p>
              </CardContent>

              <CardFooter className="flex justify-center py-2 px-8">
                <Link
                  className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
                  href="/sayed_CV.pdf"
                  target="_blank"
                >
                  সিভি
                  <HiDownload className="opacity-100 group-hover:translate-y-1 transition" />
                </Link>
                <Link
                  className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition ml-4"
                  href="/hire"
                  target="_blank"
                >
                  হায়ার করুন
                  <CiBarcode className="opacity-100 group-hover:translate-y-1 transition" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
