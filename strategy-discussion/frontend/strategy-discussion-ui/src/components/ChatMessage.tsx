import React from 'react';
import { Message } from '../types';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: Message;
  icon: string;
}

export function ChatMessage({ message, icon }: ChatMessageProps) {
  return (
    <div className="flex items-start space-x-4 mb-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-2xl">
        {icon}
      </div>
      <Card className="flex-1 p-4 max-w-[80%]">
        <div className="font-semibold mb-1">{message.persona_name}</div>
        <p className="text-gray-700">{message.content}</p>
      </Card>
    </div>
  );
}
