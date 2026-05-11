import { useEffect, useRef, useState } from "react";
import LogoBlack from "../assets/Logo_black.svg";
import LogoWhite from "../assets/Logo_white.svg";
import SuggestionCard from "../components/SuggestionCard";
import ThemeToggle from "../components/ThemeToggle";
import { useToggleObserver } from "../hooks/useToggleObserver";
import ChatForm from "../components/ChatForm";
import type { ChatMessageProps } from "../types";
import MessageCard from "../components/MessageCard";
import ErrorAlert from "../components/ErrorAlert";
import { suggestedQueries } from "../Data/suggestions";
import { aiResponseAPI } from "../services/aiResponse";

const AIChatBot = () => {
  const { isDark } = useToggleObserver();
  const [chatHistory, setChatHistory] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto scroll when new messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const [questionCount, setQuestionCount] = useState<number>(0); // track questions
  const [isGuessing, setIsGuessing] = useState<boolean>(true); // only guess when true
  const questionCountRef = useRef<number>(0);
  const isGuessingRef = useRef<boolean>(true);

  const setQuestionCountSafe = (next: number) => {
    questionCountRef.current = next;
    setQuestionCount(next);
  };

  const setIsGuessingSafe = (next: boolean) => {
    isGuessingRef.current = next;
    setIsGuessing(next);
  };

  const generateBotResponse = async (history: ChatMessageProps[]) => {
    try {
      setIsLoading(true);

      const userLastMessage = history[history.length - 1]?.text ?? "";
      const currentQuestionCount = questionCountRef.current;
      const currentIsGuessing = isGuessingRef.current;

      const isReset = /\bguess\b/i.test(userLastMessage);
      if (isReset) {
        setQuestionCountSafe(0);
        setIsGuessingSafe(true);
      }

      const effectiveIsGuessing = isReset ? true : currentIsGuessing;
      const effectiveQuestionCount = isReset ? 0 : currentQuestionCount;
      const canAskQuestion = effectiveIsGuessing && effectiveQuestionCount < 4;

      const enhancedPrompt = `
You are an AI chatbot whose mission is to guess the user's AGE RANGE.

### GENERAL RULES
1. You may ask **a maximum of 4 questions per guessing session**.
2. Ask **only ONE question per message**. Never stack or combine questions.
3. Every question must be:
   - ≤ 1 sentence
   - ≤ 50 characters
   - About hobbies, interests, habits, or personality.
4. Never repeat a question or ask two questions with the same meaning.
5. No personal info: NEVER ask name, location, income, ID, contact, or private details.
6. The conversation structure must always be:
   - **One question (if allowed)**
   - → **Age range guess (after 4 questions or when confident)**
   - → **Short funny argument** for the age guess
   - → **Witty comment** about the user’s last message.

### GUESSING LOGIC
- You can only ask a question if:
  - \`isGuessing = true\`
  - AND \`questionCount < 4\`

- If \`questionCount >= 4\`, you MUST stop asking and immediately give:
  - Your **final age range** (max 4-year spread)
  - A funny justification
  - A witty comment

### MARKDOWN RULES
- Use clean **plain-text markdown**.
- Proper spacing and line breaks.
- No walls of text.
- No duplicate sentences.
- No repeated questions even across different messages.

### WHEN USER ASKS TO GUESS AGAIN
- Include the keyword **"guess"** naturally, like:
  - "Let’s guess again!"
  - "Okay, we can guess now."

### SPECIAL CONDITION
${canAskQuestion
          ? "Ask exactly ONE short question to get closer to the age."
          : "STOP asking questions. Make the final age guess with humor and a witty reply."
        }

### UI CONTEXT
- If you ask a question, end it with a single '?'.
- If you make a final guess, include a line that starts with: "Age Range:"

### USER SAID:
"${userLastMessage}"

${effectiveIsGuessing ? "" : "Do NOT guess now. Only explain, comment, or argue in a playful and funny way if needed."}
`;

      const messages: string[] = [enhancedPrompt];
      const result = await aiResponseAPI(messages);
      const parsedOuter = typeof result === "string" ? JSON.parse(result) : result;
      const response: string = parsedOuter.response;
      const responseObj = JSON.parse(response);
      if (!responseObj.success) {
        throw new Error(
          responseObj.error || "Something went wrong! Pls try again later!"
        );
      }

      const responseMsg: string = responseObj.message;
      if (!responseMsg) throw new Error("Network Error! Pls try again later!");

      // Append bot response
      setChatHistory(prev => [...prev, { role: "model", text: responseMsg }]);

      const containsAgeGuess =
        /Age Range:/i.test(responseMsg) || /\b\d{1,2}\s*-\s*\d{1,2}\b/.test(responseMsg);
      const containsQuestion = /\?/.test(responseMsg);

      if (containsAgeGuess) {
        setIsGuessingSafe(false);
        setQuestionCountSafe(0);
      }

      if (!containsAgeGuess && containsQuestion && isGuessingRef.current) {
        setQuestionCountSafe(Math.min(4, questionCountRef.current + 1));
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong! Try again.";

      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMsg)
      setTimeout(() => setErrorMsg(null), 3000)
  }, [setErrorMsg, errorMsg])

  const questionsLeft = isGuessing ? Math.max(0, 4 - questionCount) : 0;
  const resetGame = () => {
    setChatHistory([]);
    setQuestionCountSafe(0);
    setIsGuessingSafe(true);
    setErrorMsg(null);
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

      <div className="relative flex flex-col items-center min-h-screen w-[92vw] max-w-[900px] mx-auto px-4 sm:px-8 pb-32">
        {/* Your Chatbot content */}
        <div className="mx-auto mt-16 flex flex-col items-center gap-6 text-black">
          <img
            src={isDark ? LogoWhite : LogoBlack}
            alt="AI icon"
            className="w-9"
          />
          <h1 className="mb-[50px] text-lg sm:text-xl lg:text-2xl md:text-3xl leading-tight font-normal tracking-tight dark:text-white">
            Let me guess your age
          </h1>
        </div>

        {/* Error message */}
        {errorMsg && <ErrorAlert message={errorMsg} onClose={() => setErrorMsg(null)} />}
        <div className="w-full">
          <div className="rounded-3xl border border-[#160211]/15 bg-white/75 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/20 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium tracking-tight text-[#160211]/80 dark:text-white/90">
                  {isGuessing ? "4 questions max — then I guess" : "Guess complete"}
                </h2>
                <p className="text-xs text-[#56637E] dark:text-white/70">
                  {isGuessing
                    ? `Questions left: ${questionsLeft}`
                    : `Type "guess again" to restart.`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map(i => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        isGuessing && i < questionCount
                          ? "bg-[#160211] dark:bg-white"
                          : "bg-[#160211]/15 dark:bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-full border border-[#160211]/10 bg-white/70 px-3 py-1 text-xs text-[#160211]/80 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-black/20 dark:text-white/80 dark:hover:bg-black/30"
                >
                  New game
                </button>
              </div>
            </div>

            {chatHistory.length > 0 ? (
              <div className="max-h-[55vh] overflow-y-auto pr-1">
                <div className="flex flex-col space-y-3">
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        chat.role === "model" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <MessageCard text={chat.text} role={chat.role} />
                    </div>
                  ))}
                  {isLoading && <MessageCard text={"..."} role={"model"} />}
                  <div ref={bottomRef} />
                </div>
              </div>
            ) : (
              <>
                {suggestedQueries.length > 0 && (
                  <div className="space-y-5">
                    <h2 className="leading-tight font-medium tracking-tight text-[#56637E] dark:text-white/80">
                      Tap a starter to begin
                    </h2>
                    <p className="text-xs leading-relaxed text-[#56637E] dark:text-white/60">
                      I’ll ask up to 4 quick questions about vibes, hobbies, and habits — then I’ll guess your age range.
                    </p>
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
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-10 
  w-[90vw] max-w-[700px] px-7 sm:px-12">
        <ChatForm
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AIChatBot;
