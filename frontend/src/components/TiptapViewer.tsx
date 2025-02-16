// 'use client';

// import { useState } from 'react';
// import Button from '@/components/ui/button';

// interface MCQ {
//   question: string;
//   options: string[];
//   correctAnswer: number;
// }

// interface TiptapViewerProps {
//   content: {
//     title: string;
//     mcqs: MCQ[];
//   };
// }

// const TiptapViewer: React.FC<TiptapViewerProps> = ({ content }) => {
//   const { title, mcqs } = content;
//   const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(mcqs.length).fill(-1));
//   const [feedback, setFeedback] = useState<(string | null)[]>(new Array(mcqs.length).fill(null));
//   const [showAIAnalysis, setShowAIAnalysis] = useState(false);
//   const [aiAnalysis, setAIAnalysis] = useState<{ question: string; analysis: string }[]>([]);
//   const [loading, setLoading] = useState(false); // Loading state for AI analysis

//   const handleSelect = (mcqIndex: number, optionIndex: number) => {
//     const newAnswers = [...selectedAnswers];
//     newAnswers[mcqIndex] = optionIndex;
//     setSelectedAnswers(newAnswers);
//   };

//   const handleSubmit = () => {
//     // Evaluate each answer and update feedback
//     const newFeedback = mcqs.map((mcq, index) =>
//       selectedAnswers[index] === -1
//         ? "No answer selected"
//         : selectedAnswers[index] === mcq.correctAnswer
//         ? "Correct"
//         : "Incorrect"
//     );
//     setFeedback(newFeedback);
//   };

//   const handleAIAnalysis = async () => {
//     setLoading(true); // Show loading state

//     try {
//       const response = await fetch('http://localhost:5000/mcq/analysis', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ title, mcqs }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch AI analysis');
//       }

//       const data = await response.json(); // Expecting an array of analysis strings
//       const analysisData = mcqs.map((mcq, index) => ({
//         question: mcq.question,
//         analysis: data[index] || 'No analysis available.',
//       }));

//       setAIAnalysis(analysisData);
//       setShowAIAnalysis(true);
//     } catch (error) {
//       console.error('Error fetching AI analysis:', error);
//       setAIAnalysis(mcqs.map(mcq => ({ question: mcq.question, analysis: 'Failed to get AI analysis.' })));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToQuiz = () => {
//     setShowAIAnalysis(false);
//   };

//   return (
//     <div className="p-4 border rounded-lg bg-white">
//       <h1 className="text-2xl font-bold mb-4 text-gray-900">{title}</h1>

//       {/* AI Analysis View */}
//       {showAIAnalysis ? (
//         <div>
//           {loading ? (
//             <p className="text-gray-700">Loading AI analysis...</p>
//           ) : (
//             aiAnalysis.map((item, index) => (
//               <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
//                 <p className="font-semibold text-gray-900">{item.question}</p>
//                 <p className="text-gray-800 mt-2">{item.analysis}</p>
//               </div>
//             ))
//           )}
//           <Button
//             onClick={handleBackToQuiz}
//             className="bg-gray-700 text-white text-sm px-4 py-2 rounded mt-4"
//           >
//             Back to Quiz
//           </Button>
//         </div>
//       ) : (
//         // MCQ Quiz View
//         <div>
//           {mcqs.map((mcq, index) => (
//             <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
//               <p className="font-semibold text-gray-900">{mcq.question}</p>
//               <ul className="mt-2">
//                 {mcq.options.map((option, optionIndex) => (
//                   option && (
//                     <li key={optionIndex} className="flex items-center space-x-2 mb-2">
//                       <input
//                         type="radio"
//                         name={`mcq-${index}`}
//                         checked={selectedAnswers[index] === optionIndex}
//                         onChange={() => handleSelect(index, optionIndex)}
//                       />
//                       <span className="text-gray-800">{option}</span>
//                     </li>
//                   )
//                 ))}
//               </ul>
//               {feedback[index] && (
//                 <p className={`mt-2 ${feedback[index] === 'Correct' ? 'text-green-700' : 'text-red-700'}`}>
//                   {feedback[index]}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Buttons Section */}
//       <div className="flex space-x-4 mt-4">
//         {!showAIAnalysis && (
//           <>
//             <Button
//               onClick={handleSubmit}
//               className="bg-blue-700 text-white text-sm px-4 py-2 rounded"
//             >
//               Submit
//             </Button>
//             <Button
//               onClick={handleAIAnalysis}
//               className="bg-green-700 text-white text-sm px-4 py-2 rounded"
//               disabled={loading}
//             >
//               {loading ? 'Analyzing...' : 'AI Analysis'}
//             </Button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TiptapViewer;




'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TiptapViewerProps {
  content: {
    title: string;
    mcqs: MCQ[];
  };
}

const TiptapViewer: React.FC<TiptapViewerProps> = ({ content }) => {
  const { title, mcqs } = content;
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(mcqs.length).fill(-1));
  const [feedback, setFeedback] = useState<(string | null)[]>(new Array(mcqs.length).fill(null));
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAIAnalysis] = useState<{ question: string; analysis: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSelect = (mcqIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[mcqIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Evaluate each answer and update feedback
    const newFeedback = mcqs.map((mcq, index) =>
      selectedAnswers[index] === -1
        ? "No answer selected"
        : selectedAnswers[index] === mcq.correctAnswer
        ? "Correct"
        : "Incorrect"
    );
    setFeedback(newFeedback);

    // Prepare data for API call
    const answerPayload = {
      title,
      answers: selectedAnswers.map((answer, index) => ({
        question: mcqs[index].question,
        selectedOption: answer,
        isCorrect: answer === mcqs[index].correctAnswer,
      })),
    };

    try {
      setSaving(true);
      const response = await fetch('http://localhost:5000/mcq/save-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to save answers');
      }

      console.log('Answers saved successfully');
    } catch (error) {
      console.error('Error saving answers:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAIAnalysis = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/mcq/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, mcqs }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI analysis');
      }

      const data = await response.json();
      const analysisData = mcqs.map((mcq, index) => ({
        question: mcq.question,
        analysis: data[index] || 'No analysis available.',
      }));

      setAIAnalysis(analysisData);
      setShowAIAnalysis(true);
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      setAIAnalysis(mcqs.map(mcq => ({ question: mcq.question, analysis: 'Failed to get AI analysis.' })));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToQuiz = () => {
    setShowAIAnalysis(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">{title}</h1>

      {/* AI Analysis View */}
      {showAIAnalysis ? (
        <div>
          {loading ? (
            <p className="text-gray-700">Loading AI analysis...</p>
          ) : (
            aiAnalysis.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
                <p className="font-semibold text-gray-900">{item.question}</p>
                <p className="text-gray-800 mt-2">{item.analysis}</p>
              </div>
            ))
          )}
          <Button
            onClick={handleBackToQuiz}
            className="bg-gray-700 text-white text-sm px-4 py-2 rounded mt-4"
          >
            Back to Quiz
          </Button>
        </div>
      ) : (
        // MCQ Quiz View
        <div>
          {mcqs.map((mcq, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
              <p className="font-semibold text-gray-900">{mcq.question}</p>
              <ul className="mt-2">
                {mcq.options.map((option, optionIndex) => (
                  option && (
                    <li key={optionIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="radio"
                        name={`mcq-${index}`}
                        checked={selectedAnswers[index] === optionIndex}
                        onChange={() => handleSelect(index, optionIndex)}
                      />
                      <span className="text-gray-800">{option}</span>
                    </li>
                  )
                ))}
              </ul>
              {feedback[index] && (
                <p className={`mt-2 ${feedback[index] === 'Correct' ? 'text-green-700' : 'text-red-700'}`}>
                  {feedback[index]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Buttons Section */}
      <div className="flex space-x-4 mt-4">
        {!showAIAnalysis && (
          <>
            <Button
              onClick={handleSubmit}
              className="bg-blue-700 text-white text-sm px-4 py-2 rounded"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Submit'}
            </Button>
            <Button
              onClick={handleAIAnalysis}
              className="bg-green-700 text-white text-sm px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'AI Analysis'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TiptapViewer;

