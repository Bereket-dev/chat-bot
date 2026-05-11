import type React from "react";
import type { ChatMessageProps } from "../types";
import LogoWhite from "../assets/Logo_white.svg";
import LogoBlack from "../assets/Logo_black.svg";
import ReactMarkdown from "react-markdown";
const MessageCard: React.FC<ChatMessageProps> = ({ text, role }) => {
  const isModel = role === "model";
  const isLoading = text === "...";

  return (
    <div className="w-fit max-w-[85%] sm:max-w-[70%] md:max-w-[65%]">
      {/* Role label */}
      <h3
        className={`ms-1 mb-1 text-[12px] leading-tight font-light tracking-tight ${
          isModel
            ? "text-start text-[#160211]/70 dark:text-white/70"
            : "text-end text-[#160211]/60 dark:text-white/60"
        }`}
      >
        {isModel ? "Our AI" : "Me"}
      </h3>

      {/* Message bubble */}
      <div
        className={`flex items-center gap-3 rounded-2xl border p-3 text-[#160211] shadow-sm dark:text-white
          ${
            isModel
              ? "bg-white/95 text-start border-[#160211]/10 dark:bg-white/10 dark:border-white/10 rounded-tl-sm"
              : "bg-[#160211]/5 text-end border-[#160211]/10 dark:bg-black/30 dark:border-white/15 rounded-tr-sm"
          } 
          ${isLoading ? "animate-pulse" : ""}
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
        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
