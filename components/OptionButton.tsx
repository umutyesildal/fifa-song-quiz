"use client";

interface OptionButtonProps {
  label: string;
  text: string;
  onClick: () => void;
  selected: boolean;
  showResult: boolean;
  isCorrect: boolean;
}

export default function OptionButton({
  label,
  text,
  onClick,
  selected,
  showResult,
  isCorrect,
}: OptionButtonProps) {
  let buttonClass =
    "p-4 border rounded-lg w-full text-left flex items-center transition-all";

  if (showResult) {
    if (isCorrect) {
      buttonClass += " bg-green-100 border-green-500 text-green-800";
    } else if (selected) {
      buttonClass += " bg-red-100 border-red-500 text-red-800";
    }
  } else if (selected) {
    buttonClass += " bg-blue-100 border-blue-500";
  } else {
    buttonClass += " hover:bg-gray-50 active:bg-gray-100";
  }

  return (
    <button className={buttonClass} onClick={onClick} disabled={showResult}>
      <span className="font-bold text-lg mr-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
        {label}
      </span>
      <span className="font-medium">{text}</span>
    </button>
  );
}
