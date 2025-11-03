'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译函数
const translations: Record<Language, Record<string, string>> = {
  zh: {
    // 应用标题和导航
    'app.title': '宝可梦图鉴',
    'app.subtitle': '探索宝可梦世界，发现你的伙伴',

    // 搜索
    'search.placeholder': '搜索宝可梦...',
    'search.clear': '清除',
    'search.button': '搜索',

    // 筛选
    'filter.title': '属性筛选',
    'filter.clearAll': '清除所有',
    'filter.selected': '已选择 {count} 个属性:',
    'filter.generation': '世代筛选',
    'filter.allGenerations': '全部世代',

    // 分页
    'pagination.previous': '上一页',
    'pagination.next': '下一页',

    // 状态信息
    'status.loading': '加载中...',
    'status.noResults': '没有找到宝可梦',
    'status.noResultsHint': '尝试调整搜索条件或清除筛选器',
    'status.found': '找到 {count} 个宝可梦',
    'status.searchQuery': '关于 "{query}"',
    'status.selectedTypes': '属性: {types}',

    // 宝可梦信息
    'pokemon.height': '身高',
    'pokemon.weight': '体重',
    'pokemon.color': '颜色',
    'pokemon.habitat': '栖息地',
    'pokemon.id': '编号',
    'pokemon.name': '名称',
    'pokemon.abilities': '特性',
    'pokemon.stats': '能力值',
    'pokemon.description': '描述',
    'pokemon.hiddenAbility': '隐藏特性',

    // 能力值名称
    'stats.hp': 'HP',
    'stats.attack': '攻击',
    'stats.defense': '防御',
    'stats.specialAttack': '特攻',
    'stats.specialDefense': '特防',
    'stats.speed': '速度',

    // 属性名称
    'types.normal': '一般',
    'types.fire': '火',
    'types.water': '水',
    'types.electric': '电',
    'types.grass': '草',
    'types.ice': '冰',
    'types.fighting': '格斗',
    'types.poison': '毒',
    'types.ground': '地面',
    'types.flying': '飞行',
    'types.psychic': '超能力',
    'types.bug': '虫',
    'types.rock': '岩石',
    'types.ghost': '幽灵',
    'types.dragon': '龙',
    'types.dark': '恶',
    'types.steel': '钢',
    'types.fairy': '妖精',

    // 语言选择
    'language.switch': '语言',
    'language.zh': '中文',
    'language.en': 'English',

    // 详情页面
    'detail.height': '身高',
    'detail.weight': '体重',
    'detail.color': '颜色',
    'detail.habitat': '栖息地',
    'detail.unknown': '未知',
    'detail.stats': '能力值',
    'detail.abilities': '特性',
    'detail.description': '描述',
    'detail.hiddenAbility': '隐藏特性',
    'detail.moves': '技能',

    // 标签页
    'tabs.stats': '能力值',
    'tabs.abilities': '特性',
    'tabs.moves': '技能',

    // 通用
    'common.close': '关闭',
    'common.loading': '加载中...',
    'common.error': '错误',
  },
  en: {
    // App title and navigation
    'app.title': 'Pokémon Pokédex',
    'app.subtitle': 'Explore the Pokémon world, discover your partners',

    // Search
    'search.placeholder': 'Search Pokémon...',
    'search.clear': 'Clear',
    'search.button': 'Search',

    // Filter
    'filter.title': 'Type Filter',
    'filter.clearAll': 'Clear All',
    'filter.selected': 'Selected {count} types:',
    'filter.generation': 'Generation Filter',
    'filter.allGenerations': 'All Generations',

    // Pagination
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',

    // Status messages
    'status.loading': 'Loading...',
    'status.noResults': 'No Pokémon found',
    'status.noResultsHint': 'Try adjusting search criteria or clear filters',
    'status.found': 'Found {count} Pokémon',
    'status.searchQuery': 'for "{query}"',
    'status.selectedTypes': 'Types: {types}',

    // Pokémon info
    'pokemon.height': 'Height',
    'pokemon.weight': 'Weight',
    'pokemon.color': 'Color',
    'pokemon.habitat': 'Habitat',
    'pokemon.id': 'ID',
    'pokemon.name': 'Name',
    'pokemon.abilities': 'Abilities',
    'pokemon.stats': 'Stats',
    'pokemon.description': 'Description',
    'pokemon.hiddenAbility': 'Hidden Ability',

    // Stat names
    'stats.hp': 'HP',
    'stats.attack': 'Attack',
    'stats.defense': 'Defense',
    'stats.specialAttack': 'Special Attack',
    'stats.specialDefense': 'Special Defense',
    'stats.speed': 'Speed',

    // Type names
    'types.normal': 'Normal',
    'types.fire': 'Fire',
    'types.water': 'Water',
    'types.electric': 'Electric',
    'types.grass': 'Grass',
    'types.ice': 'Ice',
    'types.fighting': 'Fighting',
    'types.poison': 'Poison',
    'types.ground': 'Ground',
    'types.flying': 'Flying',
    'types.psychic': 'Psychic',
    'types.bug': 'Bug',
    'types.rock': 'Rock',
    'types.ghost': 'Ghost',
    'types.dragon': 'Dragon',
    'types.dark': 'Dark',
    'types.steel': 'Steel',
    'types.fairy': 'Fairy',

    // Language selection
    'language.switch': 'Language',
    'language.zh': '中文',
    'language.en': 'English',

    // Detail page
    'detail.height': 'Height',
    'detail.weight': 'Weight',
    'detail.color': 'Color',
    'detail.habitat': 'Habitat',
    'detail.unknown': 'Unknown',
    'detail.stats': 'Stats',
    'detail.abilities': 'Abilities',
    'detail.description': 'Description',
    'detail.hiddenAbility': 'Hidden Ability',
    'detail.moves': 'Moves',

    // Tabs
    'tabs.stats': 'Stats',
    'tabs.abilities': 'Abilities',
    'tabs.moves': 'Moves',

    // Common
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    const translation = translations[language][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    return translation;
  };

  // 支持模板字符串插值
  const tWithParams = (key: string, params?: Record<string, string | number>): string => {
    let translation = t(key);

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`{${param}}`, 'g'), String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: tWithParams }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}