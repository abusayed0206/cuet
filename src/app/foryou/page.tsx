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
      const response = await axios.get('https://api.quran.com/api/v4/verses/random', {
        params: {
          language: 'bengali',
          translations: '161'
        },
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = response.data.verse;
      const ayahKey = `${data.surah_number}:${data.verse_number}`;

      const audioResponse = await axios.get(`https://api.quran.com/api/v4/recitations/7/by_ayah/${ayahKey}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const audioUrl = audioResponse.data.audio_files[0].url;

      setQuranVerse({
        arabic: data.text_uthmani,
        translation: data.translations[0].text,
        surah: data.surah_name,
        ayah: data.verse_number,
        audio: audioUrl
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
