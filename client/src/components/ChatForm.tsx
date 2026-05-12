import React, { useEffect, useRef } from "react";
import Send from "../assets/Send.svg";
import type { ChatFormProps } from "../types";

const ChatForm: React.FC<ChatFormProps> = ({
  setChatHistory,
  generateBotResponse,
  isLoading
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;
    if (inputRef.current) inputRef.current.value = "";

    const userEntry = { role: "user" as const, text: userMessage };
    setChatHistory(prev => {
      const updatedHistory = [...prev, userEntry];
      queueMicrotask(() => generateBotResponse(updatedHistory));
      return updatedHistory;
    });


    // Keep input focused
    inputRef.current?.focus();
  };



  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-10 w-full items-center justify-between rounded-2xl border border-[#160211]/15 bg-white/80 p-[9px] shadow-sm backdrop-blur-md transition-shadow duration-100 ease-in-out focus-within:shadow-lg sm:h-12 md:h-14 dark:border-white/15 dark:bg-black/35 dark:shadow-gray-900/20"
    >
      <input
        type="text"
        ref={inputRef}
        className="w-full text-[14px] leading-tight font-normal tracking-tight text-black outline-none placeholder:text-[#56637E]/60 dark:text-white dark:placeholder:text-white/45"
        placeholder="Ask me anything!"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        <img src={Send} alt="Send Icon" className="sm:w-7 w-5 md:w-9" />
      </button>
    </form>
  );
};

export default ChatForm;
