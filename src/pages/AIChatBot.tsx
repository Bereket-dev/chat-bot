import { useEffect, useRef, useState } from "react";
import LogoBlack from "../assets/Logo_black.svg";
import LogoWhite from "../assets/Logo_white.svg";
import SuggestionCard from "../components/SuggestionCard";
import ThemeToggle from "../components/ThemeToggle";
import { useToggleObserver } from "../hooks/useToggleObserver";
import ChatForm from "../components/ChatForm";
import type { ChatMessageProps } from "../types";
import MessageCard from "../components/MessageCard";
import { suggestedQueries } from "../utils/getSuggestions";
import getRandomPrompt from "../utils/getRandomPrompt";
import generateResponse from "../utils/generateResponse";

const AIChatBot = () => {
  const { isDark } = useToggleObserver();
  const [chatHistory, setChatHistory] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading]=useState<boolean>(false);
   const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever chatHistory changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  let message:string[] = [];
  const generateBotResponse = async(history:ChatMessageProps[]) => {
    try {
    setIsLoading(true);

    const enhancedPrompt = getRandomPrompt(history[history.length - 2].text);
    message.push(enhancedPrompt);

    const response:string = await generateResponse(message);
    setChatHistory(prev => {
  if (prev.length === 0) return prev; // nothing to update

  const updated = [...prev];
  updated[updated.length - 1] = { ...updated[updated.length - 1], text: response };
  return updated;
});

      } catch (error) {
       console.error('Error generating bot response:', error);
    } finally{
      setIsLoading(false)
    }
  };
  
  return (
    <div className="relative min-h-screen h-fit max-w-screen overflow-hidden bg-white dark:bg-black">
      {/* Dark mode toggle */}
      <div className="absolute top-10 right-10 z-10">
        <ThemeToggle />
      </div>
      {/* Main glowing gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-30 left-[44%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#FF86E1] blur-[200px] md:h-[414px] md:w-[414px]"></div>

        <div className="absolute bottom-30 left-[50%] h-[200px] w-[200px] rounded-full bg-[#89BCFF] blur-[200px] md:h-[280px] md:w-[280px]"></div>
      </div>
      <div className="relative flex min-h-[calc(100vh-100px)] flex-col items-center justify-between px-4 md:mx-auto md:max-w-[899px]">
        {/* Your Chatbot content */}
        <div className="mx-auto mt-20 flex flex-col items-center gap-12 text-black">
          <img
            src={isDark ? LogoWhite : LogoBlack}
            alt="AI icon"
            className="w-9"
          />
          <h1 className="mb-[50px] text-[21px] leading-tight font-normal tracking-tight dark:text-white">
            Ask our AI anything
          </h1>
        </div>
        <div className="mx-5 w-full px-4 sm:mx-10 md:mx-auto md:max-w-[899px]">
          {chatHistory.length > 0 ? (
            <div className="space-y-3">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.role == "model" ? "justify-end" : "justify-start"}`}
                >
                  <MessageCard text={chat.text} role={chat.role} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {suggestedQueries.length > 0 && (
                <div className="space-y-5">
                  <h2 className="leading-tight font-medium tracking-tight text-[#56637E] dark:text-white/80">
                    Suggestions on what to ask Our AI
                  </h2>
                  <div className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                    {suggestedQueries.map((query, index) => (
                      <SuggestionCard
                        key={index}
                        setChatHistory={setChatHistory}
                        text={query}
                        generateBotResponse={generateBotResponse}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
      </div>
        </div>
<div className="fixed z-10 bottom-5 left-1/2 -translate-x-1/2 
                w-[90vw] max-w-[600px] sm:max-w-[700px] md:max-w-[899px]">
            <ChatForm
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
              isLoading = {isLoading}
            />
          </div>
           {/* Invisible div to scroll into view */}
      <div className="" ref={bottomRef} />
    </div>
  );
};

export default AIChatBot;
