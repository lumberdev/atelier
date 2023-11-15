import { useState } from "react";

export const useToast = () => {
  const [messages, setMessages] = useState<string[]>([]);

  return {
    toasts: messages,
    triggerToast: (toast: string) => setMessages([...messages, toast]),
    dismissToast: (index: number) =>
      setMessages(messages.filter((_, idx) => idx !== index)),
    clearToasts: () => setMessages([]),
  };
};
