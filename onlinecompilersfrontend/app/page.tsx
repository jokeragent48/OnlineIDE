'use client'
import CodeEditor from './components/Editor';
import Terminal from './components/Terminal';
import { useState } from 'react';

export default function Home() {
  const [executionId, setExecutionId] = useState<string | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    // Optional: Handle code changes
  };

  return (
    <div className="w-full h-screen p-4">
      <div className="h-[70vh]">
        <CodeEditor
          onChange={handleEditorChange}
          onExecutionStart={setExecutionId}
        />
      </div>
      <div className="h-[30vh] mt-4">
        <Terminal executionId={"1"} />
      </div>
    </div>
  );
}
