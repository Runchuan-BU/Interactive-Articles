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

  const [titles, setTitles] = useState<string[]>([]);
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all MCQ titles
  useEffect(() => {
    fetch('http://localhost:5000/mcq/view-all')
      .then((res) => res.json())
      .then((data) => {
        console.log('View all MCQs:', data.titles);
        setTitles(data.titles || []);
      })
      .catch((err) => console.error('Loading MCQ list failed:', err));
  }, []);

  // Load selected MCQ
  useEffect(() => {
    if (!title) return;

    setLoading(true);
    fetch(`http://localhost:5000/mcq/view?title=${encodeURIComponent(title)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`title ${title} data:`, data);
        setContent(data);
      })
      .catch((err) => {
        console.error(`get ${title} data failed:`, err);
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, [title]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <Card className="max-w-3xl mx-auto bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {title ? `View MCQs - ${title}` : 'Select a Quiz'}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                <p className="text-gray-800">No MCQ data</p>
              )}
            </div>
          ) : loading ? (
            <p className="text-gray-800">Loading...</p>
          ) : content ? (
            <TiptapViewer content={content} />
          ) : (
            <p className="text-gray-800">No MCQs</p>
          )}
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
            {title && <Button variant="outline" onClick={() => router.push('/viewer')}>Back to List</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

