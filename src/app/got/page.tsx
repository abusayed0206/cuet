"use client";
import { Card, CardContent } from "@/components/ui/card";
import ParticleBackground from "@/components/ui/Particle";
import { getDate, getWeekDay } from "bangla-calendar";
import { BengaliDate } from "to-bengali";
import { useState, useEffect } from "react";

interface Quote {
  sentence: string;
  character: {
    name: string;
    slug: string;
    house: {
      name: string;
      slug: string;
    };
  };
}

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
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());

    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetch("https://api.gameofthronesquotes.xyz/v1/random")
      .then((response) => response.json())
      .then((data) => setQuote(data))
      .catch((error) => console.error("Error fetching quote:", error));
  }, []);

  if (!currentDate) {
    return null; // or a loading spinner
  }

  const banglaDateTime = new BengaliDate(currentDate).format("date");
  const banglaTime = new BengaliDate(currentDate).format("AAAA hh:mm:ss");

  return (
<div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="rounded-2xl bg-white text-black flex flex-col justify-center items-center max-w-screen-md w-full mx-6"> {/* mx-6 applied here */}
        <Card className="bg-white text-black w-full">
          <CardContent className="p-2 border-t border-b">
              <p className="text-sm text-center">
                {banglaWeekDay} | {banglaTime}{" "}
              </p>
              <p className="text-sm text-center">
                {banglaDate} | {banglaDateTime}
              </p>
            </CardContent>
            <CardContent className="p-6">
              {quote ? (
                <div className="text-center">
                  <p className="text-xl font-bold">&quot;{quote.sentence}&quot;</p>
                  <p className="text-base italic mt-2">
                    - {quote.character.name}
                  </p>
                  <p className="text-sm mt-2 italic">
                  {quote.character.house.name}
                  </p>
                </div>
              ) : (
                <p className="text-center">গেম অব থ্রোনস💥</p>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
