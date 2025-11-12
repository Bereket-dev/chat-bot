import type React from "react";
import type { SuggestionProps } from "../types";

const SuggestionCard: React.FC<SuggestionProps> = ({
  text,
  setChatHistory,
  generateBotResponse,
}) => {
  const handleSuggestion = ()=>{
    {
        setChatHistory((history) => [...history, { role: "user", text: text }]);
         setTimeout(() => {
        setChatHistory((history) => {
          const updated = [...history, { role: "model", text: "" }];
          
          generateBotResponse(updated);

          return updated;
        });
      }, 600);
      }
  }

  return (
    <div
      onClick={handleSuggestion}
      className={`rounded-lg border border-white bg-white/30 p-[9px] text-[#160211]`}
    >
      {text}
    </div>
  );
};

export default SuggestionCard;
