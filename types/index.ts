export interface Category {
  id: number;
  large_category: string;
  medium_categories: string[];
}

export interface Food {
  id: number;
  name: string;
  tags: {
    nationality?: string;
    style?: string;
    taste?: string;
    ingredient?: string;
    cooking?: string;
    condition?: string;
    situation?: string;
    budget?: string;
    season?: string;
  };
}

export type Step = 'category' | 'roulette' | 'result';

