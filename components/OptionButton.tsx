"use client";

import React from "react";

type OptionButtonProps = {
  label: string;
  text: string;
  onClick: () => void;
  selected?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  wrongGuess?: boolean; // New prop to track wrong guesses
};

export default function OptionButton({
  label,
  text,
  onClick,
  selected = false,
  showResult = false,
  isCorrect = false,
  disabled = false,
  wrongGuess = false, // Default to false
}: OptionButtonProps) {
  let bgColor = "bg-primary-green";
  let textColor = "text-white";
  let borderColor = "border-primary-light/40";
  let labelBg = "bg-primary-light/20";
  let labelText = "text-primary-light";
  let hoverState = disabled
    ? "cursor-not-allowed opacity-70"
    : "cursor-pointer hover:bg-primary-green-light hover:border-primary-light";

  if (showResult) {
    if (isCorrect) {
      bgColor = "bg-green-600";
      borderColor = "border-green-400";
      textColor = "text-white";
      labelBg = "bg-green-300";
      labelText = "text-green-900";
    } else if (selected) {
      bgColor = "bg-red-700";
      borderColor = "border-red-500";
      textColor = "text-white";
      labelBg = "bg-red-300";
      labelText = "text-red-900";
    }
  } else if (selected) {
    bgColor = "bg-primary-green-light";
    borderColor = "border-primary-light";
    textColor = "text-white";
    labelBg = "bg-primary-light/30";
  } else if (wrongGuess) {
    // Apply red styling for wrong guesses even without showing final result
    bgColor = "bg-red-700";
    borderColor = "border-red-500";
    textColor = "text-white";
    labelBg = "bg-red-300";
    labelText = "text-red-900";
    disabled = true;
  }

  return (
    <button
      className={`${bgColor} ${textColor} ${borderColor} ${hoverState} border-2 p-4 rounded-lg text-left transition-all duration-200 flex items-center`}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={`inline-block w-8 h-8 rounded-full ${labelBg} ${labelText} font-bold flex items-center justify-center mr-3`}
      >
        {label}
      </span>
      <span className="font-medium">{text}</span>
    </button>
  );
}
