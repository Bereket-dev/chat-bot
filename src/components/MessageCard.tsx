import type React from "react";
import type { ChatMessageProps } from "../types";
import LogoWhite from "../assets/Logo_white.svg";

const MessageCard: React.FC<ChatMessageProps> = ({ text, role }) => {
  return (
    <div>
      <h3 className="ms-1 mb-1 text-[14px] dark:text-white leading-tight font-light tracking-tight">
        {role == "model" ? "Our AI" : "Me"}
      </h3>
      <div
        className={`flex ${text == "" && "animate-pulse"} ${role == "model" ? "w-[200px] bg-white/50 md:w-[400px] lg:w-[572px]" : "w-full bg-white/90"} min-w-[100px] items-center gap-4 rounded-lg border border-white p-[9px] text-[#160211]`}
      >
        {role == "model" && text == "" && (
          <img src={LogoWhite} alt="ai logo icon" className="w-[24px]" />
        )}
        {text}
      </div>
    </div>
  );
};

export default MessageCard;
