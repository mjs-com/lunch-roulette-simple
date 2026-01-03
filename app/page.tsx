'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import CategorySelector from '@/components/CategorySelector';
import Roulette from '@/components/Roulette';
import FoodResult from '@/components/FoodResult';
import { categories } from '@/lib/data';
import { Category, Food } from '@/types';

type Step = 'category' | 'roulette' | 'result';

export default function Home() {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedMediumCategory, setSelectedMediumCategory] = useState<string>('');
  const [resultFoods, setResultFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep('roulette');
    setError(null);
  };

  const handleRouletteResult = useCallback(async (mediumCategory: string) => {
    if (!selectedCategory) return;
    
    setSelectedMediumCategory(mediumCategory);
    setIsLoading(true);
    setError(null);
    
    try {
      // APIから料理データを取得（遅延読み込み）
      const response = await fetch(
        `/api/foods?categoryId=${selectedCategory.id}&mediumCategory=${encodeURIComponent(mediumCategory)}&count=3`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`);
      }
      
      const foods = await response.json();
      
      // エラーレスポンスのチェック
      if (foods.error) {
        throw new Error(foods.details || foods.error);
      }
      
      // 空の配列チェック
      if (!Array.isArray(foods) || foods.length === 0) {
        throw new Error('料理データが見つかりませんでした');
      }
      
      setResultFoods(foods);
      setStep('result');
    } catch (error) {
      console.error('Failed to fetch foods:', error);
      const errorMessage = error instanceof Error ? error.message : 'データの取得に失敗しました';
      setError(errorMessage);
      // エラーが発生してもルーレット画面に戻る
      setStep('roulette');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  const handleBack = () => {
    if (step === 'roulette') {
      setStep('category');
      setSelectedCategory(null);
      setError(null);
    } else if (step === 'result') {
      setStep('roulette');
      setSelectedMediumCategory('');
      setResultFoods([]);
      setError(null);
    }
  };

  const handleRestart = () => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedMediumCategory('');
    setResultFoods([]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/30">
      <AnimatePresence mode="wait">
        {step === 'category' && (
          <CategorySelector
            key="category"
            categories={categories}
            onSelect={handleCategorySelect}
          />
        )}
        {step === 'roulette' && selectedCategory && (
          <Roulette
            key="roulette"
            category={selectedCategory}
            onResult={handleRouletteResult}
            onBack={handleBack}
            isLoading={isLoading}
            error={error}
          />
        )}
        {step === 'result' && (
          <FoodResult
            key="result"
            foods={resultFoods}
            mediumCategory={selectedMediumCategory}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
