'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { ArrowLeft, Loader2, Play } from 'lucide-react';

interface RouletteProps {
  category: Category;
  onResult: (mediumCategory: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// セグメントの色（パステルカラー）
const segmentColors = [
  '#FFB5A7', // coral
  '#FCD5CE', // peach
  '#F8EDEB', // cream
  '#E8E8E4', // gray
  '#D8E2DC', // sage
  '#BCE4D8', // mint
  '#A2D2FF', // sky
  '#BDE0FE', // light blue
  '#FFAFCC', // pink
  '#CDB4DB', // lavender
];

export default function Roulette({ category, onResult, onBack, isLoading = false, error = null }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const items = category.medium_categories;
  const segmentAngle = 360 / items.length;

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // スピン開始
  const spin = () => {
    if (isSpinning || isLoading) return;
    
    setIsSpinning(true);
    setShowResult(false);
    setResultIndex(null);
    
    // ランダムな回転量を決定（3-5回転 + ランダムな位置）
    const spins = 3 + Math.random() * 2;
    const randomExtra = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + randomExtra;
    
    setRotation(totalRotation);
    
    // 2秒後に結果を計算（実際に矢印が指しているセグメントを検出）
    timeoutRef.current = setTimeout(() => {
      const finalAngle = totalRotation % 360;
      
      // 矢印が指しているセグメントを計算
      // セグメントは上（-90度）から時計回りに配置
      // ルーレットがfinalAngle回転すると、矢印から見て反時計回りに回転したように見える
      // 正規化: (360 - finalAngle) % 360 で矢印が指す角度（セグメント内）
      const normalized = ((360 - finalAngle) % 360 + 360) % 360;
      const selectedIndex = Math.floor(normalized / segmentAngle) % items.length;
      
      setIsSpinning(false);
      setShowResult(true);
      setResultIndex(selectedIndex);
      onResult(items[selectedIndex]);
    }, 2000);
  };

  // 円形セグメントのパスを生成
  const createSegmentPath = (index: number, total: number, radius: number) => {
    const angle = 360 / total;
    const startAngle = index * angle - 90;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // テキストの位置を計算
  const getTextPosition = (index: number, total: number, radius: number) => {
    const angle = 360 / total;
    const midAngle = index * angle + angle / 2 - 90;
    const rad = (midAngle * Math.PI) / 180;
    const textRadius = radius * 0.65;
    
    return {
      x: radius + textRadius * Math.cos(rad),
      y: radius + textRadius * Math.sin(rad),
      rotation: midAngle + 90,
    };
  };

  const isDisabled = isSpinning || isLoading;
  const wheelSize = 280;
  const radius = wheelSize / 2;

  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg mx-auto"
      >
        {/* 戻るボタン */}
        <motion.button
          onClick={onBack}
          disabled={isDisabled}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 text-gray-500 hover:text-gray-700 transition-colors 
                   flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">カテゴリ選択に戻る</span>
        </motion.button>

        {/* タイトル */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            {category.large_category}
          </h2>
          <p className="text-gray-500">
            ルーレットを回して決めましょう
          </p>
        </div>

        {/* ルーレット */}
        <div className="relative flex justify-center mb-8">
          {/* 矢印インジケーター */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] 
                          border-l-transparent border-r-transparent border-t-orange-500
                          drop-shadow-md" />
          </div>

          {/* ルーレットホイール */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{
              duration: 2,
              ease: [0.2, 0.8, 0.2, 1], // カスタムイージング（減速感）
            }}
            className="relative"
            style={{ width: wheelSize, height: wheelSize }}
          >
            <svg 
              width={wheelSize} 
              height={wheelSize} 
              viewBox={`0 0 ${wheelSize} ${wheelSize}`}
              className="drop-shadow-lg"
            >
              {/* セグメント */}
              {items.map((item, index) => (
                <path
                  key={index}
                  d={createSegmentPath(index, items.length, radius)}
                  fill={segmentColors[index % segmentColors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />
              ))}
              
              {/* テキスト */}
              {items.map((item, index) => {
                const pos = getTextPosition(index, items.length, radius);
                
                return (
                  <text
                    key={`text-${index}`}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${pos.rotation}, ${pos.x}, ${pos.y})`}
                    className="text-[10px] md:text-xs font-medium fill-gray-700 pointer-events-none"
                  >
                    {item}
                  </text>
                );
              })}
              
              {/* 中心の円 */}
              <circle
                cx={radius}
                cy={radius}
                r={radius * 0.15}
                fill="#fff"
                stroke="#e5e7eb"
                strokeWidth="2"
                className="drop-shadow"
              />
            </svg>
          </motion.div>
        </div>

        {/* スピンボタン */}
        <div className="flex justify-center">
          <motion.button
            onClick={spin}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 
                     text-white px-10 py-4 rounded-2xl text-lg font-semibold
                     shadow-lg shadow-orange-500/25 
                     hover:shadow-xl hover:shadow-orange-500/30
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                読み込み中...
              </>
            ) : isSpinning ? (
              '回転中...'
            ) : (
              <>
                <Play className="w-5 h-5" />
                ルーレットを回す
              </>
            )}
          </motion.button>
        </div>

        {/* エラーメッセージ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
              <div className="inline-block bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl">
                <p className="text-sm font-medium">エラーが発生しました</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 結果表示 */}
        <AnimatePresence>
          {showResult && resultIndex !== null && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-center"
            >
              <div className="inline-block bg-gradient-to-r from-orange-50 to-amber-50 
                            border border-orange-200/60 px-6 py-4 rounded-2xl">
                <p className="text-sm text-orange-600 font-medium mb-1">選ばれたジャンル</p>
                <p className="text-xl font-bold text-gray-800">{items[resultIndex]}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
