import React, { useEffect, useRef } from "react";
import Send from "../assets/Send.svg";
import type { ChatFormProps } from "../types";

const ChatForm: React.FC<ChatFormProps> = ({
  setChatHistory,
  generateBotResponse,
  isLoading,
  hasResponded
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => 
    {
      e.preventDefault();
      const userMessage = inputRef.current?.value.trim();
      if (!userMessage) return;
      if (inputRef.current) inputRef.current.value = "";

      isLoading = true;
      hasResponded = false;
      //update chat history with new user message
      setChatHistory((history) => [
        ...history,
        { role: "user", text: userMessage },
      ]);

      setTimeout(() => {
        setChatHistory((history) => {
          const updated = [...history, { role: "model", text: "" }];
          
          generateBotResponse(updated);

          return updated;
        });
      }, 600);
    }
  

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-10 sm:h-12 md:h-14 w-full items-center dark:border-white/20 justify-between rounded-2xl dark:shadow-gray-900/20 dark:shadow-sm border border-[#160211]/30 bg-white p-[9px] transition-shadow duration-100 ease-in-out focus-within:shadow-lg dark:bg-black"
    >
      <input
        type="text"
        ref={inputRef}
        className="w-full text-[14px] leading-tight font-normal tracking-tight text-black  dark:text-white outline-none placeholder:text-[#A0AEC0]"
        placeholder="Ask me anything!"

      />
      <button type="submit" disabled={isLoading}>
        <img src={Send} alt="Send Icon" className="sm:w-7 w-5 md:w-9" />
      </button>
    </form>
  );
};

export default ChatForm;
