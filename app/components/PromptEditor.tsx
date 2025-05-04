import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface PromptEditorProps {
  username: string;
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  username,
  level,
  isOpen,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    suggestions: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPrompt();
    }
  }, [isOpen, username, level]);

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts?username=${username}&level=${level}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        
        if (data.levelInput) {
          const levelInput = data.levelInput;
          console.log('Level input data:', levelInput);
          
          setPrompt(levelInput.userInput || '');
          
          // Değerlendirme verilerini direkt olarak set ediyoruz
          setEvaluation({
            score: levelInput.score || 0,
            feedback: levelInput.feedback || '',
            suggestions: levelInput.suggestions || []
          });
          console.log('Setting evaluation:', {
            score: levelInput.score,
            feedback: levelInput.feedback,
            suggestions: levelInput.suggestions
          });
        } else {
          setPrompt('');
          setEvaluation(null);
        }
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
      toast.error('Prompt yüklenirken bir hata oluştu.');
    }
  };

  const handleSave = async () => {
    if (!prompt.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          level,
          userInput: prompt.trim()
        }),
      });

      const data = await response.json();
      console.log('Save response data:', data);
      
      if (response.ok) {
        const levelInput = data.levelInput;
        
        setEvaluation({
          score: levelInput.score || 0,
          feedback: levelInput.feedback || '',
          suggestions: levelInput.suggestions || []
        });

        if (data.levelCompleted) {
          toast.success(`Tebrikler! Seviye ${level} tamamlandı. Yeni seviyeniz: ${data.newLevel}`, {
            duration: 5000
          });
        } else {
          if (levelInput.score >= 70) {
            toast.success('Başarılı! 🎉 Prompt kaydedildi.', {
              duration: 3000
            });
          } else {
            toast.error('Prompt kaydedildi fakat geçer not alamadınız. Tekrar deneyin!', {
              duration: 3000
            });
          }
        }
      } else {
        throw new Error(data.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Prompt kaydedilirken bir hata oluştu!');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prompt Düzenleyici - Seviye {level}
          </h2>
          {evaluation && (
            <div className={`px-4 py-2 rounded-lg ${
              evaluation.score >= 70 
                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100' 
                : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
            }`}>
              <span className="font-medium">
                {evaluation.score}/100
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setIsEditing(true);
              }}
              placeholder="Promptunuzu buraya yazın..."
              className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#4285F4] transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={!isEditing || isSaving}
              className={`px-4 py-2 rounded-lg text-white ${
                isEditing && !isSaving
                  ? 'bg-[#4285F4] hover:bg-[#3367D6]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>

          {evaluation && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Geri Bildirim:</span> {evaluation.feedback}
                </p>
              </div>

              {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="w-full p-4 flex justify-between items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="font-medium">Önerileri Görüntüle</span>
                    {showSuggestions ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>
                  
                  {showSuggestions && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                      <ul className="list-disc list-inside space-y-2">
                        {evaluation.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptEditor; 