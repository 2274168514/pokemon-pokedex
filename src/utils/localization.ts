import { Language } from '@/contexts/LanguageContext';

// 类型中文名称映射
const typeNames: Record<string, string> = {
  normal: '一般',
  fire: '火',
  water: '水',
  electric: '电',
  grass: '草',
  ice: '冰',
  fighting: '格斗',
  poison: '毒',
  ground: '地面',
  flying: '飞行',
  psychic: '超能力',
  bug: '虫',
  rock: '岩石',
  ghost: '幽灵',
  dragon: '龙',
  dark: '恶',
  steel: '钢',
  fairy: '妖精',
};

export function getLocalizedPokemonName(name: string, language: Language): string {
  // 简单的名称格式化，可以根据需要扩展
  if (language === 'zh') {
    return name.split('-').map(part =>
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  }
  return name;
}

export function getLocalizedTypeName(type: string, language: Language): string {
  if (language === 'zh') {
    return typeNames[type] || type;
  }
  return type;
}

export function getLocalizedAbilityName(ability: string, language: Language): string {
  if (language === 'zh') {
    return ability.replace('-', ' ');
  }
  return ability.replace('-', ' ');
}

export function getLocalizedMoveName(move: string, language: Language): string {
  if (language === 'zh') {
    return move.replace('-', ' ');
  }
  return move.replace('-', ' ');
}