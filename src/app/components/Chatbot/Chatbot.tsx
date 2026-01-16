"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import styles from "./Chatbot.module.css";
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type ChatMessage = {
  id: string;
  text: string;
  isBot: boolean;
  moduleLink?: string;
};

type FlowOption = {
  text: string;
  nextFlow: string;
};

type Flow = {
  id: string;
  message: string;
  options: FlowOption[];
  moduleLink?: string;
  redirect?: string;
};

type ChatbotFlows = {
  flows: Record<string, Flow>;
};

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFlow, setCurrentFlow] = useState<string>("main");
  const [flows, setFlows] = useState<ChatbotFlows | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFlows();
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0 && flows) {
      // Send initial greeting
      showFlow("main");
    }
  }, [isOpen, flows]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function loadFlows() {
    try {
      const response = await fetch("/chatbot-flows.json?v=" + Date.now(), {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const data = await response.json();
      setFlows(data);
      console.log("Loaded chatbot flows:", Object.keys(data.flows).length);
    } catch (error) {
      console.error("Failed to load chatbot flows:", error);
    }
  }

  const showFlow = (flowId: string) => {
    if (!flows) {
      console.error("Flows not loaded yet");
      return;
    }

    const flow = flows.flows[flowId];
    if (!flow) {
      console.error(
        `Flow "${flowId}" not found! Available flows:`,
        Object.keys(flows.flows)
      );
      // Show an error message to the user
      const errorMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: "Sorry, I encountered an error. Let me restart the conversation.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      // Reset to main menu
      setTimeout(() => showFlow("main"), 1000);
      return;
    }

    // Add bot message
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      text: flow.message,
      isBot: true,
      moduleLink: flow.moduleLink,
    };

    setMessages((prev) => [...prev, botMessage]);
    setCurrentFlow(flowId);

    // Handle redirect if specified
    if (flow.redirect) {
      setTimeout(() => {
        router.push(flow.redirect!);
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleOptionClick = (option: FlowOption) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: option.text,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show next flow after brief delay
    setTimeout(() => {
      showFlow(option.nextFlow);
    }, 500);
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentFlow("main");
    showFlow("main");
  };

  if (!flows) return null;

  const currentFlowData = flows.flows[currentFlow];

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <XMarkIcon className={styles.toggleIcon} />
        ) : (
          <ChatBubbleLeftRightIcon className={styles.toggleIcon} />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.mascotContainer}>
              <Image
                src="/assets/images/next-step/sifthr-mascot.webp"
                alt="SIFTHR"
                width={40}
                height={40}
                className={styles.mascotImage}
              />
            </div>
            <div className={styles.headerInfo}>
              <h3 className={styles.chatTitle}>SIFTHR Assistant</h3>
              <p className={styles.chatSubtitle}>Scam Prevention Help</p>
            </div>
            <button
              onClick={resetChat}
              className={styles.resetButton}
              title="Reset conversation"
            >
              <ArrowPathIcon className={styles.resetIcon} />
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.isBot ? styles.botMessage : styles.userMessage
                }`}
              >
                {message.isBot && (
                  <div className={styles.botAvatar}>
                    <Image
                      src="/assets/images/next-step/sifthr-mascot.webp"
                      alt="SIFTHR"
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    {message.text.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.text.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  {message.moduleLink && (
                    <a
                      href={message.moduleLink}
                      className={styles.moduleLink}
                      onClick={() => setIsOpen(false)}
                    >
                      <BookOpenIcon className="w-4 h-4 inline-block mr-1" />
                      Go to Learning Modules →
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Options */}
          {currentFlowData && currentFlowData.options.length > 0 && (
            <div className={styles.optionsContainer}>
              {currentFlowData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={styles.optionButton}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
