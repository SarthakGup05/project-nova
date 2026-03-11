"use client";

import React, { useState, useEffect, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const textRef = React.useRef<HTMLDivElement>(null);

  const updateWidthForWord = () => {
    if (textRef.current) {
      // Add padding to the text width (32px total)
      const textWidth = textRef.current.scrollWidth + 32;
      setWidth(textWidth);
    }
  };

  useEffect(() => {
    // Update width whenever the word changes
    updateWidthForWord();
  }, [currentWordIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <motion.span // Changed from <p> to <span> for better inline behavior in H1 tags
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-4 py-1 text-center font-bold",
        // Semantic Theme Colors instead of hardcoded hex values
        "bg-primary text-primary-foreground border border-primary/20",
        // Premium soft shadow
        "shadow-[0_10px_30px_rgba(0,0,0,0.15)]",
        className
      )}
      key={words[currentWordIndex]}
    >
      <motion.div
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        // Added whitespace-nowrap so long words don't accidentally break into two lines
        className={cn("inline-block whitespace-nowrap", textClassName)}
        ref={textRef}
        layoutId={`word-div-${words[currentWordIndex]}-${id}`}
      >
        <div className="inline-block">
          {words[currentWordIndex].split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: "blur(8px)",
                y: 10, // Added a slight Y offset for a nicer "flip up" feel
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              }}
              transition={{
                delay: index * 0.02,
              }}
              className="inline-block"
            >
              {/* Preserves actual spaces between words if you pass multi-word strings */}
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.span>
  );
}