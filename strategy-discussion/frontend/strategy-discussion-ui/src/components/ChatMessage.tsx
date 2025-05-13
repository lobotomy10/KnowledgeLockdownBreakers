import { Message } from '../types';
import { Card } from './ui/card';

interface ChatMessageProps {
  message: Message;
  icon: string;
}

export function ChatMessage({ message, icon }: ChatMessageProps) {
  return (
    <div className="flex items-start space-x-4 mb-4">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full overflow-hidden">
        <div className="text-2xl bg-gray-100 w-full h-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <Card className="flex-1 p-4 max-w-[80%]">
        <div className="font-semibold mb-1">{message.persona_name}</div>
        <p className="text-gray-700">{message.content}</p>
      </Card>
    </div>
  );
}
