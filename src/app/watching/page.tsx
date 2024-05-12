import { SiTrakt } from "react-icons/si";
import { CardFooter, Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <>
      <div className="bg-[url('https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-US')] min-h-screen flex items-center justify-center">
        <Card className="max-w-auto mx-4 bg-[rgb(255,255,255)] text-[#000000]">
          <Button className="absolute top-0 right-0 mt-4 mr-4 text-white hover:text-red-800 ">
            <Link
              aria-label="Trakt.tv"
              className="text-red-700 hover:text-gray-600"
              href="https://trakt.tv/users/lrs"
              target="_blank"
            >
              <SiTrakt />
            </Link>
          </Button>

          <Button className="absolute top-0 left-0 mt-4 mr-4 text-white hover:text-red-800 ">
            <Link
              aria-label="বাংলা"
              className="text-white hover:text-blue-800 underline"
              href="/"
            >
              Home|বাড়ি
            </Link>
          </Button>

          <Link
            aria-label="Trakt.tv"
            className="text-blue-700 hover:text-blue-800"
            href="https://trakt-widgets.vercel.app/pizidavi/watching/card"
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
