// Viewer Page Component

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import TiptapViewer from '@/components/TiptapViewer';

export default function ViewerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  // State to store available quiz titles
  const [titles, setTitles] = useState<string[]>([]);
  // State to store the selected quiz content
  const [content, setContent] = useState<any | null>(null);
  // Loading state for fetching data
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Fetch all quiz titles from the backend
   */
  useEffect(() => {
    fetch('http://localhost:5000/questions/view-all')
      .then((res) => res.json())
      .then((data) => {
        console.log('View all questions:', data.titles);
        setTitles(data.titles || []);
      })
      .catch((err) => console.error('Loading questions list failed:', err));
  }, []);

  /**
   * Fetch the selected quiz data based on the title from URL parameters
   */
  useEffect(() => {
    if (!title) return;

    setLoading(true);
    fetch(`http://localhost:5000/questions/view?title=${encodeURIComponent(title)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`title ${title} data:`, data);

        if (data.questions) {
          // Ensure questions are extracted and preserved in their original order
          setContent({
            title: data.title,
            questions: data.questions, // Keep the original mixed order of MCQs and FRQs
          });
        } else {
          setContent(null);
        }
      })
      .catch((err) => {
        console.error(`Failed to get data for title ${title}:`, err);
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, [title]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <Card className="max-w-3xl mx-auto bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {title ? `View Questions - ${title}` : 'Select a Quiz'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* If no title is selected, show the list of available quizzes */}
          {!title ? (
            <div className="space-y-4">
              {titles.length > 0 ? (
                titles.map((t, index) => (
                  <button
                    key={index}
                    className="block w-full p-3 text-left text-blue-900 border-b hover:bg-gray-300"
                    onClick={() => router.push(`/viewer?title=${encodeURIComponent(t)}`)}
                  >
                    {t}
                  </button>
                ))
              ) : (
                <p className="text-gray-800">No quizzes available</p>
              )}
            </div>
          ) : loading ? (
            <p className="text-gray-800">Loading...</p>
          ) : content ? (
            // Pass the retrieved content (including MCQs and FRQs) to the viewer
            <TiptapViewer content={content} />
          ) : (
            <p className="text-gray-800">No questions found</p>
          )}

          {/* Navigation buttons */}
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
            {title && <Button variant="outline" onClick={() => router.push('/viewer')}>Back to List</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


