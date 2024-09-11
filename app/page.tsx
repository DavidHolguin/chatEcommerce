"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, BrainCircuit, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const productResponses: { [key: string]: string } = {
  "default": "Gracias por tu pregunta. ¿En qué más puedo ayudarte?"
};

type Message = {
  text: string
  isUser: boolean
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSend = (text: string) => {
    if (text.trim() === "") return
  
    const newMessages = [...messages, { text, isUser: true }]
    setMessages(newMessages)
    setInput("")
  
    setTimeout(() => {
      const response = productResponses["default"]
      setMessages([...newMessages, { text: response, isUser: false }])
    }, 1000)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
        <BrainCircuit className="w-6 h-6" />
          
          <h1 className="text-xl font-bold">ASSISTO.EDU</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Inicio</DropdownMenuItem>
            <DropdownMenuItem>Productos</DropdownMenuItem>
            <DropdownMenuItem>Carrito</DropdownMenuItem>
            <DropdownMenuItem>Mi cuenta</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <div key={index} className={`flex mb-4 ${message.isUser ? "justify-end" : "justify-start"}`}>
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center ml-2 flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 space-y-4 border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Escribe tu pregunta aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-grow"
          />
          <Button onClick={() => handleSend(input)}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          ASSISTO.EDU puede cometer errores. Considera verificar la información importante.
        </p>
      </div>
    </div>
  )
}