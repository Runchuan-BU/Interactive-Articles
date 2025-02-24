// free response question node

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

const FRQComponent = (props: any) => {
  const { node, updateAttributes, deleteNode } = props;
  const { question, example_answer } = node.attrs;

  return (
    <NodeViewWrapper className="p-4 border rounded-lg bg-gray-50 w-full relative flex flex-col">
      {/* question input */}
      <input
        type="text"
        value={question}
        onChange={(e) => updateAttributes({ question: e.target.value })}
        className="w-full border rounded p-2 mb-2 text-black placeholder:text-gray-400"
        placeholder="Enter your question"
      />

      {/* free response input */}
      <textarea
        value={example_answer}
        onChange={(e) => updateAttributes({ example_answer: e.target.value })}
        className="w-full border rounded p-2 text-black placeholder:text-gray-400"
        placeholder="Type your answer here..."
      />

      {/* delete button */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-red-500 text-white text-sm px-4 py-2 rounded"
          onClick={deleteNode}
        >
          Delete
        </button>
      </div>
    </NodeViewWrapper>
  );
};

const FRQNode = Node.create({
  name: 'frq',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      question: { default: '' },
      example_answer: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'frq-block' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['frq-block', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FRQComponent);
  },
});

export default FRQNode;
