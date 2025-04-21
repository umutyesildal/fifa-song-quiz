"use client";

import { Song } from "../types";
import { useState, useEffect } from "react";

type ResultDisplayProps = {
  isCorrect: boolean;
  song: Song;
  guessCount?: number;
  showConfetti?: boolean;
};

export default function ResultDisplay({
  isCorrect,
  song,
  guessCount = 0,
  showConfetti = false,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  // For confetti effect
  useEffect(() => {
    if (showConfetti && isCorrect) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // @ts-ignore - Confetti is loaded from CDN
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#78b496", "#ffd76e", "#ffffff", "#23553f"],
        });
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showConfetti, isCorrect]);

  const handleShare = () => {
    const shareText = `🎵 FIFA Song Quiz ${new Date().toLocaleDateString()} 🎮\n\n${
      isCorrect
        ? `I guessed today's song in ${guessCount} ${
            guessCount === 1 ? "try" : "tries"
          }! 🎉`
        : "I couldn't guess today's song 😔"
    }\n\nSong: "${song.Song}"\nArtist: ${
      song.Artist
    }\n\nPlay at https://fifa-song-quiz.vercel.app`;

    if (navigator.share) {
      navigator
        .share({
          title: "FIFA Song Quiz",
          text: shareText,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(console.error);
    }
  };

  return (
    <div
      className={`p-6 rounded-lg text-center ${
        isCorrect
          ? "bg-green-700/30 border-2 border-green-500/50"
          : "bg-red-700/30 border-2 border-red-500/50"
      }`}
    >
      <h3
        className={`text-2xl font-bold mb-3 ${
          isCorrect ? "text-green-300" : "text-red-300"
        }`}
      >
        {isCorrect ? "Correct!" : "Not quite right!"}
      </h3>

      <p className="text-lg mb-1">
        <span className="font-semibold text-accent-yellow">"{song.Song}"</span>{" "}
        by <span className="text-primary-light">{song.Artist}</span>
      </p>

      <p className="mb-4">
        Featured in{" "}
        <span className="font-semibold text-accent-yellow">{song.Game}</span>
      </p>

      {isCorrect && (
        <p className="mb-4 text-green-300">
          You got it in {guessCount} {guessCount === 1 ? "guess" : "guesses"}!
        </p>
      )}

      <button
        onClick={handleShare}
        className="bg-primary-green hover:bg-primary-green-light text-white px-6 py-2 rounded-full transition-colors flex items-center justify-center mx-auto border border-primary-light/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        {copied ? "Copied!" : "Share Result"}
      </button>
    </div>
  );
}
