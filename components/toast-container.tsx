"use client"

import { useEffect, useState } from "react"
import { Toast, ToastDescription, ToastProvider, ToastTitle } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant} onClose={() => dismissToast(toast.id)}>
          <div>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
        </Toast>
      ))}
    </ToastProvider>
  )
}
