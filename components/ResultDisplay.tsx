"use client";

import { Song } from "../types";

interface ResultDisplayProps {
  isCorrect: boolean;
  song: Song;
}

export default function ResultDisplay({ isCorrect, song }: ResultDisplayProps) {
  return (
    <div
      className={`p-4 rounded-lg text-center ${
        isCorrect ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <h3
        className={`text-xl font-bold mb-2 ${
          isCorrect ? "text-green-700" : "text-red-700"
        }`}
      >
        {isCorrect ? "Correct!" : "Incorrect!"}
      </h3>

      <div className="mt-4">
        <p className="mb-1 text-gray-700">
          <span className="font-semibold">Song:</span> {song.Song}
        </p>
        <p className="mb-1 text-gray-700">
          <span className="font-semibold">Artist:</span> {song.Artist}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Game:</span> {song.Game}
        </p>
      </div>
    </div>
  );
}
