import type React from "react";
import type { SuggestionProps } from "../types";

const SuggestionCard: React.FC<SuggestionProps> = ({
  text,
  setChatHistory,
  generateBotResponse,
}) => {
  const handleSuggestion = () => {
    const userEntry = { role: "user" as const, text };
    setChatHistory(prev => {
      const updatedHistory = [...prev, userEntry];
      queueMicrotask(() => generateBotResponse(updatedHistory));
      return updatedHistory;
    });
  };

  return (
    <div
      onClick={handleSuggestion}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") handleSuggestion();
      }}
      className="cursor-pointer rounded-2xl border border-[#160211]/10 bg-white/70 p-3 text-sm text-[#160211] shadow-sm transition hover:bg-white/90 dark:border-white/10 dark:bg-black/20 dark:text-white dark:hover:bg-black/30"
    >
      {text}
    </div>
  );
};

export default SuggestionCard;
