import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Send } from "lucide-react";
import { LiquidMetal, PulsingBorder } from "@paper-design/shaders-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function ChatInterface() {
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: reference to the scrollable messages container (not the page)
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll the messages container itself (prevents page-level scrolling)
  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Only auto scroll DOWN when there are messages (not on initial load)
    if (messages.length > 0) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const onSubmit = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = prompt; // Store before clearing
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm sorry, I couldn't generate a response.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // ensure we’re scrolled after loading
      requestAnimationFrame(scrollToBottom);
    }
  };

  return (
    // Remove min-h-screen and use normal height
    <div className="flex flex-col bg-black">
      {/* Main Chat Container (same max width as input) */}
      <div className="flex flex-col max-w-2xl mx-auto w-full px-4">
        {messages.length === 0 ? (
          /* Initial Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full pt-6">
            <div className="flex flex-row items-center mb-1.5">
              {/* Shader Circle */}
              <motion.div
                id="circle-ball"
                className="relative flex items-center justify-center z-10"
                animate={{
                  y: isFocused ? 50 : 0,
                  opacity: isFocused ? 0 : 100,
                  filter: isFocused ? "blur(4px)" : "blur(0px)",
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <div className="z-10 absolute bg-white/5 h-11 w-11 rounded-full backdrop-blur-[3px]">
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-4 left-4  blur-[1px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-3 left-7  blur-[0.8px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-8 left-2  blur-[1px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-5 left-9 blur-[0.8px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-7 left-7  blur-[1px]" />
                </div>
                <LiquidMetal
                  style={{
                    height: 80,
                    width: 80,
                    filter: "blur(14px)",
                    position: "absolute",
                  }}
                  colorBack="hsl(0, 0%, 0%, 0)"
                  colorTint="hsl(29, 77%, 49%)"
                  repetition={4}
                  softness={0.5}
                  shiftRed={0.3}
                  shiftBlue={0.3}
                  distortion={0.1}
                  contour={1}
                  shape="circle"
                  offsetX={0}
                  offsetY={0}
                  scale={0.58}
                  rotation={50}
                  speed={5}
                />
                <LiquidMetal
                  style={{ height: 80, width: 80 }}
                  colorBack="hsl(0, 0%, 0%, 0)"
                  colorTint="hsl(29, 77%, 49%)"
                  repetition={4}
                  softness={0.5}
                  shiftRed={0.3}
                  shiftBlue={0.3}
                  distortion={0.1}
                  contour={1}
                  shape="circle"
                  offsetX={0}
                  offsetY={0}
                  scale={0.58}
                  rotation={50}
                  speed={5}
                />
              </motion.div>

              {/* Greeting Text */}
              <motion.p
                className="text-white/40 text-sm font-light z-10 ml-4"
                animate={{
                  y: isFocused ? 50 : 0,
                  opacity: isFocused ? 0 : 100,
                  filter: isFocused ? "blur(4px)" : "blur(0px)",
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                Hey there! I'm SolMate, here to help with anything you need
              </motion.p>
            </div>
          </div>
        ) : (
          /* Chat Box with fixed height and internal scrolling */
          <div className="flex flex-col relative">
            {/* Glowing Border Effect */}
            <motion.div
              className="absolute w-full h-full z-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <PulsingBorder
                style={{ height: "100%", width: "100%" }}
                colorBack="hsl(0, 0%, 0%)"
                roundness={0.18}
                thickness={0}
                softness={0}
                intensity={0.2}
                bloom={1.5}
                spots={2}
                spotSize={0.25}
                pulse={0}
                smoke={0.25}
                smokeSize={0.3}
                scale={0.9}
                rotation={0}
                offsetX={0}
                offsetY={0}
                speed={1}
                colors={[
                  "hsl(29, 70%, 37%)",
                  "hsl(32, 100%, 83%)",
                  "hsl(4, 32%, 30%)",
                  "hsl(25, 60%, 50%)",
                  "hsl(0, 100%, 10%)",
                ]}
              />
            </motion.div>

            {/* Chat Container (fixed height) */}
            <div className="flex flex-col bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] overflow-hidden relative z-10 h-[420px] min-h-0">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a2a] bg-[#111111] flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white/80 text-sm font-medium">SolMate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-white/60 text-xs">Online</span>
                </div>
              </div>

              {/* Messages Area (this is the ONLY scrollable region) */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3 shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                            : "bg-[#1a1a1a] text-white border border-[#3a3a3a]"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === "user"
                              ? "text-orange-100"
                              : "text-white/50"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-3 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-white/60 text-sm">
                          SolMate is thinking...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom, same width, minimal gap */}
      <div className="flex-shrink-0 px-4 pb-2 pt-0">
        <div className="max-w-2xl mx-auto relative">
          <motion.div
            className="absolute w-full h-full z-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <PulsingBorder
              style={{ height: "100%", width: "100%" }}
              colorBack="hsl(0, 0%, 0%)"
              roundness={0.18}
              thickness={0}
              softness={0}
              intensity={0.3}
              bloom={2}
              spots={2}
              spotSize={0.25}
              pulse={0}
              smoke={0.35}
              smokeSize={0.4}
              scale={1}
              rotation={0}
              offsetX={0}
              offsetY={0}
              speed={1}
              colors={[
                "hsl(29, 70%, 37%)",
                "hsl(32, 100%, 83%)",
                "hsl(4, 32%, 30%)",
                "hsl(25, 60%, 50%)",
                "hsl(0, 100%, 10%)",
              ]}
            />
          </motion.div>

          <motion.div
            className="relative bg-[#040404] rounded-2xl p-3 z-10 border border-[#3D3D3D]"
            animate={{
              borderColor: isFocused ? "#BA9465" : "#3D3D3D",
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <div className="relative mb-2">
              <Textarea
                ref={textareaRef}
                placeholder="Ask me anything..."
                value={prompt}
                className="min-h-[40px] max-h-36 overflow-y-auto resize-none bg-transparent border-none text-white text-base placeholder:text-zinc-500 [&:focus]:ring-0 [&:focus]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:outline-none"
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* Model selector */}
              <div className="flex items-center">
                <Select defaultValue="gemini-2.5-pro">
                  <SelectTrigger className="bg-zinc-900 border-[#3D3D3D] text-white hover:bg-zinc-700 text-xs rounded-full px-3 h-6 min-w-[110px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">⚡</span>
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-[#3D3D3D] rounded-xl z-30">
                    <SelectItem
                      value="gemini-2.5-pro"
                      className="text-white hover:bg-zinc-700 rounded-lg"
                    >
                      Gemini 2.5 Pro
                    </SelectItem>
                    <SelectItem
                      value="gpt-4"
                      className="text-white hover:bg-zinc-700 rounded-lg"
                    >
                      GPT-4
                    </SelectItem>
                    <SelectItem
                      value="claude-3"
                      className="text-white hover:bg-zinc-700 rounded-lg"
                    >
                      Claude 3
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Send button */}
              <Button
                onClick={onSubmit}
                disabled={!prompt.trim() || isLoading}
                size="sm"
                className="h-6 w-6 rounded-full bg-orange-600 hover:bg-orange-700 text-white p-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
