import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { GrLinkedin } from "react-icons/gr";
import { BsTwitterX } from "react-icons/bs";
import { VscGithubInverted } from "react-icons/vsc";
import { BiKey } from "react-icons/bi";
import { SiTrakt } from "react-icons/si";
import { FaMastodon, FaOrcid, FaHashnode, FaDiscord } from "react-icons/fa6";
import { MdMarkEmailUnread } from "react-icons/md";
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
          <Button className="absolute top-0 left-0 mt-4 mr-4 p-2 bg-black text-white hover:text-red-800 border border-white">
            <Link
              aria-label="Index"
              className="text-white hover:text-blue-800 mr-2"
              href="https://index.sayed.page/"
            >
              Index
            </Link>
          </Button>
          <Button className="absolute top-0 right-0 mt-4 mr-4 p-2 bg-black text-white hover:text-red-800 border border-white">
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
            <CardTitle className="text-2xl font-bold">
              Lutfor Rashid Sayed
            </CardTitle>
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
              className="text-blue-800 hover:text-gray-600"
              href="mailto:hello@sayed.page"
              target="_blank"
            >
              <MdMarkEmailUnread />
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
              aria-label="ORCID"
              className="text-blue-700 hover:text-blue-800"
              href="https://orcid.org/0009-0007-8994-5252"
              target="_blank"
            >
              <FaOrcid />
            </Link>
          </CardFooter>
          <CardFooter className="flex justify-around py-4">
            <Link
              aria-label="Discord"
              className="text-blue-700 hover:text-blue-800"
              href="https://discordapp.com/users/852836480262209557"
              target="_blank"
            >
              <FaDiscord />
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
              aria-label="Mastodon"
              className="text-blue-700 hover:text-blue-800"
              rel="me"
              href="https://mastodon.social/@abusayed"
              target="_blank"
            >
              <FaMastodon />
            </Link>
            <Link
              aria-label="PGP Key"
              className="text-blue-700 hover:text-blue-800"
              href="gpg-public-key.asc"
              target="_blank"
            >
              <BiKey />
            </Link>
            <Link
              aria-label="Trakt.tv"
              className="text-red-900 hover:text-gray-800"
              href="/tv"
            >
              <SiTrakt />
            </Link>
          </CardFooter>

          <Link
            aria-label="Last Watched movie/episode"
            className="text-blue-700 hover:text-blue-800"
            href="https://trakt.tv/users/lrs"
            target="_blank"
          >
            <div style={{ borderRadius: "16px", overflow: "hidden" }}>
              <img
                src="https://trakt-widgets.vercel.app/lrs/watched/banner"
                alt="Discord Widget"
                width="395"
                height="80"
              />
            </div>
          </Link>
        </Card>
      </div>
    </>
  );
}
