// TiptapViewer 组件

'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';

interface Question {
  type: 'mcq' | 'frq';
  question: string;
  options?: string[];
  correctAnswer?: number;
}

interface AIAnalysis {
  question: string;
  type: string;
  analysis: string;
}

interface TiptapViewerProps {
  content: {
    title: string;
    questions: Question[];
  };
}

const TiptapViewer: React.FC<TiptapViewerProps> = ({ content }) => {
  const { title, questions } = content;

  const safeQuestions = questions || [];

  const [frqAnswers, setFrqAnswers] = useState<string[]>(() =>
    safeQuestions.filter(q => q.type === 'frq').map(() => '')
  );

  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(() =>
    safeQuestions.map(q => (q.type === 'mcq' ? -1 : null)) 
  );
  

  const [feedback, setFeedback] = useState<(string | null)[]>(() =>
    safeQuestions.filter(q => q.type === 'mcq').map(() => null)
  );

  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFrqAnswers(safeQuestions.filter(q => q.type === 'frq').map(() => ''));
  }, [questions]);

  const handleSelect = (index: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const newFeedback = safeQuestions.map((q, index) =>
      q.type === 'mcq'
        ? selectedAnswers[index] === -1
          ? 'No answer selected'
          : selectedAnswers[index] === q.correctAnswer
          ? 'Correct'
          : 'Incorrect'
        : null
    );
  
    setFeedback(newFeedback);
  
    const answerPayload = {
      title,
      timestamp: new Date().toISOString(),
      answers: safeQuestions.map((q, index) => {
        if (q.type === 'mcq') {
          if (selectedAnswers[index] === -1) {
            return { question: q.question, type: q.type }; // ✅ 未选择答案，不存 `isCorrect`
          }
          return {
            question: q.question,
            type: q.type,
            selectedOption: selectedAnswers[index],
            isCorrect: selectedAnswers[index] === q.correctAnswer, // ✅ 确保 `selectedOption` 存在
          };
        }
  
        if (q.type === 'frq') {
          return {
            question: q.question,
            type: q.type,
            answer: frqAnswers[index] !== '' ? frqAnswers[index] : undefined, // ✅ 为空则不存
          };
        }
  
        return {};
      }).filter(item => Object.keys(item).length > 1) // ✅ 过滤无效数据
    };
  
    try {
      setSaving(true);
      const response = await fetch('http://localhost:5000/questions/save-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerPayload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save answers');
      }
  
      alert('Answers submitted successfully');
    } catch (error) {
      alert('Failed to submit answers. Please try again.');
      console.error('Error saving answers:', error);
    } finally {
      setSaving(false);
    }
  };
  




  const handleAIAnalysis = async () => {
    setLoading(true);

    const aiPayload = {
      title,
      questions: safeQuestions.map(q => ({
        question: q.question,
        type: q.type,
        options: q.type === 'mcq' ? q.options : undefined,
      })),
    };

    try {
      const response = await fetch('http://localhost:5000/questions/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI analysis');
      }

      const data = await response.json();
      console.log("AI Analysis Response:", data);

      if (!Array.isArray(data)) {
        throw new Error("AI analysis response format is incorrect");
      }

      const analysisData = safeQuestions.map((q, index) => ({
        question: q.question,
        type: q.type,
        analysis: data[index]?.analysis || 'No analysis available.',
      }));

      setAIAnalysis(analysisData);
      setShowAIAnalysis(true);
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      setAIAnalysis(
        safeQuestions.map(q => ({
          question: q.question,
          type: q.type,
          analysis: 'Failed to get AI analysis.',
        }))
      );
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

      {showAIAnalysis ? (
        <div>
          {loading ? (
            <p className="text-gray-700">Loading AI analysis...</p>
          ) : (
            aiAnalysis.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
                <p className="font-semibold text-gray-900">
                  {item.question} {item.type ? `(${item.type.toUpperCase()})` : ''}
                </p>
                <p className="text-gray-800 mt-2">{item.analysis}</p>
              </div>
            ))
          )}
          <Button onClick={handleBackToQuiz} className="bg-gray-700 text-white text-sm px-4 py-2 rounded mt-4">
            Back to Quiz
          </Button>
        </div>
      ) : (
        <div>
          {safeQuestions.map((q, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-100 mb-4">
              <p className="font-semibold text-gray-900">{q.question}</p>
              {q.type === 'mcq' && (
                <>
                  <ul className="mt-2">
                    {q.options?.map((option, optionIndex) => (
                      <li key={optionIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          name={`mcq-${index}`}
                          checked={selectedAnswers[index] === optionIndex}
                          onChange={() => handleSelect(index, optionIndex)}
                        />
                        <span className="text-gray-800">{option}</span>
                      </li>
                    ))}
                  </ul>
                  {feedback[index] && (
                    <p className={`mt-2 ${feedback[index] === 'Correct' ? 'text-green-700' : 'text-red-700'}`}>
                      {feedback[index]}
                    </p>
                  )}
                </>
              )}
              {q.type === 'frq' && (
                <textarea
                  value={frqAnswers[index]}
                  onChange={(e) => {
                    const newAnswers = [...frqAnswers];
                    newAnswers[index] = e.target.value;
                    setFrqAnswers(newAnswers);
                  }}
                  className="w-full border rounded p-2 text-black placeholder:text-gray-400 mt-2"
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          ))}
          <div className="flex space-x-4 mt-4">
            <Button onClick={handleSubmit} className="bg-blue-700 text-white text-sm px-4 py-2 rounded">
              Submit
            </Button>
            <Button onClick={handleAIAnalysis} className="bg-green-700 text-white text-sm px-4 py-2 rounded">
              AI Analysis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiptapViewer;
