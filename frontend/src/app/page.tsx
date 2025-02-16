'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <Card className="w-full max-w-lg text-center shadow-xl rounded-lg border border-gray-200 bg-white p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-4">Select Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-600 text-lg">Choose how you want to interact with the editor:</p>
          <div className="flex flex-col gap-6">
            <Button onClick={() => router.push('/editor')} className="w-full py-4 text-lg font-semibold rounded-lg shadow-md bg-blue-500 text-white hover:bg-blue-600">
              Editor Mode
            </Button>
            <Button onClick={() => router.push('/viewer')} variant="outline" className="w-full py-4 text-lg font-semibold rounded-lg shadow-md border-gray-300 text-gray-800 hover:bg-gray-200">
              View Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}