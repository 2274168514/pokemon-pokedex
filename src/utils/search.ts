import { PokemonDetails } from '@/types/pokemon';
import { Language } from '@/contexts/LanguageContext';

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

    // 简单的搜索匹配，可以根据需要扩展
    return false;
  });
}