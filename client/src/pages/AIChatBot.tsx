import { useEffect, useRef, useState } from "react";
import LogoBlack from "../assets/Logo_black.svg";
import LogoWhite from "../assets/Logo_white.svg";
import SuggestionCard from "../components/SuggestionCard";
import ThemeToggle from "../components/ThemeToggle";
import { useToggleObserver } from "../hooks/useToggleObserver";
import ChatForm from "../components/ChatForm";
import type { ChatMessageProps } from "../types";
import MessageCard from "../components/MessageCard";
import { suggestedQueries } from "../Data/suggestions";
import { aiResponseAPI } from "../services/aiResponse";

const AIChatBot = () => {
  const { isDark } = useToggleObserver();
  const [chatHistory, setChatHistory] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll when new messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);



  const [questionCount, setQuestionCount] = useState<number>(0); // track questions
  const [isGuessing, setIsGuessing] = useState<boolean>(true); // only guess when true

  const generateBotResponse = async (history: ChatMessageProps[]) => {
    try {
      setIsLoading(true);

      const userLastMessage = history[history.length - 2]?.text ?? "";
      const newQuestionCount = questionCount + 1;


      if (userLastMessage.includes("guess")) {
        setQuestionCount(1);
        setIsGuessing(true)
      }

      // Decide if AI should guess or ask a new question
      const shouldGuess = newQuestionCount > 4;

      const enhancedPrompt = `
You are an AI chatbot whose goal is to guess the user's AGE RANGE.

Rules:
1. Ask **up to 4 short, direct questions** about hobbies, interests, or personality to guess the age.
2. Each question: 1 sentence, ≤50 characters.
3. After 4 questions OR if confident, output the **age range**.
4. **Immediately after the age range**, always provide a short, funny/humorous argument explaining why you guessed that age.
5. Then provide a brief, witty comment about the user's last message.
6. Never repeat questions or ask personal info (name, location, income, ID).
7. Keep everything playful, short, and structured: 
   - Question(s) → Age guess → Funny argument → Witty reply.
8. Don't use guess keyword in normal conversation use it only to initialize the guess agin.
9. You must ask only one question at a time.
Never combine multiple questions in a single message. Do not stack questions.
Ask the next question only after the user answers the previous one.
10. The response should be in the plain text markdown to insert in react-markdown with right spacing, linespace and don't put sentences without space or new line make it clean paragraph like with space and remove repetitive questions.
12. Don't create repetitive questions even if they found in different chunks they should be uniques and one is explanatory for other.
Decide whether to ask or guess:
${isGuessing && questionCount >= 4
          ? "Stop asking. Make your age guess now and always include the funny reasoning and a witty reply."
          : "Ask 1 short question to get closer to guessing the age."
        }}

User said:
"${userLastMessage}"
${isGuessing ? "" : "Do NOT guess; explain or comment only. If the user ask the reason but your need to argue strongly not the source in clear and funny way. If they want to guess again let give the keyword in the response in normal way like let's guess again or including guess keyword."}
`;

      const messages: string[] = [enhancedPrompt];
      const response: string = await aiResponseAPI(messages);
      const responseMsg: string = JSON.parse(response).response;

      if (!responseMsg) throw new Error("Network Error! Pls try again later!");

      // Append bot response
      setChatHistory(prev => {
        if (prev.length === 0) return prev;

        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = {
          ...last,
          text: (last.text ?? "") + " " + responseMsg
        };
        return updated;
      });

      if (responseMsg.includes("Age Range:") || responseMsg.match(/\d{1,2}-\d{1,2}/)) {
        setIsGuessing(false);
        setQuestionCount(0);
      }


      // Update question count only if AI actually asked a question
      if (!shouldGuess) {
        setQuestionCount(newQuestionCount);
      }

    } catch (error) {
      console.error("Error generating bot response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden max-w-screen bg-white dark:bg-linear-to-br dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#000000]">
      {/* Dark mode toggle */}
      <div className="fixed top-10 right-10 z-10">
        <ThemeToggle />
      </div>

      {/* Main glowing gradient */}
      <div className="pointer-events-none fixed inset-0">
        <div className="fixed -bottom-30 left-[44%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#FF86E1] dark:bg-black blur-[200px] md:h-[414px] md:w-[414px]"></div>

        <div className="fixed bottom-30 left-[50%] h-[200px] w-[200px] rounded-full bg-[#89BCFF] dark:bg-black blur-[200px] md:h-[280px] md:w-[280px]"></div>
      </div>

      <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-100px)] mb-24 
  w-[90vw] max-w-[900px] mx-auto px-5 sm:px-10">
        {/* Your Chatbot content */}
        <div className="mx-auto mt-20 flex flex-col items-center gap-12 text-black">
          <img
            src={isDark ? LogoWhite : LogoBlack}
            alt="AI icon"
            className="w-9"
          />
          <h1 className="mb-[50px] text-lg sm:text-xl lg:text-2xl md:text-3xl leading-tight font-normal tracking-tight dark:text-white">
            Ask our AI anything
          </h1>
        </div>

        <div className="w-full">
          {chatHistory.length > 0 ? (
            <div className="flex flex-col space-y-3">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.role === "model" ? "justify-start" : "justify-end"
                    }`}
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

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-10 
  w-[90vw] max-w-[700px] px-7 sm:px-12">
        <ChatForm
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
          isLoading={isLoading}
        />
      </div>
      {/* Invisible div to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
};

export default AIChatBot;
