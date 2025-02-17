import * as React from "react"

interface ToastProps {
  variant?: "default" | "destructive"
  title?: string
  description?: string
}

let toastFn: (props: ToastProps) => void;

export function toast(props: ToastProps) {
  if (toastFn) {
    toastFn(props);
  }
}

export function useToast() {
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    toastFn = (props: ToastProps) => {
      forceUpdate({});
      // Here we would actually show the toast UI
      console.log('Toast:', props);
    };
  }, []);

  return {
    toast,
  };
}
