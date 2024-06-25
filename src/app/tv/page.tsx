import { SiTrakt } from "react-icons/si";
import { CardFooter, Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(/bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Card className="max-w-auto mx-4 bg-[rgb(255,255,255)] text-[#000000]">
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
              href="/"
            >
              Home | বাড়ি
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
    </>
  );
}
