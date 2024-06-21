import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { GrLinkedin } from "react-icons/gr";
import { BsTwitterX } from "react-icons/bs";
import { VscGithubInverted } from "react-icons/vsc";
import { BiKey } from "react-icons/bi";
import { SiTrakt } from "react-icons/si";
import Image from "next/image";
import { ImProfile } from "react-icons/im";
import { LiaOrcid } from "react-icons/lia";
import { FaMastodon, FaHashnode, FaDiscord } from "react-icons/fa6";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
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
        <Card className="max-w-auto mx-4 bg-[rgb(255,255,255)] text-[#000000] relative">
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <Button className="p-2 bg-black text-white hover:text-red-800 border border-white">
              <Link
                aria-label="বাংলা"
                className="text-white hover:text-blue-800  mr-2"
                href="/"
              >
                বাংলা
              </Link>
              |
              <Link
                aria-label="English"
                className="text-white hover:text-red-800 ml-2 underline"
                href="/en"
              >
                English
              </Link>
            </Button>
          </div>
          <div className="absolute top-0 left-0 mt-4 ml-4">
            <Button className="p-2 bg-black text-white hover:text-red-800 border border-white">
              <Link
                aria-label="সূচিপত্র"
                className="text-white hover:text-blue-800 mr-2"
                href="https://index.sayed.page/"
                target="_blank"
              >
                Index
              </Link>
            </Button>
          </div>
          <CardHeader className="flex flex-col items-center pt-6">
            <Avatar className="w-28 h-28 mb-4">
              <AvatarImage
                alt="A smily face of Sayed"
                className="rounded-full"
                src="https://abusayed.vercel.app/static/media/sayed.5022f8e22eb97adb250a.jpg"
              />
              <AvatarFallback className="rounded-full">
                Lutfor Rashid Sayed
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold">
              Lutfor Rashid Sayed
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              <Link href="https://cv.sayed.page/" target="_blank">
                Civil Engineering Student | CUET
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 border-t border-b ">
            <p className="text-sm text-center">
              Negative by Blood🩸 Just a Normie🙂
            </p>
          </CardContent>
          <CardFooter className="flex justify-around py-2">
            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="CV"
                className="text-blue-800 hover:text-gray-600 flex flex-col items-center"
                href="https://cv.sayed.page/"
                target="_blank"
              >
                <ImProfile className="text-base mb-1" />
                <span className="text-sm italic">CV</span>
              </Link>
            </div>
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
                aria-label="GitHub"
                className="text-blue-900 hover:text-gray-800 flex flex-col items-center"
                href="https://github.com/abusayed0206"
                target="_blank"
              >
                <VscGithubInverted className="text-base mb-1" />
                <span className="text-sm italic">GitHub</span>
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

          <CardFooter className="flex justify-around py-2">
            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="PGP Key"
                className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                href="gpg-public-key.asc"
                target="_blank"
              >
                <BiKey className="text-base mb-1" />
                <span className="text-sm italic">PGP Key</span>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="ORCID"
                className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                href="https://orcid.org/0009-0007-8994-5252"
                target="_blank"
              >
                <LiaOrcid className="text-base mb-1" />
                <span className="text-sm italic">ORCID</span>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="Twitter"
                className="text-blue-500 hover:text-blue-600 flex flex-col items-center"
                href="https://twitter.com/abusayed0206"
                target="_blank"
              >
                <BsTwitterX className="text-base mb-1" />
                <span className="text-sm italic">Twitter</span>
              </Link>
            </div>
          </CardFooter>

          <CardFooter className="flex justify-around py-2">
            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="Discord"
                className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                href="https://discordapp.com/users/852836480262209557"
                target="_blank"
              >
                <FaDiscord className="text-base mb-1" />
                <span className="text-sm italic">Discord</span>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="Blog"
                className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                href="https://abusayed.dev"
                target="_blank"
              >
                <FaHashnode className="text-base mb-1" />
                <span className="text-sm italic">Blog</span>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="Mastodon"
                className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                rel="me"
                href="https://mastodon.social/@abusayed"
                target="_blank"
              >
                <FaMastodon className="text-base mb-1" />
                <span className="text-sm italic">Mastodon</span>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center">
              <Link
                aria-label="Trakt.tv"
                className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                href="/tv"
              >
                <SiTrakt className="text-base mb-1" />
                <span className="text-sm italic">Trakt.tv</span>
              </Link>
            </div>
          </CardFooter>
          <CardFooter className="flex flex-wrap justify-around py">
            <div className="w-full sm:w-1/2 p-2">
              <Link
                aria-label="সর্বশেষ দেখা মুভি/টিভি সিরিজ রিভিউ"
                href="https://recap.sayed.page/"
                target="_blank"
              >
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/recap_en.png"
                    alt="Movie/TV Series Recap"
                    width={395}
                    height={50}
                    priority={true}
                  />
                </div>
              </Link>
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <Link
                aria-label="Trakt Watched Banner"
                href="https://trakt.tv/users/lrs"
                target="_blank"
              >
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://trakt-widgets.vercel.app/lrs/watched/banner"
                    alt="Trakt Watched Banner"
                    width={395}
                    height={50}
                  />
                </div>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
