"use client";

import { useEffect, useState } from "react";
import { QuizState } from "../types";
import { getSongOfDay } from "../utils/getSongOfDay";
import { generateOptions } from "../utils/getOptions";
import YouTubePlayer from "./YouTubePlayer";
import OptionButton from "./OptionButton";
import ResultDisplay from "./ResultDisplay";
import CountdownTimer from "./CountdownTimer";

// Type for localStorage saved data
interface SavedQuizState {
  date: string;
  guessCount: number;
  selectedOption: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
  wrongGuesses: number[];
}

export default function QuizContainer() {
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guessCount, setGuessCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState<number[]>([]);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    // Get today's date string for localStorage key
    const today = new Date();
    const dateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    setTodayDate(dateString);

    async function loadQuiz() {
      try {
        const todaySong = await getSongOfDay();
        const options = await generateOptions(todaySong);

        // Check if we have saved state for today
        let savedState: SavedQuizState | null = null;

        try {
          const savedStateJSON = localStorage.getItem(
            `fifa-quiz-${dateString}`
          );
          if (savedStateJSON) {
            savedState = JSON.parse(savedStateJSON);
          }
        } catch (storageErr) {
          console.error("Failed to load from localStorage:", storageErr);
        }

        // If we have saved state, use it
        if (savedState) {
          setQuizState({
            currentSong: todaySong,
            options,
            selectedOption: savedState.selectedOption,
            isAnswered: savedState.isAnswered,
            isCorrect: savedState.isCorrect,
          });
          setGuessCount(savedState.guessCount);
          setWrongGuesses(savedState.wrongGuesses);

          // Show confetti again if they got it right
          if (savedState.isCorrect) {
            setShowConfetti(true);
          }
        } else {
          // Initialize new quiz state
          setQuizState({
            currentSong: todaySong,
            options,
            selectedOption: null,
            isAnswered: false,
            isCorrect: false,
          });
        }
      } catch (err) {
        setError("Failed to load today's song quiz. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, []);

  // Save state to localStorage whenever relevant state changes
  useEffect(() => {
    if (quizState && todayDate) {
      try {
        const stateToSave: SavedQuizState = {
          date: todayDate,
          guessCount,
          selectedOption: quizState.selectedOption,
          isAnswered: quizState.isAnswered,
          isCorrect: quizState.isCorrect,
          wrongGuesses,
        };

        localStorage.setItem(
          `fifa-quiz-${todayDate}`,
          JSON.stringify(stateToSave)
        );
      } catch (err) {
        console.error("Failed to save to localStorage:", err);
      }
    }
  }, [quizState, guessCount, wrongGuesses, todayDate]);

  const handleOptionSelect = (index: number) => {
    if (quizState?.isAnswered) return;

    const isCorrect = quizState?.options[index].isCorrect || false;
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    if (!isCorrect) {
      // For wrong answers
      setWrongGuesses((prev) => [...prev, index]);

      if (newGuessCount < 2) {
        // First wrong guess - shake effect
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
    } else {
      // Show confetti on correct guess
      setShowConfetti(true);
    }

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
        <div className="animate-pulse text-lg text-primary-light">
          Loading today's quiz...
        </div>
      </div>
    );
  }

  if (error || !quizState) {
    return (
      <div className="text-red-300 text-center p-4 rounded-lg bg-red-900/30 border border-red-800">
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
    <div
      className={`max-w-2xl mx-auto p-6 fifa-container ${
        shake ? "animate-shake" : ""
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-accent-yellow">
        FIFA Song Quiz
      </h1>

      <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
        <YouTubePlayer
          videoId={extractVideoId(quizState.currentSong.yt_vid_link || "")}
        />
      </div>

      <div className="mb-8 fifa-card">
        <h2 className="text-xl font-semibold mb-4 text-accent-yellow">
          Which FIFA game featured this song?
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
              disabled={quizState.isAnswered || guessCount >= 2}
              wrongGuess={wrongGuesses.includes(index)}
            />
          ))}
        </div>
      </div>

      {quizState.isAnswered && (
        <div className="mb-8">
          <ResultDisplay
            isCorrect={quizState.isCorrect}
            song={quizState.currentSong}
            guessCount={guessCount}
            showConfetti={showConfetti}
          />
        </div>
      )}

      {!quizState.isAnswered && guessCount >= 2 && (
        <div className="text-red-300 text-center p-4 mb-8 rounded-lg bg-red-900/30 border border-red-700 animate-fadeIn">
          <p className="font-bold mb-2">You've used all your guesses!</p>
          <p>
            The correct answer was:{" "}
            <span className="text-accent-yellow font-semibold">
              {quizState.currentSong.Game}
            </span>
          </p>
          <p className="mt-2 text-primary-light">
            {quizState.currentSong.Song} by {quizState.currentSong.Artist}
          </p>
        </div>
      )}

      <div className="mt-8 border-t border-primary-green pt-4">
        <CountdownTimer />
      </div>
    </div>
  );
}
