import React, { useRef } from "react";
import Send from "../assets/Send.svg";
import type { ChatFormProps } from "../types";

const ChatForm: React.FC<ChatFormProps> = ({ setChatHistory }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    {
      e.preventDefault();
      const userMessage = inputRef.current?.value.trim();
      if (!userMessage) return;
      if (inputRef.current) inputRef.current.value = "";

      //update chat history with new user message
      setChatHistory((history) => [
        ...history,
        { role: "user", text: userMessage },
      ]);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-14 items-center justify-between rounded-lg border border-[#160211]/30 bg-white p-[9px] transition-shadow duration-100 ease-in-out focus-within:shadow-lg dark:bg-black"
    >
      <input
        type="text"
        ref={inputRef}
        className="w-full text-[14px] leading-tight font-normal tracking-tight text-black outline-none placeholder:text-[#A0AEC0]"
        placeholder="Ask me anything!"
      />
      <button type="submit">
        <img src={Send} alt="Send Icon" className="w-9" />
      </button>
    </form>
  );
};

export default ChatForm;
