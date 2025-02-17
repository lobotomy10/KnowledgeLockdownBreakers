import { toast as internalToast } from '../components/ui/use-toast';

export const toast = {
  error: (message: string) => {
    internalToast({
      variant: "destructive",
      title: "エラー",
      description: message,
    });
  },
  success: (message: string) => {
    internalToast({
      title: "成功",
      description: message,
    });
  }
};
