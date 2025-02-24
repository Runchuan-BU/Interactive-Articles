// mutiple choice question node

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState, useMemo } from 'react';

const MCQComponent = (props: any) => {
  const { node, updateAttributes, deleteNode } = props;
  const { question, options, correctAnswer } = node.attrs;

  
  const uniqueId = useMemo(() => `mcq-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <NodeViewWrapper className="p-4 border rounded-lg bg-gray-50 w-full relative flex flex-col">
      {/* MCQ input */}
      <input
        type="text"
        value={question}
        onChange={(e) => updateAttributes({ question: e.target.value })}
        className="w-full border rounded p-2 mb-2 text-black placeholder:text-gray-400"
        placeholder="Enter your question"
      />

      {/* Choices list */}
      <ul className="mt-2">
        {options.map((option: string, index: number) => (
          <li key={index} className="flex items-center space-x-2 mb-2">
            
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                updateAttributes({ options: newOptions });
              }}
              className="w-full border rounded p-2 text-black placeholder:text-gray-400"
              placeholder={`Option ${index + 1}`}
            />

            
            <input
              type="radio"
              name={uniqueId} 
              checked={index === correctAnswer}
              onChange={() => updateAttributes({ correctAnswer: index })} 
            />
          </li>
        ))}
      </ul>

      {/* Delete */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 text-white text-sm px-4 py-2 rounded inline-flex items-center justify-center"
          onClick={deleteNode}
        >
          Delete
        </button>
      </div>
    </NodeViewWrapper>
  );
};

const MCQNode = Node.create({
  name: 'mcq',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      question: { default: '' },
      options: { default: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] },
      correctAnswer: { default: -1 },
    };
  },

  parseHTML() {
    return [{ tag: 'mcq-block' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['mcq-block', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MCQComponent);
  },
});

export default MCQNode;

