import { GrLinkedin } from "react-icons/gr";
import { BsTwitterX } from "react-icons/bs";
import { VscGithubInverted } from "react-icons/vsc";
import { SiTrakt } from "react-icons/si";
import Image from "next/image";
import { ImProfile } from "react-icons/im";
import { LiaOrcid } from "react-icons/lia";
import { FaMastodon, FaDiscord } from "react-icons/fa6";
import ParticleBackground from "@/components/ui/Particle";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <nav className="bg-gray-800 text-gray-400 py-2 px-4 rounded-full mb-4 flex justify-center">
            <div className="flex flex-wrap justify-center space-x-0 md:space-x-6">
              <Link href="/en" className="px-3 py-1 rounded-full mb-2 md:mb-0">
                Home
              </Link>
              <Link
                href="/about_en"
                className="px-3 py-1 rounded-full bg-gray-700 text-white mb-2 md:mb-0"
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
                className="px-3 py-1 rounded-full mb-2 md:mb-0"
              >
                Contact
              </Link>

              <Link
                href="/about"
                className="px-3 py-1 rounded-full mb-2 md:mb-0"
              >
                বাংলা
              </Link>
            </div>
          </nav>
          <div className="mx-6 rounded-2xl max-w-screen-md bg-white text-black">
            <Card className="bg-white text-black ">
              <CardHeader className="flex flex-col items-center pt-6">
                <CardTitle className="text-xl font-bold">About Me</CardTitle>
                <CardDescription className="text-center text-gray-500">
                  To learn more about me, please see the following links. Thank
                  you.
                </CardDescription>
              </CardHeader>

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
                    aria-label="GitHub"
                    className="text-blue-900 hover:text-gray-800 flex flex-col items-center"
                    href="https://github.com/abusayed0206"
                    target="_blank"
                  >
                    <VscGithubInverted className="text-base mb-1" />
                    <span className="text-sm italic">Github</span>
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
                    <span className="text-sm italic">X</span>
                  </Link>
                </div>
              </CardFooter>
              <CardFooter className="flex justify-around py-2">
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
                    aria-label="Discord"
                    className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                    href="https://discordapp.com/users/852836480262209557"
                    target="_blank"
                  >
                    <FaDiscord className="text-base mb-1" />
                    <span className="text-sm italic">Discord</span>{" "}
                  </Link>
                </div>

                <div className="flex flex-col items-center text-center">
                  <Link
                    aria-label="Trakt.tv"
                    className="text-blue-700 hover:text-blue-800 flex flex-col items-center"
                    href="https://trakt.tv/users/lrs"
                  >
                    <SiTrakt className="text-base mb-1" />
                    <span className="text-sm italic">Trakt.tv</span>
                  </Link>
                </div>
              </CardFooter>

              <CardFooter className="flex flex-wrap justify-around py-1">
                {/* First Link */}
                <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-2 flex justify-center sm:justify-center">
                  <Link aria-label="Song albums" href="/album_en">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/album_en.png"
                        alt="Song albums"
                        width={200}
                        height={50}
                        priority={true}
                      />
                    </div>
                  </Link>
                </div>

                {/* Second Link */}
                <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-2 flex justify-center sm:justify-center">
                  <Link aria-label="Bookshelf" href="/bookshelf_en">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/book_en.png"
                        alt="As many books as I have read since June 2024."
                        width={200}
                        height={50}
                        priority={true}
                      />
                    </div>
                  </Link>
                </div>

                {/* Third Link */}
                <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-2 flex justify-center sm:justify-center">
                  <Link
                    aria-label="Movies/TV Series Recap"
                    href="https://recap.sayed.page/"
                    target="_blank"
                  >
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/recap_en.png"
                        alt="Movie/TV Series Recap"
                        width={200}
                        height={50}
                        priority={true}
                      />
                    </div>
                  </Link>
                </div>

                {/* Fourth Link */}
                <div className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/4 p-2 flex justify-center sm:justify-center">
                  <Link aria-label="Trakt Watched Banner" href="/tv_en">
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src="https://trakt-widgets.vercel.app/lrs/watched/banner"
                        alt="Trakt Watched Banner"
                        width={200}
                        height={50}
                      />
                    </div>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
