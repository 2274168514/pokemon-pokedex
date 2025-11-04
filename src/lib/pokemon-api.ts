import Pokedex from 'pokedex-promise-v2';
import { PokemonDetails, PokemonListResponse, PokemonSpecies } from '@/types/pokemon';

const P = new Pokedex({
  cacheLimit: 100 * 1000, // 100秒缓存
  timeout: 30 * 1000, // 30秒超时
});

export const pokemonAPI = {
  // 获取宝可梦列表
  async getPokemonList(limit: number = 151, offset: number = 0): Promise<PokemonListResponse> {
    try {
      const response = await P.getPokemonsList({ limit, offset });
      return response;
    } catch (error) {
      console.error('获取宝可梦列表失败:', error);
      throw new Error('无法获取宝可梦列表');
    }
  },

  // 获取单个宝可梦详细信息
  async getPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
    try {
      const pokemon = await P.getPokemonByName(nameOrId);
      return pokemon;
    } catch (error) {
      console.error(`获取宝可梦 ${nameOrId} 详细信息失败:`, error);
      throw new Error(`无法获取宝可梦 ${nameOrId} 的详细信息`);
    }
  },

  // 批量获取宝可梦详细信息（分批处理避免超时）
  async getMultiplePokemonDetails(namesOrIds: (string | number)[]): Promise<PokemonDetails[]> {
    try {
      const results: PokemonDetails[] = [];
      const batchSize = 20; // 每批处理20个

      for (let i = 0; i < namesOrIds.length; i += batchSize) {
        const batch = namesOrIds.slice(i, i + batchSize);
        const promises = batch.map(nameOrId =>
          P.getPokemonByName(nameOrId).catch(error => {
            console.warn(`获取宝可梦 ${nameOrId} 失败，跳过:`, error.message);
            return null;
          })
        );

        const batchResults = await Promise.all(promises);
        results.push(...batchResults.filter(Boolean) as PokemonDetails[]);

        // 添加小延迟避免API限制
        if (i + batchSize < namesOrIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`成功获取 ${results.length}/${namesOrIds.length} 只宝可梦信息`);
      return results;
    } catch (error) {
      console.error('批量获取宝可梦详细信息失败:', error);
      throw new Error('无法批量获取宝可梦详细信息');
    }
  },

  // 获取宝可梦种类信息
  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    try {
      const species = await P.getPokemonSpeciesByName(nameOrId);
      return species;
    } catch (error) {
      console.error(`获取宝可梦种类 ${nameOrId} 信息失败:`, error);
      throw new Error(`无法获取宝可梦种类 ${nameOrId} 的信息`);
    }
  },

  // 获取进化链
  async getEvolutionChain(chainId: number) {
    try {
      const evolutionChain = await P.getEvolutionChainById(chainId);
      return evolutionChain;
    } catch (error) {
      console.error(`获取进化链 ${chainId} 失败:`, error);
      throw new Error(`无法获取进化链 ${chainId}`);
    }
  },

  // 获取属性信息
  async getTypeInfo(typeName: string) {
    try {
      const type = await P.getTypeByName(typeName);
      return type;
    } catch (error) {
      console.error(`获取属性 ${typeName} 信息失败:`, error);
      throw new Error(`无法获取属性 ${typeName} 的信息`);
    }
  },

  // 获取特性信息
  async getAbility(abilityName: string) {
    try {
      const ability = await P.getAbilityByName(abilityName);
      return ability;
    } catch (error) {
      console.error(`获取特性 ${abilityName} 信息失败:`, error);
      throw new Error(`无法获取特性 ${abilityName} 的信息`);
    }
  },

  // 获取技能信息
  async getMove(moveName: string) {
    try {
      const move = await P.getMoveByName(moveName);
      return move;
    } catch (error) {
      console.error(`获取技能 ${moveName} 信息失败:`, error);
      throw new Error(`无法获取技能 ${moveName} 的信息`);
    }
  },

  // 获取宝可梦技能学习方式
  async getPokemonMoves(nameOrId: string | number) {
    try {
      const moves = await P.getPokemonByName(nameOrId).then(pokemon => pokemon.moves);
      return moves;
    } catch (error) {
      console.error(`获取宝可梦 ${nameOrId} 技能学习方式失败:`, error);
      throw new Error(`无法获取宝可梦 ${nameOrId} 的技能学习方式`);
    }
  },

  };

// 辅助函数：获取宝可梦的中文名称
export function getPokemonChineseName(species: PokemonSpecies): string {
  const chineseName = species.names.find(name => name.language.name === 'zh-Hans')?.name;
  return chineseName || species.name;
}

// 辅助函数：获取宝可梦的中文描述
export function getPokemonChineseDescription(species: PokemonSpecies): string {
  const chineseDescription = species.flavor_text_entries
    .filter(entry => entry.language.name === 'zh-Hans')
    .map(entry => entry.flavor_text.replace(/[\n\f]/g, ' '))[0];

  return chineseDescription || '暂无描述';
}

// 辅助函数：获取宝可梦的分类
export function getPokemonCategory(species: PokemonSpecies): string {
  const chineseCategory = species.genera.find(genus => genus.language.name === 'zh-Hans')?.genus;
  return chineseCategory || '未知分类';
}

// 辅助函数：格式化宝可梦ID（例如：1 -> #001）
export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

// 辅助函数：格式化体重
export function formatWeight(weight: number): string {
  return `${(weight / 10).toFixed(1)} kg`;
}

// 辅助函数：格式化身高
export function formatHeight(height: number): string {
  return `${(height / 10).toFixed(1)} m`;
}