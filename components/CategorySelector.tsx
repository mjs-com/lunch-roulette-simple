'use client';

import { motion } from 'framer-motion';
import { Category } from '@/types';
import { 
  Globe, 
  UtensilsCrossed, 
  Heart, 
  Beef, 
  ChefHat, 
  Activity, 
  Clock, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

// 8つのカテゴリに対応するアイコン
const categoryIcons = [
  Globe,          // 国籍
  UtensilsCrossed, // 主食
  Heart,          // 味覚
  Beef,           // 食材
  ChefHat,        // 調理
  Activity,       // 体調
  Clock,          // 状況
  Calendar,       // 季節
];

const categoryColors = [
  'from-blue-500/10 to-cyan-500/10',
  'from-orange-500/10 to-amber-500/10',
  'from-pink-500/10 to-rose-500/10',
  'from-red-500/10 to-orange-500/10',
  'from-violet-500/10 to-purple-500/10',
  'from-green-500/10 to-emerald-500/10',
  'from-slate-500/10 to-gray-500/10',
  'from-teal-500/10 to-cyan-500/10',
];

const iconColors = [
  'text-blue-600',
  'text-orange-600',
  'text-pink-600',
  'text-red-600',
  'text-violet-600',
  'text-green-600',
  'text-slate-600',
  'text-teal-600',
];

export default function CategorySelector({ categories, onSelect }: CategorySelectorProps) {
  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto"
      >
        {/* ヘッダー */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            今日の食事を決めましょう
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
            何を基準に選びますか？
          </h1>
          <p className="text-gray-500 text-lg">
            気分やシーンに合わせてカテゴリを選んでください
          </p>
        </div>

        {/* カテゴリグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[index] || Globe;
            const gradientColor = categoryColors[index] || categoryColors[0];
            const iconColor = iconColors[index] || iconColors[0];
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.1 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(category)}
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 
                         shadow-sm border border-gray-100/80
                         hover:shadow-lg hover:border-gray-200/80
                         transition-all duration-300
                         text-left group overflow-hidden"
              >
                {/* 背景グラデーション */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor} 
                                group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5 truncate">
                      {category.large_category}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {category.medium_categories.length}種類から抽選
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
