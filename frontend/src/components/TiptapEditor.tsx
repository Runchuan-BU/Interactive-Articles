// Tiptap Editor component

'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Node } from '@tiptap/core';
import MCQNode from './extensions/MCQNode';
import FRQNode from './extensions/FRQNode';
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
  content: '(mcq | frq)*', // Allow both MCQ and FRQ
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

  // Initialize the editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [DocumentNode, TextNode, MCQNode, FRQNode], 
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); // Update content state
    },
    editorProps: {
      handleKeyDown: () => true, 
    },
  });

  if (!isClient) {
    return <p>Loading editor...</p>;
  }

  // Add an MCQ block
  const addMCQBlock = () => {
    if (!editor) return;
  
    editor
      .chain()
      .focus()
      .insertContentAt(editor.state.doc.content.size, { 
        type: 'mcq',
        attrs: {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
        },
      })
      .run();
  };

  // Add an FRQ block
  const addFRQBlock = () => {
    if (!editor) return;
  
    editor
      .chain()
      .focus()
      .insertContentAt(editor.state.doc.content.size, {
        type: 'frq',
        attrs: {
          question: '',
          example_answer: '',
        },
      })
      .run();
  };

  // Extract all questions (MCQs and FRQs) while maintaining order
  const extractQuestions = () => {
    if (!editor) return [];

    const questions: any[] = [];
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'mcq' || node.type.name === 'frq') {
        questions.push({ type: node.type.name, ...node.attrs }); // Store type to maintain order
      }
    });

    console.log("Extracted Questions (Ordered):", questions); // Debugging
    return questions;
  };

  // Save questions
  const saveContent = () => {
    const questionData = extractQuestions();

    // Prevent saving if there are no questions
    if (questionData.length === 0) {
      alert("Please add at least one question before saving.");
      return;
    }

    const data = {
      title: title.trim(),
      questions: questionData, // Preserve order
    };

    console.log('Saving:', JSON.stringify(data, null, 2));
    alert(`Saved Data:\n${JSON.stringify(data, null, 2)}`);

    fetch('http://localhost:5000/questions/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => {
      alert('Title & Questions saved successfully!');
    }).catch((error) => {
      console.error("Error saving data:", error);
      alert("Failed to save questions.");
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

      {/* Editor Content */}
      <EditorContent editor={editor} className="w-full min-h-[10px]" />

      {/* Buttons */}
      <div className="flex gap-2 mb-2">
        <Button onClick={addMCQBlock}>Add MCQ</Button>
        <Button onClick={addFRQBlock} className="bg-blue-500">Add FRQ</Button>
        <Button onClick={saveContent} className="bg-green-500">Submit</Button>
      </div>
    </div>
  );
};

export default TiptapEditor;


