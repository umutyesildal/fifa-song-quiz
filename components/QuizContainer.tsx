"use client";

import { useEffect, useState } from "react";
import { QuizState } from "../types";
import { getSongOfDay } from "../utils/getSongOfDay";
import { generateOptions } from "../utils/getOptions";
import YouTubePlayer from "./YouTubePlayer";
import OptionButton from "./OptionButton";
import ResultDisplay from "./ResultDisplay";
import CountdownTimer from "./CountdownTimer";

export default function QuizContainer() {
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const todaySong = getSongOfDay();
      const options = generateOptions(todaySong);

      setQuizState({
        currentSong: todaySong,
        options,
        selectedOption: null,
        isAnswered: false,
        isCorrect: false,
      });
    } catch (err) {
      setError("Failed to load today's song quiz. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOptionSelect = (index: number) => {
    if (quizState?.isAnswered) return;

    const isCorrect = quizState?.options[index].isCorrect || false;

    setQuizState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        selectedOption: index,
        isAnswered: true,
        isCorrect,
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading today's quiz...</div>
      </div>
    );
  }

  if (error || !quizState) {
    return (
      <div className="text-red-500 text-center p-4 rounded bg-red-50 border border-red-100">
        {error || "Something went wrong. Please refresh the page."}
      </div>
    );
  }

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : "";
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">FIFA Song Quiz</h1>

      <div className="mb-8">
        <YouTubePlayer
          videoId={extractVideoId(quizState.currentSong.yt_vid_link || "")}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Who is the artist of this song?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizState.options.map((option, index) => (
            <OptionButton
              key={index}
              label={String.fromCharCode(65 + index)} // A, B, C, D
              text={option.text}
              onClick={() => handleOptionSelect(index)}
              selected={quizState.selectedOption === index}
              showResult={quizState.isAnswered}
              isCorrect={option.isCorrect}
            />
          ))}
        </div>
      </div>

      {quizState.isAnswered && (
        <div className="mb-8">
          <ResultDisplay
            isCorrect={quizState.isCorrect}
            song={quizState.currentSong}
          />
        </div>
      )}

      <div className="mt-8 border-t pt-4">
        <CountdownTimer />
      </div>
    </div>
  );
}
