import { toast as internalToast } from '../components/ui/use-toast';

export const toast = (props: {
  variant?: "default" | "destructive";
  title: string;
  description: string;
}) => {
  internalToast(props);
};
