'use client';

import { useState, useEffect } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChatBubbleLeftRightIcon, LightBulbIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, BeakerIcon, RocketLaunchIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { testQuestions, levelQuestions } from './data/questions';
import type { TestQuestion, LevelQuestion } from './types/questions';

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
}

interface SelfTestModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onComplete: (level: number) => void;
}

// Level Modal Component
const LevelModal = ({ isOpen, closeModal, level, currentLevel }: LevelModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    suggestions?: string[];
  } | null>(null);

  if (!level) return null;

  const isLevelAvailable = level.number <= currentLevel;
  const levelQuestion = levelQuestions.find(q => q.level === level.number);

  const handleSubmit = () => {
    // Simüle edilmiş değerlendirme - Gerçek implementasyonda Gemini API kullanılacak
    setIsSubmitted(true);
    setFeedback({
      success: false,
      message: "Promptunuz geliştirilebilir. Aşağıdaki önerileri dikkate alın:",
      suggestions: [
        "Daha spesifik talimatlar ekleyin",
        "Bağlamı daha net belirtin",
        "İstenen çıktı formatını belirtin"
      ]
    });
  };

  const handleReset = () => {
    setPrompt('');
    setIsSubmitted(false);
    setFeedback(null);
    setShowHints(false);
  };

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
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-[#4285F4]" />
                      Seviye {level?.number} - {level?.difficulty}
                    </span>
                  </Dialog.Title>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {level?.isCompleted ? 'Bu seviyeyi tamamladınız!' : level?.isCurrent ? 'Şu anki seviyeniz' : level?.isLocked ? 'Bu seviye henüz kilitli' : 'Bu seviyeye erişebilirsiniz'}
                  </p>
                </div>

                {isLevelAvailable && levelQuestion ? (
                  <div className="space-y-6">
                    {/* Question Section */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Soru
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {levelQuestion.question}
                      </p>
                      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Görev
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {levelQuestion.task}
                        </p>
                      </div>
                    </div>

                    {/* Prompt Input Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Promptunuzu Yazın
                        </h3>
                        <button
                          onClick={() => setShowHints(!showHints)}
                          className="flex items-center gap-2 text-sm text-[#4285F4] hover:text-[#4285F4]/80"
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
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Promptunuzu buraya yazın..."
                          className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#4285F4] transition-colors"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={handleReset}
                          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          Sıfırla
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!prompt.trim()}
                          className={`px-6 py-2 rounded-lg font-medium ${
                            prompt.trim()
                              ? 'bg-[#4285F4] text-white hover:bg-[#4285F4]/90'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Gönder
                        </button>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    {isSubmitted && feedback && (
                      <div className={`rounded-xl p-6 ${
                        feedback.success
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900'
                          : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900'
                      }`}>
                        <div className="flex items-start gap-3">
                          {feedback.success ? (
                            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                          ) : (
                            <XCircleIcon className="w-6 h-6 text-orange-500 flex-shrink-0" />
                          )}
                          <div>
                            <h3 className={`font-medium ${
                              feedback.success ? 'text-green-900 dark:text-green-100' : 'text-orange-900 dark:text-orange-100'
                            }`}>
                              {feedback.message}
                            </h3>
                            {!feedback.success && feedback.suggestions && (
                              <ul className="mt-3 list-disc list-inside space-y-1">
                                {feedback.suggestions.map((suggestion, index) => (
                                  <li key={index} className="text-sm text-orange-700 dark:text-orange-300">
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12">
                    <div className="text-center space-y-4">
                      <div className="inline-block p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                        <LockClosedIcon className="w-8 h-8 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Seviye Yetersiz
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Bu seviyeye erişmek için {level?.number}. seviyeye ulaşmanız gerekiyor. 
                        Şu anki seviyeniz: {currentLevel}
                      </p>
                      <div className="mt-8">
                        <button
                          onClick={closeModal}
                          className="px-6 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          Anladım
                        </button>
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
                  {/* Question Section */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <RocketLaunchIcon className="w-5 h-5 text-[#4285F4]" />
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        currentQuestion.difficulty === 'Kolay' ? 'bg-green-100 text-green-800' :
                        currentQuestion.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentQuestion.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {currentQuestion.question}
                    </h3>
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Görev
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentQuestion.task}
                      </p>
                    </div>
                  </div>

                  {/* Prompt Input Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Promptunuzu Yazın
                      </h3>
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 text-sm text-[#4285F4] hover:text-[#4285F4]/80"
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
  const [isInitialized, setIsInitialized] = useState(false);

  // İlk yükleme ve localStorage kontrolü
  useEffect(() => {
    const savedLevels = localStorage.getItem('levels');
    if (savedLevels) {
      const parsedLevels = JSON.parse(savedLevels);
      setLevels(parsedLevels.map((level: Level) => ({
        ...level,
        isLocked: !level.isCompleted && level.number !== 1,
        isCurrent: level.number === parseInt(localStorage.getItem('currentLevel') || '1')
      })));
    } else {
      // İlk seviyeyi aç
      setLevels(prev => prev.map(level => ({
        ...level,
        isLocked: level.number !== 1,
        isCurrent: level.number === 1
      })));
    }
    setIsInitialized(true);
  }, []);

  // localStorage'a kaydetme
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('levels', JSON.stringify(levels));
    }
  }, [levels, isInitialized]);

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

  const handleTestComplete = (level: number) => {
    setCurrentLevel(level);
    setLevels(prevLevels =>
      prevLevels.map(l => ({
        ...l,
        isLocked: l.number > level,
        isCurrent: l.number === level
      }))
    );
    setIsTestModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Progress ve Test Butonu */}
      <div className="fixed top-6 right-6 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-xl shadow-lg p-4 z-40 space-y-4">
        <div className="text-gray-800 dark:text-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <RocketLaunchIcon className="w-5 h-5 text-[#4285F4]" />
            <p className="text-sm font-medium">Mevcut Seviye: {currentLevel}/30</p>
          </div>
          <div className="mt-2 h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
            %{progressPercentage.toFixed(0)} Tamamlandı
          </p>
        </div>
        
        {/* Her zaman görünür test butonu */}
        <button 
          onClick={() => setIsTestModalOpen(true)}
          className="w-full px-4 py-2 bg-gradient-to-r from-[#4285F4] to-[#34A853] rounded-lg text-white font-medium text-sm hover:opacity-90 transition-all duration-300"
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
                      relative p-6 rounded-xl border-4 transition-all duration-300
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
                        <span className={`text-2xl font-bold ${
                          level.isLocked 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-gray-800 dark:text-gray-100'
                        }`}>
                          Seviye {level.number}
                        </span>
                        <p className="mt-2 font-medium" style={{ 
                          color: `${getDifficultyColor(difficulty)}${level.isLocked ? '40' : '90'}`
                        }}>
                          {difficulty}
                        </p>
                      </div>

                      {level.isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-[1px]"
                          style={{ backgroundColor: `${getDifficultyColor(difficulty)}05` }}>
                          <LockClosedIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
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
        isOpen={isLevelModalOpen}
        closeModal={() => setIsLevelModalOpen(false)}
        level={selectedLevel}
        currentLevel={currentLevel}
      />

      <SelfTestModal
        isOpen={isTestModalOpen}
        closeModal={() => setIsTestModalOpen(false)}
        onComplete={handleTestComplete}
      />
    </main>
  );
}