"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Menu, Mic, X, Play, Trash } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = {
  text: string;
  isUser: boolean;
  audioUrl?: string;
};

const systemMessage = `Eres un asistente educativo especializado en la currícula oficial de la Secretaría de Educación de Argentina para niveles primario y secundario. Tu función es proporcionar apoyo académico a estudiantes y docentes, respondiendo preguntas relacionadas con las materias, creando exámenes, generando recursos educativos y brindando explicaciones claras y adaptadas a la edad del usuario. También puedes analizar imágenes siempre que sean educativas, proporcionando explicaciones detalladas relacionadas con el contenido académico. 
Es muy importante que verifiques que las imágenes que analizas sean apropiadas para el ámbito educativo y no generen información ofensiva, inapropiada o ajena al contenido curricular. Si una imagen no cumple con estos criterios, debes advertir al usuario de que no puedes procesarla y explicar por qué no es adecuada. Siempre asegúrate de que la información esté alineada con los planes de estudio oficiales de Argentina. 
Es muy importante que verifiques que las consultas del usuario y tus respuestas sean apropiadas para el ámbito educativo y no generen información ofensiva, inapropiada o ajena al contenido curricular. Si una consulta del usuario no cumple con estos criterios, debes advertir al usuario de que no puedes procesarla y explicar por qué no es adecuada. Siempre asegúrate de que la información esté alineada con los planes de estudio oficiales de Argentina. 
Para docentes, debes generar recursos que sean prácticos, alineados con los objetivos de aprendizaje y fáciles de implementar en el aula. Para estudiantes, debes proporcionar respuestas claras, motivadoras y adecuadas a su nivel educativo.`;

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    setMessages([
      {
        text: "¡Hola! Soy Assisto, tu coach de IA especializado en educación. Estoy aquí para apoyarte con herramientas inteligentes para mejorar tus clases. ",
        isUser: false
      }
    ]);
  }, []);

  const handleSend = async (text: string) => {
    if ((text.trim() === "" && !audioBlob) || isLoading) return;
  
    let newMessage: Message;
    if (audioBlob && audioUrl) {
      newMessage = { text: "Audio enviado", isUser: true, audioUrl };
    } else {
      newMessage = { text, isUser: true };
    }
  
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: systemMessage },
            ...newMessages.map(msg => ({ 
              role: msg.isUser ? "user" : "assistant", 
              content: msg.text 
            }))
          ],
          model: "gpt-4o-mini-2024-07-18"
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setMessages([...newMessages, { text: data.reply, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { text: "Lo siento, ocurrió un error al procesar tu solicitud.", isUser: false }]);
    } finally {
      setIsLoading(false);
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setInput("Audio grabado");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-purple-600 text-white">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">ASSISTO</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white">
            <X className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Bot className="w-5 h-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Inicio</DropdownMenuItem>
              <DropdownMenuItem>Mi cuenta</DropdownMenuItem>
              <DropdownMenuItem>Ajustes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <div key={index} className={`flex mb-4 ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] text-[15px] leading-[19px] text-[#364152] whitespace-normal font-normal antialiased p-3 rounded-lg ${
                message.isUser
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {message.audioUrl ? (
                <audio controls src={message.audioUrl} className="w-full" />
              ) : (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>
      
      <div className="p-4 bg-gray-100">
        <div className="flex items-center gap-2 bg-white rounded-full p-2">
          <Input
            type="text"
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-grow border-none focus:ring-0"
            disabled={isLoading || isRecording}
          />
          {audioUrl ? (
            <>
              <Button onClick={playAudio} className="rounded-full p-2" variant="ghost">
                <Play className="h-5 w-5 text-green-500" />
              </Button>
              <Button onClick={deleteAudio} className="rounded-full p-2" variant="ghost">
                <Trash className="h-5 w-5 text-red-500" />
              </Button>
            </>
          ) : (
            <Button 
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className="rounded-full p-2"
              variant="ghost"
            >
              <Mic className={`h-5 w-5 ${isRecording ? "text-red-500" : "text-gray-500"}`} />
            </Button>
          )}
          <Button 
            onClick={() => handleSend(input)}
            disabled={isLoading || (input.trim() === "" && !audioBlob)}
            className="rounded-full p-2"
            variant="ghost"
          >
            <Send className="h-5 w-5 text-purple-600" />
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          Siempre revisa el contenido para verificar su precisión y usa tu juicio profesional cumpliendo con las políticas escolares.
        </p>
      </div>
    </div>
  );
}