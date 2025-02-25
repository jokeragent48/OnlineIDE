'use client'
import { useEffect, useState, useRef } from 'react';

interface TerminalProps {
  executionId: string | null;
}

interface WebSocketMessage {
  type: 'output' | 'logs' | 'status' | 'completion' | 'error';
  data?: string;
  exitCode?: number;
  timestamp: number;
}

export default function Terminal({ executionId }: TerminalProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (executionId) {
      console.log('Attempting to connect to WebSocket with executionId:', executionId);
      wsRef.current = new WebSocket(`ws://localhost:8080/${executionId}`);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setConnected(true);
        setOutput(prev => [...prev, '> Connected to execution environment']);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('Received message:', message);
          
          const timestamp = new Date(message.timestamp).toLocaleTimeString();

          switch(message.type) {
            case 'output':
              setOutput(prev => [...prev, `[${timestamp}] ${message.data}`]);
              break;
            case 'logs':
              console.log('FULL LOGS:', message.data);
              break;
            case 'status':
              setOutput(prev => [...prev, `[${timestamp}] Status: ${message.data}`]);
              break;
            case 'completion':
              setOutput(prev => [
                ...prev,
                `[${timestamp}] Program completed with exit code ${message.exitCode}`,
                `Output: ${message.data}`,
                '-------------------'
              ]);
              break;
            case 'error':
              setOutput(prev => [...prev, `[${timestamp}] Error: ${message.data}`]);
              break;
          }

          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
          }
        } catch (error) {
          console.error('Raw message:', event.data);
          setOutput(prev => [...prev, `[Raw] ${event.data}`]);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setConnected(false);
        setOutput(prev => [...prev, '> Connection closed']);
      };

      wsRef.current.onerror = (event: Event) => {
        const error = event as ErrorEvent;
        setConnected(false);
        console.error('WebSocket error:', error.message || 'Unknown error occurred');
        setOutput(prev => [...prev, `[Error] Connection failed: ${error.message || 'Unknown error'}`]);
      };

      return () => {
        console.log('Cleaning up WebSocket connection');
        wsRef.current?.close();
        setConnected(false);
      };
    }
  }, [executionId]);

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && wsRef.current?.readyState === WebSocket.OPEN) {
      const inputMessage = JSON.stringify({
        type: 'input',
        data: input,
        timestamp: Date.now()
      });
      wsRef.current.send(inputMessage);
      setOutput(prev => [...prev, `[Input] ${input}`]);
      setInput('');
    }
  };

  return (
    <div className="bg-black text-white font-mono p-4 rounded-b h-[200px] flex flex-col">
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap" ref={outputRef}>
        {output.map((line, i) => (
          <div 
            key={i} 
            className={`${
              line.startsWith('[Error]') ? 'text-red-500' : 
              line.startsWith('[System]') ? 'text-yellow-500' :
              line.startsWith('[Input]') ? 'text-blue-500' :
              line.startsWith('[Output]') ? 'text-green-500' : 
              'text-gray-400'
            }`}
          >
            {line}
          </div>
        ))}
      </div>
      {executionId && (
        <div className="flex items-center mt-2 border-t border-gray-700 pt-2">
          <span className={`mr-2 ${connected ? 'text-green-500' : 'text-red-500'}`}>
            {connected ? '●' : '○'}
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputSubmit}
            className="flex-1 bg-transparent outline-none"
            placeholder={connected ? "Type your input here..." : "Disconnected..."}
            disabled={!connected}
          />
        </div>
      )}
    </div>
  );
} 