'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Food } from '@/types';
import { RotateCcw, Sparkles, ChefHat, Star } from 'lucide-react';

interface FoodResultProps {
  foods: Food[];
  mediumCategory: string;
  onRestart: () => void;
}

// キラキラパーティクルコンポーネント
function SparkleParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: [0, x],
        y: [0, y],
      }}
      transition={{ 
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      className="absolute"
    >
      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
    </motion.div>
  );
}

// カードコンポーネント
function FoodCard({ food, index, isRevealed }: { food: Food; index: number; isRevealed: boolean }) {
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isRevealed) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isRevealed]);

  // キラキラの位置（ランダム）
  const sparklePositions = [
    { x: -30, y: -20, delay: 0 },
    { x: 30, y: -25, delay: 0.1 },
    { x: -25, y: 15, delay: 0.15 },
    { x: 35, y: 20, delay: 0.2 },
    { x: 0, y: -30, delay: 0.05 },
    { x: -40, y: 0, delay: 0.25 },
    { x: 40, y: -10, delay: 0.12 },
  ];

  return (
    <div className="relative perspective-1000">
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          // カード裏面（めくる前）
          <motion.div
            key="back"
            initial={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-6 
                     shadow-lg border-2 border-orange-300
                     flex items-center justify-center min-h-[140px]
                     backface-hidden"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white/30">?</div>
              <p className="text-white/60 text-sm mt-2">タップで公開</p>
            </div>
          </motion.div>
        ) : (
          // カード表面（めくった後）
          <motion.div
            key="front"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-2xl p-5 
                     shadow-lg border border-gray-100
                     hover:shadow-xl hover:border-orange-200/50
                     transition-all duration-300 min-h-[140px]
                     flex items-center gap-4"
          >
            {/* キラキラエフェクト */}
            {showSparkles && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                {sparklePositions.map((pos, i) => (
                  <SparkleParticle key={i} delay={pos.delay} x={pos.x} y={pos.y} />
                ))}
              </div>
            )}

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex-shrink-0"
            >
              <ChefHat className="w-6 h-6 text-orange-600" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs font-medium text-orange-500 mb-0.5 block"
              >
                おすすめ {index + 1}
              </motion.span>
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="text-lg font-semibold text-gray-800"
              >
                {food.name}
              </motion.h3>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-orange-400/30"
            >
              {String(index + 1).padStart(2, '0')}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FoodResult({ foods, mediumCategory, onRestart }: FoodResultProps) {
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [autoRevealIndex, setAutoRevealIndex] = useState(0);

  // 初期化とオートリビール
  useEffect(() => {
    setRevealedCards(new Array(foods.length).fill(false));
    setAutoRevealIndex(0);
  }, [foods]);

  // カードを順番に自動でめくる
  useEffect(() => {
    if (autoRevealIndex < foods.length) {
      const timer = setTimeout(() => {
        setRevealedCards(prev => {
          const newState = [...prev];
          newState[autoRevealIndex] = true;
          return newState;
        });
        setAutoRevealIndex(prev => prev + 1);
      }, autoRevealIndex === 0 ? 500 : 600); // 最初は0.5秒後、その後は0.6秒間隔

      return () => clearTimeout(timer);
    }
  }, [autoRevealIndex, foods.length]);

  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto"
      >
        {/* 戻るボタン */}
        <motion.button
          onClick={onRestart}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 text-gray-500 hover:text-gray-700 transition-colors 
                   flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">最初から選び直す</span>
        </motion.button>

        {/* ヘッダー */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                      bg-gradient-to-r from-orange-100 to-amber-100 
                      text-orange-700 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {mediumCategory}
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            おすすめ料理 TOP 3
          </h2>
          <p className="text-gray-500">
            今日はこちらの料理はいかがですか？
          </p>
        </div>

        {/* 料理カード */}
        <div className="space-y-4 mb-10">
          {foods.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <FoodCard 
                food={food} 
                index={index} 
                isRevealed={revealedCards[index] || false}
              />
            </motion.div>
          ))}
        </div>

        {/* もう一度選ぶボタン */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + foods.length * 0.6, duration: 0.4 }}
          className="text-center"
        >
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 
                     px-8 py-3.5 rounded-2xl font-semibold
                     transition-all duration-300 shadow-sm hover:shadow"
          >
            もう一度選ぶ
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
