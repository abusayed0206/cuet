import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiLichess } from "react-icons/si";
import { Card } from "@/components/ui/card";

export default function Component() {
  return (
    <>
      <body>
        {" "}
        <div className="bg-[url('https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=en-US')] min-h-screen flex items-center justify-center">
          <Card className="max-w-auto mx-4 bg-[rgb(255,255,255)] text-[#000000]">
            <Button className="absolute top-0 right-0 mt-4 mr-4 text-white hover:text-red-800 ">
              <Link
                aria-label="Lichess"
                className="text-green-700 hover:text-gray-600"
                href="https://lichess.org/@/abusayed0206"
                target="_blank"
              >
                <SiLichess />
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
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                width: "370px",
                height: "175px",
                borderRadius: "5%",
              }}
            >
              <iframe
                src="/lichess.html"
                width="400px"
                height="200px"
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: "-10px",
                  bottom: 0,
                  right: 0,
                  border: "none",
                }}
              ></iframe>
            </div>
          </Card>
        </div>
      </body>
    </>
  );
}
