'use client';

import { useState, useEffect } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChatBubbleLeftRightIcon, LightBulbIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, BeakerIcon, RocketLaunchIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Level {
  number: number;
  difficulty: string;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  question?: string;
  context?: string;
  hints?: string[];
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

interface TestQuestion {
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  question: string;
  task: string;
  hints: string[];
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

  const demoLevel: Level = {
    ...level,
    question: "Bir e-ticaret sitesi için ürün açıklaması yazan bir prompt oluşturun.",
    context: "Müşteriler ürün açıklamalarının detaylı, ikna edici ve SEO dostu olmasını istiyor. Açıklamalar hem bilgilendirici hem de satış odaklı olmalı.",
    hints: [
      "Ürünün özelliklerini ve faydalarını vurgulayın",
      "Hedef kitleyi belirtin",
      "Ton ve üslup tercihlerini ekleyin",
      "Kelime sayısı sınırı belirtin"
    ]
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
                      Seviye {demoLevel.number} - {demoLevel.difficulty}
                    </span>
                  </Dialog.Title>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {demoLevel.isCompleted ? 'Bu seviyeyi tamamladınız!' : demoLevel.isCurrent ? 'Şu anki seviyeniz' : demoLevel.isLocked ? 'Bu seviye henüz kilitli' : 'Bu seviyeye erişebilirsiniz'}
                  </p>
                </div>

                {isLevelAvailable ? (
                  <div className="space-y-6">
                    {/* Question Section */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Soru
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {demoLevel.question}
                      </p>
                      <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Bağlam
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {demoLevel.context}
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
                            {demoLevel.hints?.map((hint, index) => (
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
                        Bu seviyeye erişmek için {demoLevel.number}. seviyeye ulaşmanız gerekiyor. 
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

// Self Test Modal Component
const SelfTestModal = ({ isOpen, closeModal, onComplete }: SelfTestModalProps) => {
  const [answers, setAnswers] = useState<string[]>(Array(3).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    recommendedLevel: number;
    analysis: string[];
    overallScore: number;
  } | null>(null);

  const questions: TestQuestion[] = [
    {
      difficulty: 'Kolay',
      question: 'Basit bir to-do list uygulaması için prompt yazın.',
      task: 'Bir to-do list uygulaması için AI asistana detaylı talimatlar verin. Asistanın oluşturacağı uygulamada kullanıcılar görevleri ekleyebilmeli, silebilmeli ve tamamlandı olarak işaretleyebilmelidir.',
      hints: ['Temel özellikleri listeleyin', 'Kullanıcı etkileşimlerini tanımlayın']
    },
    {
      difficulty: 'Orta',
      question: "Bir yapay zeka asistanına kişilik özellikleri tanımlayan bir prompt yazın.",
      task: "Profesyonel bir danışman rolünde bir AI asistan yaratın. Asistan empati kurabilmeli, teknik konularda uzmanlık gösterebilmeli ve kullanıcıya yardımcı olmalıdır. Asistanın karakterini ve davranışlarını detaylı olarak tanımlayın.",
      hints: [
        "Kişilik özelliklerini detaylandırın",
        "İletişim tarzını belirleyin",
        "Uzmanlık alanlarını tanımlayın",
        "Sınırlamaları belirtin"
      ]
    },
    {
      difficulty: 'Zor',
      question: "Karmaşık bir veri analizi için adım adım yönergeler içeren bir prompt oluşturun.",
      task: "Farklı veri kaynaklarından gelen bilgileri analiz edip, anlamlı içgörüler çıkaran ve bunları görselleştiren bir sistem için detaylı talimatlar yazın. Veri işleme adımlarını, analiz yöntemlerini ve çıktı formatını belirtin.",
      hints: [
        "Veri kaynaklarını ve formatlarını belirtin",
        "Analiz adımlarını sıralayın",
        "Çıktı formatını tanımlayın",
        "Hata kontrollerini ekleyin"
      ]
    }
  ];

  const handleSubmit = () => {
    setSubmitted(true);
    const recommendedLevel = Math.floor(Math.random() * 5) + 3; // Simüle edilmiş - 3-7 arası
    setFeedback({
      success: true,
      message: "Test başarılı! Önerilen başlangıç seviyesi: " + recommendedLevel,
      recommendedLevel,
      analysis: [
        "Kolay seviye prompt: İyi yapılandırılmış ve açık talimatlar",
        "Orta seviye prompt: Temel gereksinimler karşılanmış",
        "Zor seviye prompt: Daha spesifik yönergeler eklenebilir"
      ],
      overallScore: 75
    });
  };

  const handleComplete = () => {
    if (feedback) {
      onComplete(feedback.recommendedLevel);
      closeModal();
    }
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
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Seviye Belirleme Testi
                  </Dialog.Title>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Her zorluk seviyesi için bir prompt yazın. Performansınıza göre başlangıç seviyeniz belirlenecek.
                  </p>
                </div>

                {!submitted ? (
                  <div className="space-y-8">
                    {/* Progress Bar */}
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          İlerleme
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {answers.filter(Boolean).length}/3 Soru
                        </div>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        {[0, 1, 2].map((index) => (
                          <div
                            key={index}
                            className="transition-all duration-300"
                            style={{
                              width: '33.333%',
                              backgroundColor: answers[index] ? '#4285F4' : 'transparent',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                      {questions.map((q, index) => (
                        <div
                          key={index}
                          className={`rounded-xl border-2 p-6 transition-all duration-300 ${
                            answers[index]
                              ? 'border-[#4285F4] bg-gradient-to-br from-[#4285F4]/5 to-transparent'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {q.difficulty === 'Kolay' && <BeakerIcon className="w-6 h-6 text-[#4285F4]" />}
                              {q.difficulty === 'Orta' && <SparklesIcon className="w-6 h-6 text-[#FBBC05]" />}
                              {q.difficulty === 'Zor' && <RocketLaunchIcon className="w-6 h-6 text-[#EA4335]" />}
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {index + 1}. Soru - {q.difficulty} Seviye
                              </h3>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">
                                {q.question}
                              </p>
                              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                  Görev
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {q.task}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Promptunuz
                                </label>
                                <button
                                  onClick={() => setAnswers(prev => prev.map((_, i) => i === index ? '' : _))}
                                  className="text-sm text-[#4285F4] hover:text-[#4285F4]/80 flex items-center gap-1"
                                >
                                  <ArrowPathIcon className="w-4 h-4" />
                                  Sıfırla
                                </button>
                              </div>
                              
                              <div className="relative">
                                <textarea
                                  value={answers[index] || ''}
                                  onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[index] = e.target.value;
                                    setAnswers(newAnswers);
                                  }}
                                  placeholder="Promptunuzu buraya yazın..."
                                  className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
                                />
                                <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                                  {(answers[index] || '').length} karakter
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmit}
                        disabled={answers.filter(Boolean).length < 3}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          answers.filter(Boolean).length === 3
                            ? 'bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white hover:opacity-90'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Testi Tamamla
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Results Section */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#4285F4]/10 to-transparent rounded-xl p-6 border-2 border-[#4285F4]">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          Test Sonucu
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Genel Başarı:
                          </span>
                          <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] to-[#34A853]">
                            {feedback?.overallScore}%
                          </span>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                          <RocketLaunchIcon className="w-6 h-6 text-[#4285F4]" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            Önerilen Başlangıç Seviyesi: {feedback?.recommendedLevel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bu seviyeden başlamanızı öneriyoruz. İlerledikçe seviyeniz otomatik olarak artacak.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Detaylı Analiz
                        </h4>
                        <div className="space-y-3">
                          {feedback?.analysis.map((analysis: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                            >
                              <CheckCircleIcon className="w-5 h-5 text-[#34A853] flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{analysis}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={closeModal}
                        className="px-6 py-3 rounded-xl font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200"
                      >
                        İptal
                      </button>
                      <button
                        onClick={handleComplete}
                        className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white hover:opacity-90 transition-all duration-200"
                      >
                        Başla
                      </button>
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