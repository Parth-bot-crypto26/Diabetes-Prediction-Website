import { useState, useEffect } from "react";

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [currentGreeting, setCurrentGreeting] = useState(0);
  
  const greetings = [
    { text: "Welcome", lang: "English" },
    { text: "नमस्ते", lang: "Hindi" },
    { text: "Hola", lang: "Spanish" },
    { text: "Bonjour", lang: "French" },
    { text: "Guten Tag", lang: "German" },
    { text: "Ciao", lang: "Italian" },
    { text: "こんにちは", lang: "Japanese" },
    { text: "你好", lang: "Chinese" },
    { text: "السلام عليكم", lang: "Arabic" },
    { text: "Olá", lang: "Portuguese" },
    { text: "Привет", lang: "Russian" },
    { text: "안녕하세요", lang: "Korean" },
    { text: "Sawubona", lang: "Zulu" },
    { text: "Hej", lang: "Swedish" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentGreeting((prev) => {
        if (prev < greetings.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 1000);
          return prev;
        }
      });
    }, 500);

    return () => clearInterval(timer);
  }, [onLoadingComplete, greetings.length]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="loading-text">
          <h1 className="text-6xl font-bold text-black mb-4">
            {greetings[currentGreeting].text}
          </h1>
          <p className="text-lg text-gray-600">
            {greetings[currentGreeting].lang}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;