"use client";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import ParticleBackground from "@/components/ui/Particle";
import { getDate, getWeekDay } from "bangla-calendar";
import { BengaliDate } from "to-bengali";
import { useState, useEffect } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface QuranVerse {
  verse: string;
  surah: string;
  ayah: number;
  translation: string;
  audio: string;
}

export default function RandomQuranVersePage() {
  const banglaDate = getDate(new Date(), {
    format: "D MMMM, YYYY",
    calculationMethod: "BD",
  });
  const banglaWeekDay = getWeekDay(new Date(), {
    format: "eeee",
    calculationMethod: "BD",
  });
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [quranVerse, setQuranVerse] = useState<QuranVerse | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());

    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchQuranVerse = async () => {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/ayah/random");
        const data = await response.json();
        const verseData = data.data;

        const translationResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${verseData.number}/bn.bengali`);
        const translationData = await translationResponse.json();

        setQuranVerse({
          verse: verseData.text,
          surah: verseData.surah.englishName,
          ayah: verseData.numberInSurah,
          translation: translationData.data.text,
          audio: verseData.audio
        });
      } catch (error) {
        console.error("Error fetching Quran verse:", error);
      }
    };

    fetchQuranVerse();
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
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <div className="mx-6 rounded-2xl max-w-screen-md bg-white text-black">
          <Card className="bg-white text-black">
            <CardDescription className="p-2 border-b">
              <p className="text-sm text-center">
                {banglaWeekDay} | {banglaTime}{" "}
              </p>
              <p className="text-sm text-center">
                {banglaDate} | {banglaDateTime}
              </p>
            </CardDescription>
            <CardTitle className="p-6">
              {quranVerse ? (
                <div className="text-center">
                  <p className="text-xl font-bold">&quot;{quranVerse.verse}&quot;</p>
                  <p className="text-lg mt-4">{quranVerse.translation}</p>
                  <AudioPlayer src={quranVerse.audio} autoPlay={false} />
                </div>
              ) : (
                <p className="text-center">আপনার জন্য🌼</p>
              )}
            </CardTitle>
            {quranVerse && (
              <CardContent className="text-center">
                <p className="text-base italic mt-2">
                  - Surah {quranVerse.surah}, Ayah {quranVerse.ayah}
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
