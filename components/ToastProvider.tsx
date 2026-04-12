'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Toast Store / Hook
 * -----------------------------------------------------------------------------------------------*/

type ToastType = 'success' | 'error' | 'loading' | 'default'

interface ToastData {
  id: string
  title?: string
  description?: string
  type?: ToastType
  duration?: number
}

let count = 0
const genId = () => {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action = 
  | { type: 'ADD_TOAST'; toast: ToastData }
  | { type: 'REMOVE_TOAST'; id: string }

interface State {
  toasts: ToastData[]
}

const toastReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, 5) }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }
    default:
      return state
  }
}

const ToastContext = React.createContext<{
  toasts: ToastData[]
  toast: (data: Omit<ToastData, 'id'>) => void
  removeToast: (id: string) => void
} | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/* -------------------------------------------------------------------------------------------------
 * Toast Provider Component
 * -----------------------------------------------------------------------------------------------*/

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] })

  const toast = React.useCallback((data: Omit<ToastData, 'id'>) => {
    const id = genId()
    dispatch({ type: 'ADD_TOAST', toast: { ...data, id } })
  }, [])

  const removeToast = React.useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }, [])

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, removeToast }}>
      <ToastPrimitives.Provider duration={5000}>
        {children}
        
        {state.toasts.map((t) => (
          <Toast key={t.id} {...t} onOpenChange={(open) => !open && removeToast(t.id)} />
        ))}
        
        <ToastPrimitives.Viewport className="fixed bottom-0 right-0 z-[100] flex flex-col p-6 gap-2 w-full max-w-[420px] outline-none" />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Toast Component
 * -----------------------------------------------------------------------------------------------*/

function Toast({ id, title, description, type = 'default', onOpenChange }: ToastData & { onOpenChange: (open: boolean) => void }) {
  return (
    <ToastPrimitives.Root
      onOpenChange={onOpenChange}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all",
        "bg-zinc-900/90 backdrop-blur-md border-zinc-800",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        type === 'success' && "border-green-500/20 bg-green-500/5",
        type === 'error' && "border-red-500/20 bg-red-500/5"
      )}
    >
      <div className="flex gap-3">
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
        {type === 'loading' && <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />}
        
        <div className="grid gap-1">
          {title && <ToastPrimitives.Title className="text-sm font-semibold text-white">{title}</ToastPrimitives.Title>}
          {description && (
            <ToastPrimitives.Description className="text-sm text-zinc-400 opacity-90">
              {description}
            </ToastPrimitives.Description>
          )}
        </div>
      </div>
      
      <ToastPrimitives.Close className="absolute right-2 top-2 rounded-md p-1 text-zinc-500 opacity-0 transition-opacity hover:text-zinc-100 focus:opacity-100 focus:outline-none group-hover:opacity-100">
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  )
}
