"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";
import { useAuth } from "@/components/auth/useAuth";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const lostFoundKeywords = [
  "lost", "found", "item", "missing", "report", "search", "location",
  "wallet", "keys", "phone", "bag", "document", "jewelry", "electronics",
  "pet", "animal", "claim", "return", "matching", "help", "how",
];

function isLostFoundRelated(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return lostFoundKeywords.some(keyword => lowerQuery.includes(keyword));
}

function generateResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (!isLostFoundRelated(query)) {
    return "I'm here to help with lost and found related queries only. Please ask me about reporting lost items, searching for found items, or any other lost and found topics.";
  }

  // Lost item related responses
  if (lowerQuery.includes("report") && (lowerQuery.includes("lost") || lowerQuery.includes("missing"))) {
    return "To report a lost item, go to your Dashboard and click on 'Report Lost Item'. Fill in the details including the item name, description, category, location lost, date, and your contact information. You can also upload an image of the item if available.";
  }

  // Found item related responses
  if (lowerQuery.includes("found") && lowerQuery.includes("report")) {
    return "To report a found item, navigate to your Dashboard and select 'Report Found Item'. Provide as much detail as possible about the item you found, where you found it, and when. This will help us match it with the original owner.";
  }

  // Search/browse related
  if (lowerQuery.includes("search") || lowerQuery.includes("browse") || lowerQuery.includes("find")) {
    return "You can browse found items by clicking on 'Browse Found Items' from the dashboard or the main navigation. You can filter by category, date, and location to help find what you're looking for.";
  }

  // Matching/notification related
  if (lowerQuery.includes("match") || lowerQuery.includes("notification") || lowerQuery.includes("alert")) {
    return "When a lost item report matches a found item in our system, you'll receive a notification. You can view all your notifications in the 'Notifications' section of your dashboard.";
  }

  // Claim related
  if (lowerQuery.includes("claim") || lowerQuery.includes("return") || lowerQuery.includes("own")) {
    return "If you believe a found item belongs to you, click on the item and select 'Claim Item'. You'll need to provide proof of ownership and your contact information. The finder will be notified and can verify your claim.";
  }

  // How to use/help
  if (lowerQuery.includes("how") || lowerQuery.includes("help") || lowerQuery.includes("use")) {
    return "FindIt helps you report lost items and search for found ones. Here's how it works:\n\n1. Report a lost item with details\n2. Browse found items in your area\n3. Get notified of potential matches\n4. Connect with finders/owners\n\nWhat would you like to know more about?";
  }

  // General lost/found response
  return "I'm here to help with your lost and found needs. You can:\n\n• Report a lost item from your dashboard\n• Report items you've found\n• Browse and search found items\n• Get notifications about matches\n• Update your profile settings\n\nHow can I assist you today?";
}

export default function AssistantPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your FindIt AI Assistant. I can help you with reporting lost or found items, searching for items, understanding how our platform works, and answering any lost and found related questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSendMessage() {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = generateResponse(input.trim());

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="md:ml-64 pb-20 md:pb-0 flex-screen">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-gray-200 flex-col h px-4 py-4 flex-shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
        </header>

        {/* Desktop header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-200" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about lost and found..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            AI Assistant only responds to lost and found related queries
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
