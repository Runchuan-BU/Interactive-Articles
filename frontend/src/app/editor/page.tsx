// editor page

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/button';
import TiptapEditor from '@/components/TiptapEditor';

export default function EditorPage() {
  const router = useRouter();
  const [content, setContent] = useState('');


  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tiptap Editor</h1>
        <TiptapEditor content={content} setContent={setContent} />
        <div className="mt-4 flex gap-2">
          <Button onClick={() => router.push('/')} variant="outline">Back</Button>
          {/* <Button onClick={handleSave}>Submit</Button> */}
        </div>
      </div>
    </div>
  );
}
