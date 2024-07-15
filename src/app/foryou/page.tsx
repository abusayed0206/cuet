"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ParticleBackground from "@/components/ui/Particle";
import { getDate, getWeekDay } from "bangla-calendar";
import { BengaliDate } from "to-bengali";
import axios from "axios";
import PlayPauseButton from "@/components/ui/play_pause_button";

interface QuranVerse {
  arabicText: string;
  banglaTranslation: string;
  surahName: string;
  ayahNumber: number;
  audioUrl: string;
}

const RandomQuranVersePage = () => {
  const [quranVerse, setQuranVerse] = useState<QuranVerse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const banglaDate = getDate(new Date(), {
    format: "D MMMM, YYYY",
    calculationMethod: "BD",
  });
  const banglaWeekDay = getWeekDay(new Date(), {
    format: "eeee",
    calculationMethod: "BD",
  });
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

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
      const response = await axios.get(
        "http://api.quran.com/api/v4/quran/random",
        {
          params: {
            language: "bn",
            translations: "131",
            audio: 1,
            fields: "text,translations,audio,surah",
          },
        }
      );

      const data = response.data.data;

      setQuranVerse({
        arabicText: data.text,
        banglaTranslation: data.translations[0].text,
        surahName: data.surah.name,
        ayahNumber: data.number,
        audioUrl: data.audio.url,
      });

      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
      
    } catch (error) {
      console.error("Error fetching Quran verse:", error);
    }
  };

  const togglePlay = () => {
    if (!audio) {
      const newAudio = new Audio(quranVerse!.audioUrl);
      setAudio(newAudio);
    }

    if (isPlaying) {
      audio!.pause();
    } else {
      audio!.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!currentDate) {
    return null; // Or a loading state
  }

  const banglaDateTime = new BengaliDate(currentDate).format("date");
  const banglaTime = new BengaliDate(currentDate).format("AAAA hh:mm:ss");

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <Card className="bg-white shadow-md rounded-xl p-6 max-w-screen-md text-black">
          <CardDescription className="p-2 border-b">
            <p className="text-sm text-center">
              {banglaWeekDay} | {banglaTime}{" "}
            </p>
            <p className="text-sm text-center">
              {banglaDate} | {banglaDateTime}
            </p>
          </CardDescription>
          <CardTitle className="p-4 text-4xl font-serif" dir="rtl">
            {quranVerse ? quranVerse.arabicText : "আপনার জন্য🌼"}
          </CardTitle>
          {quranVerse && (
            <CardContent>
              <p className="text-2xl font-medium mt-4">
                {quranVerse.banglaTranslation}
              </p>
              <p className="text-base italic mt-2">
                - Surah {quranVerse.surahName}, Ayah {quranVerse.ayahNumber}
              </p>

              {quranVerse.audioUrl && (
                <div className="mt-4 flex justify-center">
                  <PlayPauseButton isPlaying={isPlaying} onClick={togglePlay} />
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RandomQuranVersePage;
