import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export default function HealthBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your health assistant 😊 Ask me anything about health, first aid, or science!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages([...newMessages, { sender: "bot", text: "Oops! Something went wrong. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.h1 className="text-3xl font-bold mb-4 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        HealthBot 🤖❤️
      </motion.h1>
      <Card className="h-[500px] flex flex-col">
        <ScrollArea className="flex-1 p-4 space-y-2">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`p-2 rounded-xl max-w-[75%] ${msg.sender === 'bot' ? 'bg-blue-100 text-left' : 'bg-green-100 self-end text-right'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.text}
            </motion.div>
          ))}
          {loading && <div className="text-sm text-gray-500">HealthBot is typing...</div>}
        </ScrollArea>
        <CardContent className="flex items-center gap-2 border-t p-2">
          <Input
            placeholder="Ask me anything health-related..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </CardContent>
      </Card>
    </div>
  );
}
