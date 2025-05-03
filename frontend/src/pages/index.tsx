import { useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: string;
}

interface Evaluation {
  score: number;
  clarity: number;
  specificity: number;
  goal_alignment: number;
  feedback: string;
  improved_prompt: string;
  passed: boolean;
}

export default function Home() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [prompt, setPrompt] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);

  const startTask = async (taskId: number) => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`);
      setCurrentTask(response.data);
      setEvaluation(null);
    } catch (error) {
      console.error('Görev yüklenirken hata oluştu:', error);
    }
  };

  const submitPrompt = async () => {
    if (!currentTask || !prompt) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/evaluate', {
        prompt,
        task_id: currentTask.id
      });
      setEvaluation(response.data);
    } catch (error) {
      console.error('Değerlendirme sırasında hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">PromptCraft</h1>
        
        {!currentTask ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((taskId) => (
              <button
                key={taskId}
                onClick={() => startTask(taskId)}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                Görev {taskId}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-2">{currentTask.title}</h2>
              <p className="text-gray-600 mb-4">{currentTask.description}</p>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {currentTask.difficulty}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg"
                placeholder="Promptunuzu buraya yazın..."
              />
              <button
                onClick={submitPrompt}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Değerlendiriliyor...' : 'Değerlendir'}
              </button>
            </div>

            {evaluation && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Değerlendirme Sonucu</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">{evaluation.score}</div>
                    <div className="text-sm text-gray-600">Toplam Puan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{evaluation.clarity}</div>
                    <div className="text-sm text-gray-600">Netlik</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">{evaluation.specificity}</div>
                    <div className="text-sm text-gray-600">Özgünlük</div>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Geri Bildirim</h4>
                  <p className="text-gray-700">{evaluation.feedback}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Geliştirilmiş Öneri</h4>
                  <p className="text-gray-700">{evaluation.improved_prompt}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 