import { PokemonDetails } from '@/types/pokemon';
import { Language } from '@/contexts/LanguageContext';
import { getLocalizedPokemonName, getLocalizedTypeName, getLocalizedAbilityName } from './localization';

export function searchPokemon(
  pokemonList: PokemonDetails[],
  query: string,
  language: Language
): PokemonDetails[] {
  // 如果查询为空或只包含空格，返回所有宝可梦
  if (!query || query.trim() === '') {
    return pokemonList;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return pokemonList.filter(pokemon => {
    // 搜索英文ID
    if (pokemon.id.toString().includes(normalizedQuery)) {
      return true;
    }

    // 搜索英文名称
    if (pokemon.name.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 搜索本地化名称（中文名）
    const localizedName = getLocalizedPokemonName(pokemon.name, language);
    if (localizedName.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // 搜索类型（如果查询是一个类型名称）
    if (pokemon.types.some(type =>
      type.type.name.toLowerCase().includes(normalizedQuery) ||
      getLocalizedTypeName(type.type.name, language).toLowerCase().includes(normalizedQuery)
    )) {
      return true;
    }

    // 搜索特性
    if (pokemon.abilities.some(ability =>
      ability.ability.name.toLowerCase().includes(normalizedQuery) ||
      getLocalizedAbilityName(ability.ability.name, language).toLowerCase().includes(normalizedQuery)
    )) {
      return true;
    }

    return false;
  });
}