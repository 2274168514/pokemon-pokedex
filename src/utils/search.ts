import { PokemonDetails } from '@/types/pokemon';
import { pokemonNames } from '@/data/pokemon-names';
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

    // 如果是中文模式，搜索中文名称
    if (language === 'zh') {
      const chineseName = pokemonNames[pokemon.name];
      if (chineseName && chineseName.includes(normalizedQuery)) {
        return true;
      }
    }

    return false;
  });
}