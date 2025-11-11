import type { SetStateAction } from "react";
import type React from "react";

export type ChatMessage = {
  role: string;
  text: string;
};

export type ChatFormProps = {
  setChatHistory: React.Dispatch<SetStateAction<ChatMessage[]>>;
};
