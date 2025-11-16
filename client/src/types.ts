import type { SetStateAction } from "react";
import type React from "react";

export type ChatMessageProps = {
  role: string;
  text: string;
};

export type SuggestionProps = {
  text: string;
  setChatHistory: React.Dispatch<SetStateAction<ChatMessageProps[]>>;
  generateBotResponse: (history: ChatMessageProps[]) => void;
};


export type ChatFormProps = {
  setChatHistory: React.Dispatch<SetStateAction<ChatMessageProps[]>>;
  generateBotResponse: (history: ChatMessageProps[]) => void;
  isLoading: boolean;
  hasResponded: boolean;
};
