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

interface QuranVerse {
  verse: string;
  surah: string;
  ayah: number;
  translation: string;
  audioUrl: string; // Added field for audio URL
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
    fetchRandomQuranVerse();
  }, []);

  const fetchRandomQuranVerse = () => {
    fetch("https://api.alquran.cloud/v1/ayah/random")
      .then((response) => response.json())
      .then((data) => {
        const verseData = data.data;
        fetch(`https://api.alquran.cloud/v1/ayah/${verseData.number}/bn.bengali`)
          .then((response) => response.json())
          .then((translationData) => {
            const surahName = verseData.surah.englishName.toLowerCase();
            const reciterId = 7; // Example: Reciter Id for Mishary Rashid Alafasy
            fetchAudioUrl(reciterId, verseData.number, (audioUrl) => {
              setQuranVerse({
                verse: verseData.text,
                surah: verseData.surah.englishName,
                ayah: verseData.numberInSurah,
                translation: translationData.data.text,
                audioUrl: audioUrl,
              });
            });
          })
          .catch((error) => console.error("Error fetching translation:", error));
      })
      .catch((error) => console.error("Error fetching Quran verse:", error));
  };

  const fetchAudioUrl = (reciterId: number, chapterNumber: number, callback: (audioUrl: string) => void) => {
    fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterNumber}`)
      .then((response) => response.json())
      .then((data) => {
        const audioUrl = data.audio_file.url;
        callback(audioUrl);
      })
      .catch((error) => console.error("Error fetching audio:", error));
  };

  if (!currentDate) {
    return null; // or a loading spinner
  }

  const banglaDateTime = new BengaliDate(currentDate).format("date");
  const banglaTime = new BengaliDate(currentDate).format("AAAA hh:mm:ss");

  const handlePlayAudio = () => {
    if (quranVerse && quranVerse.audioUrl) {
      const audio = new Audio(quranVerse.audioUrl);
      audio.play();
    }
  };

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
                </div>
              ) : (
                <p className="text-center">Fetching Quran verse...</p>
              )}
            </CardTitle>
            {quranVerse && (
              <CardContent className="text-center">
                <p className="text-base italic mt-2">
                  - Surah {quranVerse.surah}, Ayah {quranVerse.ayah}
                </p>
                <button onClick={handlePlayAudio} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Play Audio
                </button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
