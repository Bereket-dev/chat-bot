import type React from "react";

type SuggestionProp = {
  text: String;
};

const SuggestionCard: React.FC<SuggestionProp> = ({ text }) => {
  return (
    <div className="h-min w-full rounded-lg border border-white bg-white/50 p-[9px] text-[#160211]">
      {text}
    </div>
  );
};

export default SuggestionCard;
