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
  
  export const ReactFlow: React.FC<ReactFlowProps>;
}

// Add SpeechRecognition types
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}
