"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Plus,
  Settings,
  HelpCircle,
  Wrench,
  Send,
  Upload,
  Mic,
  Sun,
  Moon,
  User,
  Menu,
  X,
  MessageSquare,
  Trash2,
  Copy,
  MoreHorizontal,
  Sparkles,
  Bot,
  Paperclip
} from "lucide-react";

// i18n translations
const translations = {
  en: {
    newChat: "New Chat",
    today: "Today",
    yesterday: "Yesterday",
    previousDays: "Previous 7 Days",
    settings: "Settings",
    tools: "Tools",
    help: "Help",
    placeholder: "Message LEO...",
    send: "Send",
    upload: "Upload",
    voice: "Voice",
    welcome: "Welcome back",
    chatTitle: "New Conversation",
    defaultMessage: "Hello! I'm LEO, your AI assistant. How can I help you today?",
    login: "Login",
    copyMessage: "Copy",
    deleteMessage: "Delete",
    thinking: "Thinking...",
    sidebarTitle: "LEO Chat",
    closeSidebar: "Close sidebar",
    openSidebar: "Open sidebar",
    connectionError: "Connection error. Please try again.",
    sendingMessage: "Sending...",
    newConversation: "Start a new conversation"
  },
  zh: {
    newChat: "新对话",
    today: "今天",
    yesterday: "昨天",
    previousDays: "过去 7 天",
    settings: "设置",
    tools: "工具",
    help: "帮助",
    placeholder: "输入消息...",
    send: "发送",
    upload: "上传",
    voice: "语音",
    welcome: "欢迎回来",
    chatTitle: "新对话",
    defaultMessage: "你好！我是 LEO，您的 AI 助手。今天我能为您做些什么？",
    login: "登录",
    copyMessage: "复制",
    deleteMessage: "删除",
    thinking: "思考中...",
    sidebarTitle: "LEO 助手",
    closeSidebar: "关闭侧边栏",
    openSidebar: "打开侧边栏",
    connectionError: "连接错误，请重试。",
    sendingMessage: "发送中...",
    newConversation: "开始新对话"
  }
};

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Thread {
  thread_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

// Floating blob component
const FloatingBlob = ({
  size,
  position,
  delay = 0,
  color
}: {
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
  color: string;
}) => (
  <motion.div
    className="absolute pointer-events-none rounded-full blur-3xl"
    style={{
      width: size,
      height: size,
      background: color,
      ...position
    }}
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.5, 0.3]
    }}
    transition={{
      duration: 15 + delay,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

// Chat item component for sidebar
function ChatItem({
  thread,
  index,
  isActive,
  onDelete,
  defaultTitle
}: {
  thread: Thread;
  index: number;
  isActive: boolean;
  onDelete: (e: React.MouseEvent, threadId: string) => void;
  defaultTitle: string;
}) {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.push(`/workspace/${thread.thread_id}`)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
        isActive
          ? "bg-white/20 dark:bg-white/10"
          : "hover:bg-white/10"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
    >
      <MessageSquare size={16} className="text-slate-400 flex-shrink-0" />
      <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
        {thread.title || defaultTitle}
      </span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <span
          className="p-1 hover:bg-white/20 rounded cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <MoreHorizontal size={14} className="text-slate-400" />
        </span>
        <span
          onClick={(e) => onDelete(e, thread.thread_id)}
          className="p-1 hover:bg-white/20 rounded cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <Trash2 size={14} className="text-slate-400" />
        </span>
      </div>
    </motion.button>
  );
}

// Date section component for sidebar
function DateSection({
  title,
  items,
  startIndex,
  currentThreadId,
  onDelete,
  defaultTitle
}: {
  title: string;
  items: Thread[];
  startIndex: number;
  currentThreadId: string | null;
  onDelete: (e: React.MouseEvent, threadId: string) => void;
  defaultTitle: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-slate-400/70 uppercase tracking-wider mb-2 px-3">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((thread, i) => (
          <ChatItem
            key={thread.thread_id}
            thread={thread}
            index={startIndex + i}
            isActive={currentThreadId === thread.thread_id}
            onDelete={onDelete}
            defaultTitle={defaultTitle}
          />
        ))}
      </div>
    </div>
  );
}

// Sidebar component with Next.js router integration
function Sidebar({
  isOpen,
  setIsOpen,
  lang,
  threads,
  currentThreadId,
  onThreadDeleted
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lang: "en" | "zh";
  threads: Thread[];
  currentThreadId: string | null;
  onThreadDeleted?: () => void;
}) {
  const router = useRouter();
  const t = translations[lang];

  // Group threads by date
  const today = threads.filter(c => {
    const date = new Date(c.updated_at);
    const todayDate = new Date();
    return date.toDateString() === todayDate.toDateString();
  });

  const yesterday = threads.filter(c => {
    const date = new Date(c.updated_at);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    return date.toDateString() === yesterdayDate.toDateString();
  });

  const previous = threads.filter(c => {
    const date = new Date(c.updated_at);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    return date < yesterdayDate;
  });

  const handleNewChat = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/threads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "" })
      });
      const data = await res.json();
      router.push(`/workspace/${data.thread_id}`);
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  };

  const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE_URL}/api/threads/${threadId}`, { method: "DELETE" });
      if (currentThreadId === threadId) {
        router.push("/workspace");
      }
      onThreadDeleted?.();
    } catch (error) {
      console.error("Failed to delete thread:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          flex-shrink-0 h-full glass-panel z-50 flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-72" : "w-0 lg:w-0 overflow-hidden"}
        `}
      >
        <div className="flex flex-col h-full w-72">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <motion.h1
                  className="text-lg font-serif font-bold text-slate-800 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t.sidebarTitle}
                </motion.h1>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* New Chat Button */}
            <motion.button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-2xl mb-6 shadow-lg shadow-orange-500/25"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              {t.newChat}
            </motion.button>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto">
              <DateSection
                title={t.today}
                items={today}
                startIndex={0}
                currentThreadId={currentThreadId}
                onDelete={handleDeleteThread}
                defaultTitle={t.newConversation}
              />
              <DateSection
                title={t.yesterday}
                items={yesterday}
                startIndex={today.length}
                currentThreadId={currentThreadId}
                onDelete={handleDeleteThread}
                defaultTitle={t.newConversation}
              />
              <DateSection
                title={t.previousDays}
                items={previous}
                startIndex={today.length + yesterday.length}
                currentThreadId={currentThreadId}
                onDelete={handleDeleteThread}
                defaultTitle={t.newConversation}
              />
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300">
                <Settings size={18} className="text-slate-400" />
                <span className="text-sm">{t.settings}</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300">
                <Wrench size={18} className="text-slate-400" />
                <span className="text-sm">{t.tools}</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300">
                <HelpCircle size={18} className="text-slate-400" />
                <span className="text-sm">{t.help}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Message bubble component with improved typography (Gemini-style)
function MessageBubble({
  message,
  onCopy,
  onDelete,
  isStreaming
}: {
  message: Message;
  onCopy: (content: string) => void;
  onDelete: (id: string) => void;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";
  const isEmpty = !message.content;

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className={`relative max-w-[80%] ${
          isUser
            ? "bg-slate-200/80 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-2xl rounded-br-sm px-5 py-4"
            : "bg-transparent"
        }`}
        whileHover={{ scale: isEmpty ? 1 : 1.01 }}
      >
        {isUser ? (
          <p className="text-[16px] sm:text-[17px] text-slate-800 dark:text-slate-100 font-medium leading-[1.7] tracking-normal">
            {message.content}
          </p>
        ) : (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1">
              {/* Show typing indicator when content is empty, otherwise show markdown */}
              {isEmpty || isStreaming ? (
                <div className="glass-message px-4 py-3 min-h-[48px]">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              ) : (
                <div className="text-[16px] sm:text-[17px] text-slate-700 dark:text-slate-200 leading-[1.75] tracking-normal font-normal">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-5 last:mb-0 leading-[1.75]">{children}</p>,
                      h1: ({ children }) => <h1 className="text-2xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-100 leading-[1.3]">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-2 text-slate-800 dark:text-slate-100 leading-[1.3]">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-100 leading-[1.3]">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-1 text-slate-800 dark:text-slate-100 leading-[1.3]">{children}</h4>,
                      ul: ({ children }) => <ul className="list-disc list-outside ml-5 my-4 space-y-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-outside ml-5 my-4 space-y-2">{children}</ol>,
                      li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[15px] font-mono text-pink-600 dark:text-pink-400">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 text-[15px] font-mono leading-relaxed">
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => <pre className="bg-slate-900 dark:bg-slate-950 rounded-xl overflow-hidden my-4">{children}</pre>,
                      a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300">
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>,
                      em: ({ children }) => <em className="italic text-slate-600 dark:text-slate-300">{children}</em>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 my-4 italic text-slate-600 dark:text-slate-400">
                          {children}
                        </blockquote>
                      ),
                      hr: () => <hr className="border-slate-200 dark:border-slate-700 my-6" />,
                      table: ({ children }) => <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 my-4">{children}</table>,
                      thead: ({ children }) => <thead className="bg-slate-50 dark:bg-slate-800">{children}</thead>,
                      tbody: ({ children }) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700">{children}</tbody>,
                      tr: ({ children }) => <tr>{children}</tr>,
                      th: ({ children }) => <th className="px-4 py-2 text-left text-sm font-semibold text-slate-800 dark:text-slate-200">{children}</th>,
                      td: ({ children }) => <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300">{children}</td>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              {/* Action buttons - only show when content exists */}
              {!isEmpty && !isStreaming && (
                <div className="flex items-center gap-2 mt-3">
                  <motion.button
                    onClick={() => onCopy(message.content)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Copy"
                  >
                    <Copy size={14} className="text-slate-400" />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(message.id)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-slate-400" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Input bar component
function InputBar({
  onSend,
  lang,
  disabled
}: {
  onSend: (message: string) => void;
  lang: "en" | "zh";
  disabled: boolean;
}) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const t = translations[lang];
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 pb-6">
      <motion.div
        className={`glass-input-bar ${isFocused ? "focused" : ""}`}
        animate={{ boxShadow: isFocused ? "0 20px 60px -20px rgba(249, 115, 22, 0.3)" : "0 10px 40px -20px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {false && (
            <motion.div
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl mb-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Paperclip size={14} className="text-slate-400" />
              <span className="text-sm text-slate-400">1 file attached</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-row items-center gap-3 pb-2">
          <div className="flex items-center gap-1 pb-2">
            <motion.button
              className="p-2.5 rounded-xl hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={t.upload}
            >
              <Upload size={20} className="text-slate-500" />
            </motion.button>
            <motion.button
              className="p-2.5 rounded-xl hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={t.voice}
            >
              <Mic size={20} className="text-slate-500" />
            </motion.button>
          </div>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t.placeholder}
            rows={1}
            className="flex-1 bg-transparent resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none text-[15px] max-h-40 pb-2"
            style={{ minHeight: "24px" }}
            disabled={disabled}
          />

          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className={`h-8 w-8 flex items-center justify-center rounded-2xl transition-all flex-shrink-0 ${
              input.trim() && !disabled
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-white/20 text-slate-400"
            }`}
            whileHover={input.trim() && !disabled ? { scale: 1.1 } : {}}
            whileTap={input.trim() && !disabled ? { scale: 0.9 } : {}}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Main workspace page component with dynamic routing
export default function WorkspacePage() {
  const params = useParams();
  const threadId = params?.threadId as string | undefined;

  const [lang, setLang] = useState<"en" | "zh">("en");
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadTitle, setThreadTitle] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [displayedText, setDisplayedText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Streaming refs
  const streamingMessageIdRef = useRef<string | null>(null);
  const fullTextRef = useRef<string>("");
  const currentIndexRef = useRef<number>(0);
  const bufferIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSseDoneRef = useRef<boolean>(false);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Fetch threads for sidebar
  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/threads`);
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    }
  }, []);

  // Fetch thread data when threadId changes
  const fetchThreadData = useCallback(async () => {
    if (!threadId || threadId === "new") {
      setMessages([]);
      setThreadTitle(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/threads/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setThreadTitle(data.title);
      }
    } catch (error) {
      console.error("Failed to fetch thread:", error);
    }
  }, [threadId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    fetchThreadData();
  }, [fetchThreadData]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typewriter effect for streaming
  useEffect(() => {
    if (!streamingMessageIdRef.current) return;

    const typewriterTick = () => {
      const fullText = fullTextRef.current;
      const currentIdx = currentIndexRef.current;

      if (isSseDoneRef.current && currentIdx >= fullText.length) {
        bufferIntervalRef.current = null;
        setIsTyping(false);
        setTimeout(() => {
          streamingMessageIdRef.current = null;
        }, 100);
        return;
      }

      if (currentIdx < fullText.length) {
        const diff = fullText.length - currentIdx;
        let charsToAdd = 1;
        let delay = 50;

        if (diff > 100) {
          charsToAdd = 3;
          delay = 15;
        } else if (diff > 50) {
          charsToAdd = 2;
          delay = 20;
        } else if (diff > 20) {
          delay = 15;
        }

        const newChars = fullText.slice(currentIdx, currentIdx + charsToAdd);
        currentIndexRef.current = currentIdx + charsToAdd;
        setDisplayedText(prev => prev + newChars);
        bufferIntervalRef.current = setTimeout(typewriterTick, delay);
      } else {
        bufferIntervalRef.current = setTimeout(typewriterTick, 50);
      }
    };

    bufferIntervalRef.current = setTimeout(typewriterTick, 50);

    return () => {
      if (bufferIntervalRef.current) {
        clearTimeout(bufferIntervalRef.current);
        bufferIntervalRef.current = null;
      }
    };
  }, [streamingMessageIdRef.current]);

  // Sync displayedText to messages
  useEffect(() => {
    if (streamingMessageIdRef.current && displayedText) {
      setMessages(prev =>
        prev.map(m =>
          m.id === streamingMessageIdRef.current
            ? { ...m, content: displayedText }
            : m
        )
      );
    }
  }, [displayedText]);

  const handleSendMessage = async (content: string) => {
    const userMessage = { id: Date.now().toString(), role: "user" as const, content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Determine the endpoint based on whether we have a threadId
      let endpoint = `${API_BASE_URL}/chat/stream`;
      let requestBody: Record<string, string | any[]> = { content };

      if (threadId && threadId !== "new") {
        endpoint = `${API_BASE_URL}/api/threads/${threadId}/stream`;
        requestBody = { message: content };
      } else {
        // For new conversation, use chat history
        const chatHistory = messages.map(m => ({
          role: m.role,
          content: m.content
        }));
        requestBody = {
          content: content,
          chat_history: chatHistory
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create assistant message placeholder
      const assistantMessageId = (Date.now() + 1).toString();
      streamingMessageIdRef.current = assistantMessageId;
      fullTextRef.current = "";
      currentIndexRef.current = 0;
      isSseDoneRef.current = false;
      setDisplayedText("");

      const assistantMessage = {
        id: assistantMessageId,
        role: "assistant" as const,
        content: ""
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Process streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            const chunk = decoder.decode(value, { stream: !doneReading });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.type === "content") {
                    fullTextRef.current += data.content;
                  } else if (data.type === "done") {
                    done = true;
                    isSseDoneRef.current = true;
                  }
                } catch {
                  // Handle [DONE] signal
                  if (line.includes("[DONE]")) {
                    done = true;
                    isSseDoneRef.current = true;
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      isSseDoneRef.current = true;
      streamingMessageIdRef.current = null;
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: t.connectionError
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    } finally {
      isSseDoneRef.current = true;
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100"}`}>
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBlob size={600} position={{ top: "-20%", left: "-10%" }} delay={0} color="rgba(249, 115, 22, 0.15)" />
        <FloatingBlob size={500} position={{ bottom: "-15%", right: "-5%" }} delay={3} color="rgba(57, 255, 20, 0.1)" />
        <FloatingBlob size={400} position={{ top: "40%", right: "20%" }} delay={6} color="rgba(236, 72, 153, 0.1)" />
        <FloatingBlob size={350} position={{ bottom: "20%", left: "30%" }} delay={9} color="rgba(59, 130, 246, 0.08)" />
      </div>

      {/* Flex Layout Container */}
      <div className="flex h-full w-full relative z-10">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          lang={lang}
          threads={threads}
          currentThreadId={threadId || null}
          onThreadDeleted={fetchThreads}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header */}
          <header className="flex-shrink-0 glass-header">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Left: Hamburger Menu & Title */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={sidebarOpen ? t.closeSidebar : t.openSidebar}
                >
                  <Menu size={24} className="text-slate-600 dark:text-slate-300" />
                </motion.button>
                <h2 className="text-lg font-medium text-slate-800 dark:text-white">
                  {threadTitle || t.chatTitle}
                </h2>
              </div>

              {/* Right: Toggle & Profile */}
              <div className="flex items-center gap-3">
                {/* Language Toggle */}
                <div className="toggle-group">
                  <button
                    onClick={() => setLang("en")}
                    className={`${lang === "en" ? "active" : ""}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang("zh")}
                    className={`${lang === "zh" ? "active" : ""}`}
                  >
                    中
                  </button>
                </div>

                {/* Dark Mode */}
                <motion.button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  whileHover={{ rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
                </motion.button>

                {/* User Profile */}
                <motion.button
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="hidden sm:block text-sm text-slate-700 dark:text-slate-300">
                    {t.login}
                  </span>
                </motion.button>
              </div>
            </div>
          </header>

          {/* Messages Area */}
          <main className="flex-1 overflow-y-auto px-4">
            <div className="max-w-4xl mx-auto py-4">
              {messages.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/30"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={36} className="text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-serif font-bold text-slate-800 dark:text-white mb-3">
                    {t.welcome}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    {t.defaultMessage}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-2 pt-4">
                  {messages.map((message, index) => {
                    const isLastMessage = index === messages.length - 1;
                    const effectiveContent = isLastMessage && streamingMessageIdRef.current === message.id
                      ? displayedText || message.content
                      : message.content;
                    const showTyping = isLastMessage && isTyping && !effectiveContent;
                    return (
                      <MessageBubble
                        key={message.id}
                        message={{ ...message, content: effectiveContent }}
                        onCopy={handleCopyMessage}
                        onDelete={handleDeleteMessage}
                        isStreaming={showTyping}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </main>

          {/* Input Bar */}
          <InputBar onSend={handleSendMessage} lang={lang} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}