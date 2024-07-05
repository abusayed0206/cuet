import { SiTrakt } from "react-icons/si";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ui/Particle";

export default function Component() {
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          <Card className="max-w-auto mx-5 bg-[rgb(255,255,255)] text-[#000000]">
            <Button className="absolute top-0 right-0 mt-4 mr-4 p-2 bg-white text-white hover:text-red-800 border border-white">
              <Link
                aria-label="Trakt.tv"
                className="text-red-700 hover:text-gray-600"
                href="https://trakt.tv/users/lrs"
                target="_blank"
              >
                <SiTrakt />
              </Link>
            </Button>

            <Button className="absolute top-0 left-0 mt-4 mr-4 p-2 bg-black text-white hover:text-red-800 border border-white">
              <Link
                aria-label="বাংলা"
                className="text-white hover:text-blue-800"
                href="/about_en"
              >
                About Me
              </Link>
            </Button>

            <Link
              aria-label="Trakt.tv"
              className="text-blue-700 hover:text-blue-800"
              href="https://trakt.tv/users/lrs"
              target="_blank"
            >
              <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                <img
                  src="https://trakt-widgets.vercel.app/lrs/profile/poster"
                  alt="Trakt.tv banner"
                />
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
