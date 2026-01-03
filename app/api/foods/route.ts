import { NextRequest, NextResponse } from 'next/server';
import { getTagKeyForCategory } from '@/lib/utils';
import { getOriginalTagValue } from '@/lib/tag-mapping';
import { Food } from '@/types';

// 元のfood-list.jsonを使用（タグ値が元の長い名前のため）
async function getFoods(): Promise<Food[]> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'food-list.json');
    
    // ファイルの存在確認
    if (!fs.existsSync(filePath)) {
      throw new Error(`food-list.json not found at ${filePath}`);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Food[];
  } catch (error) {
    console.error('Error reading food-list.json:', error);
    throw error;
  }
}

// メモリキャッシュ
let cachedFoods: Food[] | null = null;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const mediumCategory = searchParams.get('mediumCategory');
    const count = parseInt(searchParams.get('count') || '3', 10);

    if (!categoryId || !mediumCategory) {
      return NextResponse.json(
        { error: 'Missing parameters', details: 'categoryId and mediumCategory are required' },
        { status: 400 }
      );
    }

    const categoryIdNum = parseInt(categoryId, 10);
    const tagKey = getTagKeyForCategory(categoryIdNum);

    if (!tagKey) {
      return NextResponse.json(
        { error: 'Invalid category', details: `Category ID ${categoryIdNum} is not valid` },
        { status: 400 }
      );
    }

    // キャッシュからデータを取得
    if (!cachedFoods) {
      try {
        cachedFoods = await getFoods();
      } catch (error) {
        console.error('Failed to load foods:', error);
        return NextResponse.json(
          { 
            error: 'Failed to load food data', 
            details: error instanceof Error ? error.message : 'Unknown error' 
          },
          { status: 500 }
        );
      }
    }

    // 短縮名を元のタグ値に変換
    const originalTagValue = getOriginalTagValue(categoryIdNum, mediumCategory);

    // フィルタリング
    const filteredFoods = cachedFoods.filter((food) => food.tags[tagKey] === originalTagValue);

    if (filteredFoods.length === 0) {
      return NextResponse.json(
        { 
          error: 'No foods found', 
          details: `No foods found for category ${categoryIdNum} with tag ${originalTagValue}` 
        },
        { status: 404 }
      );
    }

    // ランダムに選択
    const shuffled = [...filteredFoods].sort(() => Math.random() - 0.5);
    const selectedFoods = shuffled.slice(0, Math.min(count, shuffled.length));

    return NextResponse.json(selectedFoods);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
