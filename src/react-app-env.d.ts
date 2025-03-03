declare namespace React {
  type Key = string | number;
  
  interface JSXElementConstructor<P> {
    (props: P): ReactElement<P> | null;
  }
  
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  type FC<P = {}> = FunctionComponent<P>;
  interface FunctionComponent<P = {}> {
    (props: P): ReactElement | null;
    displayName?: string;
  }
  
  // Add useState and useEffect
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
}

declare module 'react' {
  export = React;
}

declare module '@xyflow/react' {
  export interface ReactFlowProps {
    nodes: any[];
    edges: any[];
    [key: string]: any;
  }
  
  export const ReactFlow: any;
}

// Add SpeechRecognition types
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface Window {
  SpeechRecognition: {
    new(): SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new(): SpeechRecognition;
  };
}
