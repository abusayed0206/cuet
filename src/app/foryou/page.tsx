"use client";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ParticleBackground from "@/components/ui/Particle";
import { getDate, getWeekDay } from "bangla-calendar";
import { BengaliDate } from "to-bengali";
import { useState, useEffect } from "react";
import axios from 'axios';

interface QuranVerse {
  arabic: string;
  translation: string;
  surah: string;
  ayah: number;
  audio: string;
}

const RandomQuranVersePage = () => {
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
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    fetchRandomVerse();

    setCurrentDate(new Date());

    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchRandomVerse = async () => {
    try {
      const response = await axios.get('https://api.alquran.cloud/v1/ayah/random/editions/quran-simple,bn.bengali,ar.alafasy');
      const data = response.data.data;
      setQuranVerse({
        arabic: data[0].text,
        translation: data[1].text,
        surah: data[0].surah.englishName,
        ayah: data[0].numberInSurah,
        audio: data[2].audio
      });
      setAudioLoaded(false);
    } catch (error) {
      console.error("Error fetching Quran verse:", error);
    }
  };

  useEffect(() => {
    if (quranVerse) {
      const audio = new Audio(quranVerse.audio);
      audio.addEventListener('canplaythrough', () => setAudioLoaded(true));
      return () => {
        audio.removeEventListener('canplaythrough', () => setAudioLoaded(true));
      }
    }
  }, [quranVerse]);

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
                  <p className="text-xl font-bold" dir="rtl">{quranVerse.arabic}</p>
                  <p className="text-lg mt-4">{quranVerse.translation}</p>
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
                {audioLoaded && (
                  <div className="mt-4">
                    <audio src={quranVerse.audio} controls />
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RandomQuranVersePage;
