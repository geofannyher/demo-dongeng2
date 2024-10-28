import { useEffect, useState } from "react";

const TypewriterEffect = ({ text }: any) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");

    const intervalId = setInterval(() => {
      setDisplayedText((oldText) => {
        if (oldText.length < text.length) {
          return oldText + text.charAt(oldText.length);
        } else {
          clearInterval(intervalId);
          return oldText;
        }
      });
    }, 30);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="text-white">
      <div dangerouslySetInnerHTML={{ __html: displayedText }} />
    </div>
  );
  // <span className="text-white">{displayedText}</span>;
};

export default TypewriterEffect;
