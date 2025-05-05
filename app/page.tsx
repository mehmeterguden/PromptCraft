'use client';

import { useState, useEffect, useRef } from 'react';
import { LockClosedIcon, ExclamationTriangleIcon, ChevronDownIcon, ChevronUpIcon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChatBubbleLeftRightIcon, CheckCircleIcon, XCircleIcon, BeakerIcon, RocketLaunchIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { testQuestions, levelQuestions } from './data/questions';
import type { TestQuestion, LevelQuestion } from './types/questions';
import PromptEditor from './components/PromptEditor';
import { toast } from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import ReactConfetti from 'react-confetti';

interface Level {
  number: number;
  difficulty: string;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface LevelModalProps {
  isOpen: boolean;
  closeModal: () => void;
  level: Level | null;
  currentLevel: number;
  onLevelComplete: (newLevel: number) => void;
}

interface SelfTestModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onComplete: (level: number) => void;
}

interface LevelInputResponse {
  message: string;
  levelInput?: {
    level: number;
    userInput: string;
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

interface CelebrationModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

// Level Modal Component
const LevelModal = ({ isOpen, closeModal, level, currentLevel, onLevelComplete }: LevelModalProps): JSX.Element | null => {
  const [userInput, setUserInput] = useState('');
  const [initialUserInput, setInitialUserInput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    score: number;
    suggestions?: string[];
  } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Modal açıldığında veya level değiştiğinde state'i sıfırla
  useEffect(() => {
    if (isOpen) {
      // State'i sıfırla
      setUserInput('');
      setInitialUserInput('');
      setShowHints(false);
      setIsSubmitted(false);
      setFeedback(null);
      setShowSuggestions(false);
      setIsAnalyzing(false);
      
      // Textarea'ya focus yap
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      
      // Eğer level varsa, input değerini getir
      if (level) {
        fetchLevelInput();
      }
    }
  }, [isOpen, level]);

  const fetchLevelInput = async () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser || !level) {
        console.log('User not logged in or level not selected');
        setUserInput('');
        setInitialUserInput('');
        setFeedback(null);
        setIsSubmitted(false);
        return;
      }

      const userData = JSON.parse(savedUser);
      const username = userData.username;
      if (!username) {
        console.log('Username not found in userData');
        return;
      }

      console.log('Fetching input for level:', level.number);

      const response = await fetch(`/api/prompts?username=${username}&level=${level.number}`);
      const data: LevelInputResponse = await response.json();
      console.log('Fetched level input:', data);

      if (response.ok) {
        if (data.levelInput) {
          const savedInput = data.levelInput.userInput || '';
          setUserInput(savedInput);
          setInitialUserInput(savedInput);
          setFeedback({
            success: data.levelInput.score >= 70,
            message: data.levelInput.feedback || '',
            score: data.levelInput.score || 0,
            suggestions: data.levelInput.suggestions || []
          });
          setIsSubmitted(!!data.levelInput.userInput);
        } else {
          setUserInput('');
          setInitialUserInput('');
          setFeedback(null);
          setIsSubmitted(false);
        }
      }
    } catch (error) {
      console.error('Error fetching level input:', error);
      setUserInput('');
      setInitialUserInput('');
      setFeedback(null);
      setIsSubmitted(false);
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    if (!userInput.trim()) {
      console.log('userInput is empty');
      return;
    }

    setIsAnalyzing(true); // Analiz başladığını belirt

    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser || !level) {
        console.log('savedUser or level is missing');
        return;
      }

      const userData = JSON.parse(savedUser);
      const username = userData.username;
      console.log('username from userData:', username);
      console.log('current level:', level?.number);

      // Önce Gemini API'ye istek gönder
      const evaluationResponse = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: levelQuestion?.question || '',
          prompt: levelQuestion?.task || '',
          userInput: userInput.trim(),
          questionNumber: level.number
        }),
      });

      if (!evaluationResponse.ok) {
        const errorData = await evaluationResponse.json();
        console.error('Evaluation error:', errorData);
        throw new Error(errorData.error || 'Değerlendirme başarısız oldu');
      }

      const evaluationData = await evaluationResponse.json();
      console.log('Evaluation response:', evaluationData);

      if (!evaluationData || !evaluationData.skor) {
        throw new Error('Geçersiz değerlendirme yanıtı');
      }

      // Prompt'u kaydet
      console.log('Sending request to API...');
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          level: level.number,
          userInput: userInput.trim(),
          score: evaluationData.skor,
          feedback: evaluationData.feedback,
          suggestions: evaluationData.suggestions
        }),
      });

      console.log('API response status:', response.status);
      const responseData = await response.json();
      console.log('API response data:', responseData);

      if (!response.ok) {
        toast.error('Prompt kaydedilemedi!');
        throw new Error('Prompt kaydedilemedi');
      }

      // Verileri tekrar çek ve güncelle
      const updatedDataResponse = await fetch(`/api/prompts?username=${username}&level=${level.number}`);
      const updatedData = await updatedDataResponse.json();
      
      if (updatedDataResponse.ok && updatedData.levelInput) {
        setUserInput(updatedData.levelInput.userInput || '');
        setInitialUserInput(updatedData.levelInput.userInput || '');
        
        const newScore = evaluationData.skor || 0;
        const isPassing = newScore >= 70;
        
        setFeedback({
          success: isPassing,
          message: evaluationData.feedback || '',
          score: newScore,
          suggestions: evaluationData.suggestions || []
        });

        // Eğer mevcut seviyedeyse ve skor 70'in üzerindeyse bir sonraki seviyeyi aktif et
        if (level.isCurrent && isPassing) {
          const nextLevel = level.number + 1;
          if (nextLevel <= 30) { // Maksimum seviye kontrolü
            // Kullanıcının seviyesini güncelle
            const updateLevelResponse = await fetch('/api/users/level', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                newLevel: nextLevel
              }),
            });

            if (updateLevelResponse.ok) {
              // Local storage'daki kullanıcı bilgilerini güncelle
              const updatedUserData = await updateLevelResponse.json();
              localStorage.setItem('user', JSON.stringify(updatedUserData.user));
              
              // Ana sayfadaki state'i güncelle
              onLevelComplete(nextLevel);
              
              // Başarı mesajı göster
              toast.success(`Tebrikler! ${nextLevel}. seviye açıldı!`);
            }
          }
        }

        // Başarı/başarısızlık durumuna göre mesaj göster
        if (isPassing) {
          toast.success('Tebrikler! Bu seviyeyi başarıyla tamamladınız!');
        } else {
          toast.error('Üzgünüm, geçer not alamadınız. Tekrar deneyebilirsiniz.');
        }
      }

      setIsSubmitted(true);
      setIsAnalyzing(false); // Analiz tamamlandı

    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Prompt kaydedilirken bir hata oluştu!');
      setIsAnalyzing(false); // Hata durumunda analizi sonlandır
    }
  };

  const handleReset = async () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser || !level) return;

      const userData = JSON.parse(savedUser);
      const username = userData.username;

      // Prompt'u databaseden sil
      const response = await fetch(`/api/prompts?username=${username}&level=${level.number}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Prompt silinemedi');
      }

      // State'i sıfırla
      setUserInput('');
      setIsSubmitted(false);
      setFeedback(null);
      setShowHints(false);
      setShowSuggestions(false);
      toast.success('Prompt başarıyla silindi!');
    } catch (error) {
      console.error('Error resetting prompt:', error);
      toast.error('Prompt silinirken bir hata oluştu!');
    }
  };

  if (!level) return null;

  const isLevelAvailable = level.number <= currentLevel;
  const levelQuestion = levelQuestions.find(q => q.level === level.number);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-[#4285F4]" />
                      Seviye {level?.number} - {level?.difficulty}
                    </div>
                    {feedback && feedback.score !== undefined && (
                      <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-yellow-500" />
                        <span className="text-lg font-semibold">
                          <span className="text-2xl">{feedback.score}</span>
                          <span className="text-gray-400 dark:text-gray-500">/100</span>
                        </span>
                      </div>
                    )}
                  </Dialog.Title>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {level?.isCompleted ? 'Bu seviyeyi tamamladınız!' : level?.isCurrent ? 'Şu anki seviyeniz' : isLevelAvailable ? 'Bu seviyeye erişebilirsiniz' : 'Bu seviye henüz kilitli'}
                  </p>
                </div>

                {isLevelAvailable && levelQuestion ? (
                  <div className="space-y-6">
                    {/* Question and Task Section Combined */}
                    <div className="bg-gradient-to-br from-[#4285F4]/5 to-[#34A853]/5 rounded-2xl p-8 border border-[#4285F4]/20 dark:border-gray-700 shadow-lg">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#4285F4] bg-opacity-10 rounded-lg p-2">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#4285F4]" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {levelQuestion.question}
                        </h3>
                      </div>

                      <div className="mt-6">
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-[#4285F4]/10 dark:border-gray-700/50 shadow-md">
                          <div className="relative">
                            <div className="absolute -left-3 top-0 h-full w-1 bg-[#4285F4] rounded-full shadow-[0_0_8px_rgba(66,133,244,0.3)] dark:shadow-[0_0_8px_rgba(66,133,244,0.15)]"></div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-4">
                              {levelQuestion.task}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prompt Input Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Promptunuzu Yazın
                        </h3>
                        <button
                          onClick={() => setShowHints(!showHints)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#4285F4] hover:text-[#4285F4]/80 border border-[#4285F4] hover:bg-[#4285F4]/5 transition-all duration-300"
                        >
                          <LightBulbIcon className="w-5 h-5" />
                          {showHints ? 'İpuçlarını Gizle' : 'İpuçlarını Göster'}
                        </button>
                      </div>

                      {showHints && (
                        <div className="bg-[#4285F4]/5 rounded-xl p-4 border border-[#4285F4]/20">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            İpuçları
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {levelQuestion.hints.map((hint, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                {hint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="relative">
                        <textarea
                          ref={textareaRef}
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="Promptunuzu buraya yazın..."
                          className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#4285F4] transition-colors"
                        />
                        <div className="mt-2 text-sm flex items-center gap-2">
                          {isSubmitted ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-green-600 dark:text-green-400">Bu seviye için kaydedilmiş bir prompt var</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                              <span className="text-gray-500 dark:text-gray-400">Bu seviye için kaydedilmiş bir prompt yok</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={handleReset}
                          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          Sıfırla
                        </button>
                        <button
                          onClick={() => {
                            console.log('Submit button clicked');
                            handleSubmit();
                          }}
                          disabled={!userInput.trim() || (isSubmitted && userInput === initialUserInput)}
                          className={`px-6 py-2 rounded-lg font-medium ${
                            userInput.trim() && (!isSubmitted || userInput !== initialUserInput)
                              ? 'bg-[#4285F4] text-white hover:bg-[#4285F4]/90'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isSubmitted ? 'Güncelle' : 'Gönder'}
                        </button>
                      </div>

                      {/* Analiz Durumu - Yeni Tasarım */}
                      {isAnalyzing && (
                        <div className="mt-4 flex items-center justify-center">
                          <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-blue-50/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 backdrop-blur-sm px-8 py-5 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-lg">
                            <div className="flex items-center gap-5">
                              <div className="relative flex items-center justify-center">
                                {/* Ana dönen halka */}
                                <div className="w-10 h-10 border-[3px] border-blue-100 dark:border-blue-800/50 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-[spin_1s_ease-in-out_infinite]">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 opacity-20 animate-pulse"></div>
                                  </div>
                                </div>
                                {/* AI ikonu */}
                                <svg className="absolute w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                  AI Tarafından Analiz Ediliyor
                                  <span className="inline-flex ml-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Feedback Section */}
                      <div className="mt-8 space-y-6">
                        {feedback && (
                          <div className={`bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border ${
                            feedback.success 
                              ? 'border-green-200 dark:border-green-800' 
                              : 'border-red-200 dark:border-red-800'
                          }`}>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#4285F4]" />
                                Değerlendirme
                              </h3>
                              <div className="flex items-center gap-2">
                                {feedback.success ? (
                                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span>Geçtiniz!</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <XCircleIcon className="w-5 h-5" />
                                    <span>Tekrar Deneyin</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                              {feedback.message}
                            </p>
                          </div>
                        )}

                        {/* Suggestions Section */}
                        {feedback && feedback.suggestions && feedback.suggestions.length > 0 && (
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div 
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setShowSuggestions(!showSuggestions)}
                            >
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <LightBulbIcon className="w-5 h-5 text-yellow-500" />
                                Öneriler
                              </h3>
                              <button className="text-sm text-[#4285F4] hover:text-[#4285F4]/80 flex items-center gap-1">
                                {showSuggestions ? (
                                  <>
                                    <ChevronUpIcon className="w-5 h-5" />
                                    Gizle
                                  </>
                                ) : (
                                  <>
                                    <ChevronDownIcon className="w-5 h-5" />
                                    Göster
                                  </>
                                )}
                              </button>
                            </div>
                            
                            {showSuggestions && (
                              <ul className="space-y-3 mt-4">
                                {feedback.suggestions.map((suggestion, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="mt-1.5">
                                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">
                                      {suggestion}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <div className="text-center space-y-6">
                      <div className="inline-block p-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 shadow-xl">
                        <LockClosedIcon className="w-12 h-12 text-orange-500 dark:text-orange-400" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Seviye Yetersiz
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                          Bu seviyeye erişmek için önce <span className="font-semibold text-orange-500">{currentLevel}. seviye</span>'yi tamamlamanız gerekiyor.
                          <br/>
                          <span className="inline-block mt-2">
                            Şu anki seviyeniz: <span className="font-semibold text-[#4285F4]">{currentLevel}</span>
                          </span>
                        </p>
                      </div>
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={closeModal}
                          className="px-8 py-3 rounded-xl font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Anladım
                        </button>
                      </div>
                      <div className="mt-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Seviyenizi yükseltmek için önceki seviyeleri tamamlayın veya kendinizi test edin.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const SelfTestModal = ({ isOpen, closeModal, onComplete }: SelfTestModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{
    totalScore: number;
    recommendedLevel: number;
    feedback: Array<{
      score: number;
      feedback: string;
      suggestions: string[];
    }>;
  } | null>(null);
  const testTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && !showResults) {
      setTimeout(() => {
        testTextareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentQuestionIndex, showResults]);

  const currentQuestion = testQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / testQuestions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = prompt;
        return newAnswers;
      });
      setCurrentQuestionIndex(prev => prev + 1);
      setPrompt(answers[currentQuestionIndex + 1]);
      setShowHints(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = prompt;
        return newAnswers;
      });
      setCurrentQuestionIndex(prev => prev - 1);
      setPrompt(answers[currentQuestionIndex - 1]);
      setShowHints(false);
    }
  };

  const evaluateTest = () => {
    // Son sorunun cevabını kaydet
    const finalAnswers = [...answers];
    finalAnswers[currentQuestionIndex] = prompt;

    // Simüle edilmiş değerlendirme - Gerçek implementasyonda Gemini API kullanılacak
    const results = {
      totalScore: 0,
      recommendedLevel: 1,
      feedback: finalAnswers.map((answer, index) => {
        const score = Math.min(100, Math.max(0, answer.length / 5)); // Simüle edilmiş skor
        return {
          score,
          feedback: score > 70 
            ? "Mükemmel! Prompt yazma tekniklerini iyi kullanmışsınız." 
            : "Geliştirilebilir. Daha spesifik ve detaylı promptlar yazabilirsiniz.",
          suggestions: [
            "Daha net talimatlar ekleyebilirsiniz",
            "Bağlamı daha iyi tanımlayabilirsiniz",
            "Çıktı formatını belirtebilirsiniz"
          ]
        };
      })
    };

    // Toplam skoru hesapla
    results.totalScore = Math.round(
      results.feedback.reduce((acc, curr) => acc + curr.score, 0) / results.feedback.length
    );

    // Önerilen seviyeyi belirle
    results.recommendedLevel = Math.max(1, Math.min(30, Math.floor(results.totalScore / 3.33)));

    setTestResults(results);
    setShowResults(true);
  };

  const handleComplete = () => {
    if (testResults) {
      onComplete(testResults.recommendedLevel);
      closeModal();
    }
  };

  const handleReset = () => {
    setPrompt('');
    setShowHints(false);
  };

  if (showResults && testResults) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <SparklesIcon className="w-8 h-8 text-[#4285F4]" />
                        Test Sonuçları
                      </span>
                    </Dialog.Title>
                  </div>

                  <div className="space-y-8">
                    {/* Genel Skor */}
                    <div className="bg-gradient-to-r from-[#4285F4]/10 to-[#34A853]/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          Genel Performans
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[#4285F4]">
                            {testResults.totalScore}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">/ 100</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Önerilen Başlangıç Seviyesi: {testResults.recommendedLevel}
                      </p>
                    </div>

                    {/* Soru Detayları */}
                    <div className="space-y-4">
                      {testResults.feedback.map((result, index) => (
                        <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              Soru {index + 1} - {testQuestions[index].difficulty}
                            </h4>
                            <span className="text-lg font-semibold text-[#4285F4]">
                              {result.score}/100
                            </span>
                          </div>
                          <div className="space-y-3">
                            <p className="text-gray-600 dark:text-gray-400">
                              {result.feedback}
                            </p>
                            <div className="bg-[#4285F4]/5 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Öneriler
                              </h5>
                              <ul className="list-disc list-inside space-y-1">
                                {result.suggestions.map((suggestion, i) => (
                                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => {
                          setShowResults(false);
                          setCurrentQuestionIndex(0);
                          setPrompt('');
                          setAnswers(['', '', '']);
                          setShowHints(false);
                        }}
                        className="px-6 py-2 rounded-lg font-medium border-2 border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4]/5 transition-all duration-300 flex items-center gap-2"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                        Testi Tekrarla
                      </button>
                      <button
                        onClick={closeModal}
                        className="px-6 py-2 rounded-lg font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300"
                      >
                        Kapat
                      </button>
                      <button
                        onClick={handleComplete}
                        className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white hover:opacity-90 transition-all duration-300 flex items-center gap-2"
                      >
                        Seviyeye Başla
                        <RocketLaunchIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BeakerIcon className="w-8 h-8 text-[#4285F4]" />
                      Seviye Belirleme Testi
                    </span>
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                      Soru {currentQuestionIndex + 1} / {testQuestions.length}
                    </span>
                  </Dialog.Title>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4285F4] transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Question and Task Section Combined */}
                  <div className="bg-gradient-to-br from-[#4285F4]/5 to-[#34A853]/5 rounded-2xl p-8 border border-[#4285F4]/20 dark:border-gray-700 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-[#4285F4] bg-opacity-10 rounded-lg p-2">
                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#4285F4]" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {currentQuestion.question}
                      </h3>
                    </div>

                    <div className="mt-6">
                      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-[#4285F4]/10 dark:border-gray-700/50 shadow-md">
                        <div className="relative">
                          <div className="absolute -left-3 top-0 h-full w-1 bg-[#4285F4] rounded-full shadow-[0_0_8px_rgba(66,133,244,0.3)] dark:shadow-[0_0_8px_rgba(66,133,244,0.15)]"></div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-4">
                            {currentQuestion.task}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prompt Input Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Promptunuzu Yazın
                      </h3>
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#4285F4] hover:text-[#4285F4]/80 border border-[#4285F4] hover:bg-[#4285F4]/5 transition-all duration-300"
                      >
                        <LightBulbIcon className="w-5 h-5" />
                        {showHints ? 'İpuçlarını Gizle' : 'İpuçlarını Göster'}
                      </button>
                    </div>

                    {showHints && (
                      <div className="bg-[#4285F4]/5 rounded-xl p-4 border border-[#4285F4]/20">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          İpuçları
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {currentQuestion.hints.map((hint, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="relative">
                      <textarea
                        ref={testTextareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Promptunuzu buraya yazın..."
                        className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#4285F4] transition-colors"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div>
                        {currentQuestionIndex > 0 && (
                          <button
                            onClick={handlePrevious}
                            className="px-4 py-2 rounded-lg border-2 font-medium flex items-center gap-2 border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4]/5 transition-all duration-300"
                          >
                            <ArrowPathIcon className="w-5 h-5 rotate-180" />
                            Önceki Soru
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleReset}
                          className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300"
                        >
                          Sıfırla
                        </button>
                        
                        {currentQuestionIndex < testQuestions.length - 1 ? (
                          <button
                            onClick={handleNext}
                            disabled={!prompt.trim()}
                            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                              prompt.trim()
                                ? 'bg-[#4285F4] text-white hover:bg-[#4285F4]/90 transform hover:scale-105'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Sonraki Soru
                            <ArrowPathIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={evaluateTest}
                            disabled={!prompt.trim()}
                            className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white hover:opacity-90 transform hover:scale-105 transition-all duration-300"
                          >
                            Testi Bitir
                            <SparklesIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const CelebrationModal = ({ isOpen, closeModal }: CelebrationModalProps) => {
  const { width, height } = useWindowSize();
  const [isConfettiActive, setIsConfettiActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsConfettiActive(true);
      // 10 saniye sonra konfetileri durdur
      const timer = setTimeout(() => {
        setIsConfettiActive(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {isConfettiActive && (
        <ReactConfetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full transform transition-all shadow-xl">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="w-40 h-40 bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] rounded-full blur-3xl opacity-30" />
          </div>
          
          <div className="text-center space-y-8 relative">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05]">
                TEBRİKLER! 🎉
              </h2>
              <p className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                Tüm Seviyeleri Tamamladınız!
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#4285F4]/5 to-[#34A853]/5 rounded-xl p-6 border border-[#4285F4]/20">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Artık bir prompt mühendisliği uzmanısınız! Tüm seviyeleri başarıyla tamamlayarak olağanüstü bir başarıya imza attınız. 
                Bu yolculukta öğrendiğiniz becerileri kullanarak harika promptlar yazabilirsiniz.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  30/30 Seviye Tamamlandı
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853] transition-all duration-1000"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button
              onClick={closeModal}
              className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Harika!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [levels, setLevels] = useState<Level[]>(
    Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      difficulty: i < 10 ? 'Kolay' : i < 20 ? 'Orta' : 'Zor',
      isLocked: true,
      isCompleted: false,
      isCurrent: false
    }))
  );

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isLengthValid, setIsLengthValid] = useState<boolean | null>(null);
  const [hasTurkishChars, setHasTurkishChars] = useState<boolean>(false);
  const [hasInvalidChars, setHasInvalidChars] = useState<boolean>(false);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    
    if (!value.trim()) {
      setIsUsernameValid(null);
      setIsUsernameAvailable(null);
      setIsLengthValid(null);
      setHasTurkishChars(false);
      setHasInvalidChars(false);
      return;
    }

    // Türkçe karakterleri ve geçersiz karakterleri kontrol et
    const hasTurkishChars = /[çğıöşüÇĞİÖŞÜ]/.test(value);
    const hasInvalidChars = /[^a-zA-Z0-9]/.test(value);
    const isLengthValid = value.length >= 3;
    
    setHasTurkishChars(hasTurkishChars);
    setHasInvalidChars(hasInvalidChars);
    setIsLengthValid(isLengthValid);
    
    const isValid = isLengthValid && !hasTurkishChars && !hasInvalidChars;
    setIsUsernameValid(isValid);
    
    if (isValid) {
      try {
        const response = await fetch(`/api/users?username=${encodeURIComponent(value)}`);
        const data = await response.json();
        setIsUsernameAvailable(!data.exists);
      } catch (error) {
        console.error('Kullanıcı adı kontrolü sırasında hata:', error);
        setIsUsernameAvailable(false);
      }
    } else {
      setIsUsernameAvailable(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUsername('');
    setUserData(null);
    setHasStarted(false);
    setCurrentLevel(1);
    setLevels(prevLevels =>
      prevLevels.map(l => ({
        ...l,
        isLocked: true,
        isCompleted: false,
        isCurrent: false
      }))
    );
  };

  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUsername(userData.username);
          
          const response = await fetch(`/api/users?username=${encodeURIComponent(userData.username)}`);
          const data = await response.json();
          
          if (data.exists && data.user) {
            setUserData(data.user);
            setHasStarted(true);
            setCurrentLevel(data.user.currentLevel || 1);
            
            // Seviyeleri güncelle
            setLevels(prevLevels =>
              prevLevels.map(l => ({
                ...l,
                isLocked: l.number > (data.user.currentLevel || 1),
                isCurrent: l.number === (data.user.currentLevel || 1),
                isCompleted: l.number < (data.user.currentLevel || 1)
              }))
            );
    } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
          handleLogout();
        }
      } else {
        setHasStarted(false);
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const handleTestComplete = async (level: number) => {
    try {
      if (!username) {
        throw new Error('Kullanıcı adı bulunamadı');
      }

      // Önce kullanıcının var olup olmadığını kontrol et
      const checkUserResponse = await fetch(`/api/users?username=${encodeURIComponent(username)}`);
      const checkUserData = await checkUserResponse.json();
      
      let userResponse;
      // Kullanıcı yoksa oluştur
      if (!checkUserData.exists) {
        userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });

        if (!userResponse.ok) {
          throw new Error('Kullanıcı oluşturma hatası');
        }

        // Yeni oluşturulan kullanıcı bilgilerini al
        const newUserData = await userResponse.json();
        // LocalStorage'a kaydet
        localStorage.setItem('user', JSON.stringify(newUserData.user));
      }

      // Önceki seviyeleri tamamlanmış olarak işaretle ve yeni seviyeyi ayarla
      const updateLevelResponse = await fetch('/api/users/level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          newLevel: level,
          updateCompletedLevels: true // Önceki seviyeleri tamamlanmış olarak işaretle
        })
      });

      if (!updateLevelResponse.ok) {
        throw new Error('Seviye güncelleme hatası');
      }

      const updatedUserData = await updateLevelResponse.json();

      // Güncellenmiş kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(updatedUserData.user));

      // State'leri güncelle
      setCurrentLevel(level);
      setUserData(updatedUserData.user);
      setHasStarted(true);

      // Tüm seviyeleri güncelle
      setLevels(prevLevels =>
        prevLevels.map(l => ({
          ...l,
          isLocked: l.number > level,
          isCurrent: l.number === level,
          isCompleted: l.number < level
        }))
      );

      setIsTestModalOpen(false);
      toast.success(`Seviyeniz ${level} olarak belirlendi!`);

    } catch (error) {
      console.error('Test tamamlama sırasında hata:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleStartFromLevel1 = async () => {
    try {
      // Kullanıcıyı oluştur
      const createResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      if (!createResponse.ok) {
        throw new Error('Kullanıcı oluşturma hatası');
      }

      const responseData = await createResponse.json();
      const userData = responseData.user; // API'den gelen user nesnesini al
      
      // Local storage'a kullanıcı bilgilerini kaydet
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentLevel(1);
      setHasStarted(true);
      setUserData(userData);
      
      setLevels(prevLevels =>
        prevLevels.map(l => ({
          ...l,
          isLocked: l.number !== 1,
          isCurrent: l.number === 1,
          isCompleted: false
        }))
      );

      // Seviye 1'i seç ve modalı aç
      setSelectedLevel(levels[0]);
      setIsLevelModalOpen(true);
    } catch (error) {
      console.error('Seviye 1 başlatma sırasında hata:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // localStorage'a kaydetme
  useEffect(() => {
    if (hasStarted !== null) {
      localStorage.setItem('hasStarted', hasStarted.toString());
      localStorage.setItem('levels', JSON.stringify(levels));
      localStorage.setItem('currentLevel', currentLevel.toString());
    }
  }, [levels, hasStarted, currentLevel]);

  const progressPercentage = (levels.filter(l => l.isCompleted).length / 30) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Kolay': return '#4285F4';
      case 'Orta': return '#FBBC05';
      case 'Zor': return '#EA4335';
      default: return '#4285F4';
    }
  };

  const handleLevelClick = (level: Level) => {
    setSelectedLevel(level);
    setIsLevelModalOpen(true);
  };

  const handleLevelComplete = (newLevel: number) => {
    setCurrentLevel(newLevel);
    setLevels(prevLevels =>
      prevLevels.map(l => ({
        ...l,
        isLocked: l.number > newLevel,
        isCurrent: l.number === newLevel,
        isCompleted: l.number < newLevel
      }))
    );

    // Eğer 30. seviye tamamlandıysa kutlama modalını göster
    if (newLevel === 30) {
      setShowCelebration(true);
    }
  };

  // Loading durumunda boş ekran göster
  if (isLoading) {
    return null;
  }

  // Kullanıcı daha önce başlamamışsa karşılama ekranını göster
  if (hasStarted === false || hasStarted === null) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-800 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-16">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="relative">
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-[#4285F4]/20 to-[#34A853]/20 rounded-full blur-3xl" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] to-[#34A853] relative">
                Prompt Mühendisliği
                <span className="text-4xl font-medium mt-4 block text-gray-600 dark:text-gray-300">
                  Öğrenme Platformu
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Yapay zeka ile etkileşimde başarılı olmak için prompt mühendisliği becerilerinizi geliştirin.
            </p>
          </div>

          {/* Login Card */}
          <div className="max-w-xl mx-auto w-full">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-[#4285F4]/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Kullanıcı Adınızı Girin
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Öğrenme yolculuğunuza başlamak için bir kullanıcı adı seçin
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="Kullanıcı adınız..."
                      className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 
                        placeholder-gray-400 transition-all duration-300 focus:outline-none backdrop-blur-sm text-lg
                        ${isUsernameValid === false ? 'border-red-500 focus:border-red-600' :
                          isUsernameValid === true && isUsernameAvailable === true ? 'border-green-500 focus:border-green-600' :
                          'border-gray-200 dark:border-gray-700 focus:border-[#4285F4]'}`}
                    />
                    
                    {/* Validation Icon */}
                    {username && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isUsernameValid && isUsernameAvailable ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Validation Messages - Below Input */}
                  {username && (
                    <div className="text-sm space-y-1">
                      {hasTurkishChars && (
                        <p className="text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Türkçe karakter kullanılamaz (ç, ğ, ı, ö, ş, ü)
                        </p>
                      )}
                      {hasInvalidChars && !hasTurkishChars && (
                        <p className="text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Sadece harf ve rakam kullanılabilir
                        </p>
                      )}
                      {isUsernameValid === true && isUsernameAvailable === false && (
                        <p className="text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Bu kullanıcı adı kullanılıyor
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons - Changed to row */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setIsTestModalOpen(true)}
                    disabled={!isUsernameValid || !isUsernameAvailable}
                    className={`flex-1 px-6 py-4 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center gap-2
                      ${isUsernameValid && isUsernameAvailable
                        ? 'bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white hover:opacity-90 hover:shadow-lg hover:shadow-[#4285F4]/20 transform hover:scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
                  >
                    <SparklesIcon className="w-5 h-5" />
                    Kendini Test Et
                  </button>

                  <button
                    onClick={handleStartFromLevel1}
                    disabled={!isUsernameValid || !isUsernameAvailable}
                    className={`flex-1 px-6 py-4 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-center gap-2
                      ${isUsernameValid && isUsernameAvailable
                        ? 'border-2 border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4]/5 transform hover:scale-105'
                        : 'border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
                  >
                    <RocketLaunchIcon className="w-5 h-5" />
                    Seviye 1 ile Başla
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#4285F4]/20 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/10 to-[#34A853]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="bg-gradient-to-br from-[#4285F4] to-[#34A853] w-12 h-12 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Seviye Tabanlı Öğrenme
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  30 farklı zorluk seviyesiyle adım adım prompt mühendisliği becerilerinizi geliştirin.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#FBBC05]/20 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FBBC05]/10 to-[#EA4335]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="bg-gradient-to-br from-[#FBBC05] to-[#EA4335] w-12 h-12 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <BeakerIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  AI Destekli Değerlendirme
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yapay zeka ile anında geri bildirim alın ve promptlarınızı iyileştirin.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#34A853]/20 dark:border-gray-700 transform transition-all duration-300 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#34A853]/10 to-[#4285F4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="bg-gradient-to-br from-[#34A853] to-[#4285F4] w-12 h-12 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <RocketLaunchIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Pratik Odaklı
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerçek dünya senaryolarıyla pratik yapın ve deneyim kazanın.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="space-y-12">
            <div className="relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-[#4285F4]/20 to-[#34A853]/20 rounded-full blur-3xl" />
              <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 relative mb-16">
                Nasıl Çalışır?
              </h2>
            </div>
            
            <div className="relative space-y-24">
              {/* Step 1 - Left */}
              <div className="relative flex items-center">
                <div className="w-1/4 relative z-10">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#4285F4]/20 to-[#34A853]/20 rounded-full blur-xl" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#4285F4] to-[#34A853] rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 shadow-xl mx-auto">
                    <SparklesIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="w-3/4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#4285F4]/20 dark:border-gray-700">
                  <div className="relative">
                    <div className="absolute -top-6 -left-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#4285F4] to-[#34A853] rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="ml-8">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Seviyeni Belirle
                      </h3>
                      <div className="space-y-4">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          İki farklı başlangıç seçeneği ile öğrenme yolculuğuna başla:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-[#34A853] flex-shrink-0 mt-1" />
                            <div>
                              <span className="text-lg font-medium text-[#4285F4] dark:text-[#4285F4] block mb-1">Kendini Test Et</span>
                              <p className="text-gray-600 dark:text-gray-400">Mevcut prompt mühendisliği seviyeni ölç ve uygun seviyeden başla. AI destekli test sistemi ile seviyeni belirle.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-[#34A853] flex-shrink-0 mt-1" />
                            <div>
                              <span className="text-lg font-medium text-[#4285F4] dark:text-[#4285F4] block mb-1">Seviye 1 ile Başla</span>
                              <p className="text-gray-600 dark:text-gray-400">Temelden başlayarak adım adım ilerle. Her seviyede yeni teknikler öğren ve pratik yap.</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Right */}
              <div className="relative flex items-center justify-end">
                <div className="w-3/4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#FBBC05]/20 dark:border-gray-700">
                  <div className="relative">
                    <div className="absolute -top-6 -left-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FBBC05] to-[#EA4335] rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        2
                      </div>
                    </div>
                    <div className="ml-8">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Öğren ve Uygula
                      </h3>
                      <div className="space-y-4">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          Her seviyede yeni prompt teknikleri öğren ve uygula:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-[#FBBC05] flex-shrink-0 mt-1" />
                            <div>
                              <span className="text-lg font-medium text-[#FBBC05] dark:text-[#FBBC05] block mb-1">Detaylı İpuçları</span>
                              <p className="text-gray-600 dark:text-gray-400">Her görev için özel hazırlanmış ipuçları ve önerilerle promptlarını geliştir.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-[#FBBC05] flex-shrink-0 mt-1" />
                            <div>
                              <span className="text-lg font-medium text-[#FBBC05] dark:text-[#FBBC05] block mb-1">Örnek Çözümler</span>
                              <p className="text-gray-600 dark:text-gray-400">Başarılı prompt örneklerini incele ve kendi promptlarını bu doğrultuda iyileştir.</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-1/4 relative z-10">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#FBBC05]/20 to-[#EA4335]/20 rounded-full blur-xl" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#FBBC05] to-[#EA4335] rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 shadow-xl mx-auto">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Step 3 - Left */}
              <div className="relative flex items-center">
                <div className="w-1/4 relative z-10">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#34A853]/20 to-[#4285F4]/20 rounded-full blur-xl" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#34A853] to-[#4285F4] rounded-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 shadow-xl mx-auto">
                    <BeakerIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="w-3/4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#34A853]/20 dark:border-gray-700">
                  <div className="relative">
                    <div className="absolute -top-6 -left-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#34A853] to-[#4285F4] rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        3
                      </div>
                    </div>
                    <div className="ml-8">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Gelişimini Takip Et
                      </h3>
                      <div className="space-y-4">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          AI destekli değerlendirme sistemi ile sürekli kendini geliştir:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-[#34A853] flex-shrink-0 mt-1" />
                            <div>
                              <span className="text-lg font-medium text-[#34A853] dark:text-[#34A853] block mb-1">Detaylı Analiz</span>
                              <p className="text-gray-600 dark:text-gray-400">Her promptun güçlü ve zayıf yönlerini öğren, AI'dan kapsamlı geri bildirim al.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-[#34A853] flex-shrink-0 mt-1" />
                            <div>
                              <span className="text-lg font-medium text-[#34A853] dark:text-[#34A853] block mb-1">Kişisel Öneriler</span>
                              <p className="text-gray-600 dark:text-gray-400">Performansına özel iyileştirme önerileri ile promptlarını daha etkili hale getir.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircleIcon className="w-6 h-6 text-[#34A853] flex-shrink-0 mt-1" />
                            <div>
                              <span className="text-lg font-medium text-[#34A853] dark:text-[#34A853] block mb-1">Başarı Takibi</span>
                              <p className="text-gray-600 dark:text-gray-400">Seviye atladıkça rozetler kazan, ilerleme grafiklerini takip et ve başarılarını gör.</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Modalı */}
        <SelfTestModal
          isOpen={isTestModalOpen}
          closeModal={() => setIsTestModalOpen(false)}
          onComplete={handleTestComplete}
        />
      </main>
    );
  }

  // Kullanıcı başlamışsa seviye ekranını göster
  return (
    <>
      <div className="absolute top-4 left-4 z-50">
        {userData ? (
          <div className="flex items-center gap-4 bg-gray-800/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center text-white font-medium">
                {userData.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-100 font-medium">{userData.username}</span>
            </div>
            <div className="h-5 w-px bg-gray-700/50"></div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-200 transition-colors duration-200 text-sm flex items-center gap-2"
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          username
        )}
      </div>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        {/* Progress ve Test Butonu */}
        <div className="fixed top-6 right-6 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-lg p-4 z-40">
        <div className="text-gray-800 dark:text-gray-100">
            <div className="flex items-center gap-2 mb-3">
            <RocketLaunchIcon className="w-5 h-5 text-[#4285F4]" />
              <p className="text-sm font-medium">Mevcut Seviye: <span className="text-[#4285F4] font-bold">{currentLevel}</span><span className="text-gray-400 dark:text-gray-500">/30</span></p>
          </div>
            <div className="relative mb-8">
              <div className="h-2.5 w-40 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden grid grid-cols-30 gap-px">
                {Array.from({ length: 30 }, (_, i) => (
            <div 
                    key={i} 
                    className={`h-full ${i < currentLevel ? 'bg-gradient-to-r from-[#4285F4] to-[#34A853]' : ''}`}
            />
                ))}
          </div>
              <div className="absolute -bottom-5 left-0 right-0 flex justify-between items-center">
                <p className="text-xs font-medium text-[#4285F4]">
                  Seviye {currentLevel}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  30 Seviye
                </p>
              </div>
            </div>
        </div>
        
        {/* Her zaman görünür test butonu */}
        <button 
          onClick={() => setIsTestModalOpen(true)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-[#4285F4] to-[#34A853] rounded-lg text-white font-medium text-sm hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[#4285F4]/20"
        >
          Kendini Test Et
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-24">
        <h1 className="text-6xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] to-[#34A853]">
          Prompt Mühendisliği
          <span className="text-4xl font-medium mt-2 block text-gray-600 dark:text-gray-300">
            Öğrenme Platformu
          </span>
        </h1>
      </div>

      {/* Difficulty Sections */}
      <div className="max-w-[1400px] mx-auto space-y-16">
        {['Kolay', 'Orta', 'Zor'].map((difficulty) => (
          <div key={difficulty} className="relative">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: getDifficultyColor(difficulty) }}>
                {difficulty} Seviyeler
              </h2>
              <div className="flex-1 h-px ml-6" style={{ 
                background: `linear-gradient(to right, ${getDifficultyColor(difficulty)}40, transparent)` 
              }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {levels
                .filter(level => level.difficulty === difficulty)
                .map((level, index) => (
                  <div 
                    key={level.number} 
                    className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => handleLevelClick(level)}
                  >
                    <div className={`
                        relative p-6 rounded-xl border-4 transition-all duration-300 overflow-hidden
                      ${level.isCurrent 
                        ? 'border-[#34A853] bg-[#34A853]/5 shadow-xl shadow-[#34A853]/20' 
                        : level.isLocked
                        ? 'border-opacity-40 bg-opacity-5 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
                        : level.isCompleted
                        ? `border-[${getDifficultyColor(difficulty)}] bg-[${getDifficultyColor(difficulty)}]/5 hover:shadow-lg`
                        : `border-[${getDifficultyColor(difficulty)}] bg-[${getDifficultyColor(difficulty)}]/5 hover:shadow-lg`
                      }
                      ${!level.isLocked && 'hover:shadow-xl hover:shadow-[#4285F4]/20'}
                    `}
                    style={{
                      borderColor: level.isCurrent ? '#34A853' : level.isLocked ? undefined : getDifficultyColor(difficulty),
                      transform: level.isCurrent ? 'scale(1.05)' : undefined
                    }}>
                      <div className="text-center relative z-10">
                          <span className={`block text-2xl font-bold mb-2 ${
                          level.isLocked 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-gray-800 dark:text-gray-100'
                        }`}>
                          Seviye {level.number}
                        </span>
                          <p className="font-medium" style={{ 
                          color: `${getDifficultyColor(difficulty)}${level.isLocked ? '40' : '90'}`
                        }}>
                          {difficulty}
                        </p>
                      </div>

                      {level.isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px]">
                            <div className="bg-gray-100/80 dark:bg-gray-800/80 p-3 rounded-full">
                              <LockClosedIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>
                      )}

                      {/* Connection Line */}
                      {index < 9 && (
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-4 h-[2px]"
                          style={{
                            backgroundColor: getDifficultyColor(difficulty),
                            opacity: level.isLocked ? 0.2 : 0.4
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <LevelModal
        isOpen={selectedLevel !== null}
        closeModal={() => setSelectedLevel(null)}
        level={selectedLevel}
        currentLevel={currentLevel}
        onLevelComplete={handleLevelComplete}
      />

      <SelfTestModal
        isOpen={isTestModalOpen}
        closeModal={() => setIsTestModalOpen(false)}
        onComplete={handleTestComplete}
      />

      {selectedLevel && (
        <PromptEditor
          username={username || ''}
          level={selectedLevel.number}
          isOpen={showPromptEditor}
          onClose={() => setShowPromptEditor(false)}
        />
      )}
      
      <CelebrationModal
        isOpen={showCelebration}
        closeModal={() => setShowCelebration(false)}
      />
    </main>
    </>
  );
}