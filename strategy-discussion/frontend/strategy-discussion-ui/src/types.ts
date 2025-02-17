export interface Persona {
  name: string;
  role: string;
  position: string;
  speaking_style: string;
  icon: string;
  image?: string;
  imageFile?: File;
}

export interface Message {
  persona_name: string;
  content: string;
  timestamp: string;
}

export interface Discussion {
  strategy_document: {
    content: string;
  };
  messages: Message[];
  is_active: boolean;
}
