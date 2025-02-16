'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Node } from '@tiptap/core';
import MCQNode from './extensions/MCQNode';
import Button from '@/components/ui/button';

// TextNode
const TextNode = Node.create({
  name: 'text',
  group: 'inline',
});

// DocumentNode
const DocumentNode = Node.create({
  name: 'doc',
  topNode: true, 
  content: 'mcq*', // only allow MCQ nodes
});

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, setContent }) => {
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState(''); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [DocumentNode, TextNode, MCQNode], 
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); // update content
    },
    editorProps: {
      handleKeyDown: () => true, 
    },
  });

  if (!isClient) {
    return <p>Loading editor...</p>;
  }

  const addMCQBlock = () => {
    if (!editor) return;
  
    editor
      .chain()
      .focus()
      .insertContentAt(editor.state.doc.content.size, { // from end of doc
        type: 'mcq',
        attrs: {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
        },
      })
      .run();
  };
  

  // get all MCQs
  const extractMCQs = () => {
    if (!editor) return [];

    const mcqNodes: any[] = [];
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'mcq') {
        mcqNodes.push(node.attrs);
      }
    });

    return mcqNodes;
  };
  // save MCQs
  const saveContent = () => {
    const mcqData = extractMCQs(); 
    const data = {
      title: title.trim(), 
      mcqs: mcqData, 
    };
  
    console.log('Saving:', JSON.stringify(data, null, 2)); 
    alert(`Saved Data:\n${JSON.stringify(data, null, 2)}`); 
  
    fetch('http://localhost:5000/mcq/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => {
      alert('Title & MCQs saved successfully!');
    });
  };
  

  return (
    <div className="border rounded-lg p-4 bg-white">
      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border-b text-xl font-bold p-2 mb-4 outline-none placeholder:text-gray-400 text-black bg-transparent"
        placeholder="Enter title..."
      />

      <EditorContent editor={editor} className="w-full min-h-[10px]" />


      <div className="flex gap-2 mb-2">
        <Button onClick={addMCQBlock}>Add MCQ</Button>
        <Button onClick={saveContent} className="bg-green-500">
          Submit
        </Button>
      </div>
      
      
    </div>
  );
};

export default TiptapEditor;

