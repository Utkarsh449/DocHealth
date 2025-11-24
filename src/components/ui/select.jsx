import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext({})

export function Select({ children, onValueChange, defaultValue }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, value, handleValueChange }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      {children}
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => {
  const { value } = React.useContext(SelectContext);
  return (
    <span ref={ref} className={cn("block truncate", className)} {...props}>
      {value || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

export const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div ref={ref} className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1 w-full bg-white", className)} {...props}>
      <div className="p-1">{children}</div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

export const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { handleValueChange } = React.useContext(SelectContext);
  return (
    <div 
      ref={ref} 
      onClick={() => handleValueChange(value)}
      className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-gray-100 cursor-pointer", className)} 
      {...props}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"
