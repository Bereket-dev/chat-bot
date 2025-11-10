import LogoBlack from "../assets/Logo_black.svg";
import LogoWhite from "../assets/Logo_white.svg";
import Send from "../assets/Send.svg";
import SuggestionCard from "../components/SuggestionCard";
import ThemeToggle from "../components/ThemeToggle";
import { useState, useEffect } from "react";

const AIChatBot = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white dark:bg-black">
      {/* Dark mode toggle */}
      <div className="absolute top-10 right-10 z-10">
        <ThemeToggle />
      </div>
      {/* Main glowing gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-30 left-[44%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#FF86E1] blur-[200px] md:h-[414px] md:w-[414px]"></div>

        <div className="absolute bottom-30 left-[50%] h-[200px] w-[200px] rounded-full bg-[#89BCFF] blur-[200px] md:h-[280px] md:w-[280px]"></div>
      </div>
      <div className="relative flex h-full flex-col items-center justify-between px-4 md:mx-auto md:max-w-[899px]">
        {/* Your Chatbot content */}
        <div className="mx-auto mt-20 flex flex-col items-center gap-12 text-black">
          <img
            src={isDark ? LogoWhite : LogoBlack}
            alt="AI icon"
            className="w-9"
          />
          <h1 className="mb-6 text-[21px] leading-tight font-normal tracking-tight dark:text-white">
            Ask our AI anything
          </h1>
        </div>
        <div className="mx-5 mb-9 w-full px-4 sm:mx-10 md:mx-auto md:max-w-[899px]">
          <div className="space-y-5">
            <h2 className="leading-tight font-medium tracking-tight text-[#56637E] dark:text-white/80">
              Suggestions on what to ask Our AI
            </h2>
            <div className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              <SuggestionCard text="What can I ask you to do?" />
              <SuggestionCard text="Which one of my projects is performing the best?" />
              <SuggestionCard text="What projects should I be concerned about right now?" />
            </div>
          </div>
          <form
            action=""
            onSubmit={() => console.log("submitted")}
            className="mt-[38px] flex h-14 items-center justify-between rounded-lg border border-[#160211]/30 bg-white p-[9px] transition-shadow duration-100 ease-in-out focus-within:shadow-lg"
          >
            <input
              type="text"
              className="w-full text-[14px] leading-tight font-normal tracking-tight text-black outline-none placeholder:text-[#A0AEC0]"
              placeholder="Ask me anything!"
            />
            <button type="submit">
              <img src={Send} alt="Send Icon" className="w-9" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
