import type React from "react";
import type { ChatMessageProps } from "../types";
import LogoWhite from "../assets/Logo_white.svg";
import LogoBlack from "../assets/Logo_black.svg";

const MessageCard: React.FC<ChatMessageProps> = ({ text, role }) => {
  const isModel = role === "model";
  const isLoading = text === "";

  return (
    <div className="w-fit max-w-[85%] sm:max-w-[70%] md:max-w-[65%]">
      {/* Role label */}
      <h3 className={`ms-1 mb-1 text-[14px] leading-tight font-light tracking-tight dark:text-white ${isModel ? 'text-start min-w-[200px] md:min-w-[200px]' : 'text-end'}`}>
        {isModel ? "Our AI" : "Me"}
      </h3>

      {/* Message bubble */}
      <div
        className={`flex items-center gap-3 rounded-lg border border-white  p-3 text-[#160211] dark:text-white
          ${isModel ? "bg-white/95 dark:bg-gray-300/10 rounded-tl-sm  text-start dark:border-none" : "bg-white/45 dark:bg-black/30  text-end dark:border-white/20 rounded-tr-none"} 
          ${isLoading && "animate-pulse"}
         text-sm md:text-base`}
      >
        {isModel && isLoading && (
          <div className="relative w-6 h-6">
            <img
              src={LogoBlack}
              alt="AI logo"
              className="absolute inset-0 block dark:hidden w-full"
            />
            <img
              src={LogoWhite}
              alt="AI logo (dark)"
              className="absolute inset-0 hidden dark:block w-full"
            />
          </div>
        )}
        <span className="break-words">{text}</span>
      </div>
    </div>
  );
};

export default MessageCard;
