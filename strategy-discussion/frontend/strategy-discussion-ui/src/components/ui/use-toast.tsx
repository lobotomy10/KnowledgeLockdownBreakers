import * as React from "react"
import { useToast as useHookToast } from "@radix-ui/react-toast"

interface ToastProps {
  variant?: "default" | "destructive"
  title?: string
  description?: string
}

export function toast(props: ToastProps) {
  const { toast } = useHookToast()
  toast(props)
}

export function useToast() {
  return {
    toast,
  }
}
