"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, User, Send, ShoppingBag, Clock, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const productResponses = {
  "¿Cómo comprar este producto?": "Para comprar este producto, sigue estos pasos:\n1. Selecciona tu talla en la página del producto.\n2. Haz clic en 'Añadir al carrito'.\n3. Ve al carrito y haz clic en 'Proceder al pago'.\n4. Completa tus datos de envío y pago.\n5. Confirma tu pedido.\nRecuerda que debes estar registrado para completar la compra.",
  "¿Cuánto tardar en llegar este producto?": "El tiempo de entrega para las Air Jordan 1 Elevate High depende de tu ubicación:\n- Áreas urbanas: 3-5 días hábiles.\n- Zonas rurales: 5-7 días hábiles.\n- Envío express: 1-2 días hábiles (costo adicional).\nPuedes seguir el estado de tu pedido en tu cuenta una vez realizada la compra.",
  "default": "Gracias por tu pregunta sobre las Air Jordan 1 Elevate High. Aunque no tengo información específica sobre eso, puedo ayudarte con detalles sobre tallas, colores disponibles, materiales de construcción o políticas de devolución. ¿Hay algo en particular que te gustaría saber sobre estos aspectos del producto?"
}

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
      const response = productResponses[text] || productResponses["default"]
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
          <ShoppingBag className="w-6 h-6" />
          <h1 className="text-xl font-bold">TiendaGPT</h1>
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
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Air Jordan 1 Elevate High</h2>
                <p className="text-sm text-muted-foreground">Women shoes</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">Rs. 12,067</p>
                <p className="text-sm text-green-500">14% OFF</p>
              </div>
            </div>
            <img
              src="/placeholder.svg?height=100&width=200"
              alt="Air Jordan 1 Elevate High"
              className="w-full h-40 object-cover rounded-md mt-4"
            />
          </CardContent>
        </Card>

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
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleSend("¿Cómo comprar este producto?")}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            ¿Cómo comprar?
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleSend("¿Cuánto tardar en llegar este producto?")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Tiempo de entrega
          </Button>
        </div>

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
          ChatGPT puede cometer errores. Considera verificar la información importante.
        </p>
      </div>
    </div>
  )
}