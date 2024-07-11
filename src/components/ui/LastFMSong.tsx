// components/LastFMSong.tsx

"use client"
import { useEffect, useState } from "react";
import { useLastFM } from 'use-last-fm';

export default function LastFMSong() {
  const [lastFMSong, setLastFMSong] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false); // Use a boolean for error state

  const lastFM = useLastFM('abusayed0206', 'b3272b7b5464a17b80ab52795cfe57ba');

  useEffect(() => {
    if (lastFM.status === 'error') {
      setHasError(true); // Set error state to true
      setIsLoading(false);
    } else if (lastFM.status === 'playing') {
      setLastFMSong({
        artist: lastFM.song.artist,
        name: lastFM.song.name
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [lastFM.status, lastFM.song]);

  if (isLoading) {
    return <p>btw, Not listening to any song now.</p>;
  }

  if (hasError) {
    return <p>কোন একটা জামেলা হইছে।</p>;
  }

  if (lastFMSong) {
    return (
      <p>
        Now listening{" "}
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-500 to-purple-500">
          {lastFMSong.name}
        </span>{" "}
        by{" "}
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500">
          {lastFMSong.artist}
        </span>{" "}
        Thank You🫶
      </p>
    );
  }

  return <p>গান শুনতেছি না সম্ভবত।</p>;
}
