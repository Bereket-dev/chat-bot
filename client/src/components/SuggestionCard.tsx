import type React from "react";
import type { SuggestionProps } from "../types";

const SuggestionCard: React.FC<SuggestionProps> = ({
  text,
  setChatHistory,
  generateBotResponse,
}) => {
  const handleSuggestion = () => {
    {
      // Update chat history immediately
      let updatedHistory: any = [];
      setChatHistory(prev => {
        updatedHistory = [...prev, { role: "user", text: text }];
        return updatedHistory;
      });

      setTimeout(() => { if (updatedHistory.length > 0) generateBotResponse(updatedHistory) }, 600);
    }
  }

  return (
    <div
      onClick={handleSuggestion}
      className={`rounded-lg border border-white bg-white/45 p-[9px] text-[#160211] dark:bg-black/30 dark:border-white/20 dark:text-white`}
    >
      {text}
    </div>
  );
};

export default SuggestionCard;
