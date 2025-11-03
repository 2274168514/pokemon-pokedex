import { pokemonNames, typeNames } from '@/data/pokemon-names';
import { abilityNames, moveNames } from '@/data/ability-data';
import { Language } from '@/contexts/LanguageContext';

export function getLocalizedPokemonName(name: string, language: Language): string {
  if (language === 'zh') {
    return pokemonNames[name] || name;
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
    return abilityNames[ability] || ability.replace('-', ' ');
  }
  return ability.replace('-', ' ');
}

export function getLocalizedMoveName(move: string, language: Language): string {
  if (language === 'zh') {
    return moveNames[move] || move.replace('-', ' ');
  }
  return move.replace('-', ' ');
}