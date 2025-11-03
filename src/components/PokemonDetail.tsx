'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PokemonDetails, PokemonSpecies } from '@/types/pokemon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPokemonName, getLocalizedTypeName, getLocalizedAbilityName, getLocalizedMoveName } from '@/utils/localization';
import {
  pokemonAPI,
  getPokemonChineseName,
  getPokemonChineseDescription,
  getPokemonCategory,
  formatPokemonId,
  formatWeight,
  formatHeight
} from '@/lib/pokemon-api';

interface PokemonDetailProps {
  pokemon: PokemonDetails;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  normal: 'bg-[#A8A878]',
  fire: 'bg-[#F08030]',
  water: 'bg-[#6890F0]',
  electric: 'bg-[#F8D030]',
  grass: 'bg-[#78C850]',
  ice: 'bg-[#98D8D8]',
  fighting: 'bg-[#C03028]',
  poison: 'bg-[#A040A0]',
  ground: 'bg-[#E0C068]',
  flying: 'bg-[#A890F0]',
  psychic: 'bg-[#F85888]',
  bug: 'bg-[#A8B820]',
  rock: 'bg-[#B8A038]',
  ghost: 'bg-[#705898]',
  dragon: 'bg-[#7038F8]',
  dark: 'bg-[#705848]',
  steel: 'bg-[#B8B8D0]',
  fairy: 'bg-[#EE99AC]',
};

const getStatNames = (language: string): Record<string, string> => {
  if (language === 'zh') {
    return {
      'hp': 'HP',
      'attack': '攻击',
      'defense': '防御',
      'special-attack': '特攻',
      'special-defense': '特防',
      'speed': '速度',
    };
  } else {
    return {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      'speed': 'Speed',
    };
  }
};

export default function PokemonDetail({ pokemon, onClose }: PokemonDetailProps) {
  const { language, t } = useLanguage();
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [abilities, setAbilities] = useState<any[]>([]);
  const [moves, setMoves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'abilities' | 'moves'>('stats');
  const [showAllMoves, setShowAllMoves] = useState(false);

  useEffect(() => {
    async function loadPokemonDetails() {
      try {
        setLoading(true);

        // 加载种类信息
        const speciesData = await pokemonAPI.getPokemonSpecies(pokemon.name);
        setSpecies(speciesData);

        // 加载特性详细信息
        const abilityDetails = await Promise.all(
          pokemon.abilities.map(async (ability) => {
            try {
              const abilityData = await pokemonAPI.getAbility(ability.ability.name);
              return {
                ...ability,
                details: abilityData
              };
            } catch (error) {
              console.error(`加载特性 ${ability.ability.name} 失败:`, error);
              return ability;
            }
          })
        );
        setAbilities(abilityDetails);

        // 加载所有技能详细信息
        const moveDetails = await Promise.all(
          pokemon.moves.map(async (move) => {
            try {
              const moveData = await pokemonAPI.getMove(move.move.name);
              return {
                ...move,
                details: moveData
              };
            } catch (error) {
              console.error(`加载技能 ${move.move.name} 失败:`, error);
              return move;
            }
          })
        );
        setMoves(moveDetails);

      } catch (error) {
        console.error('加载宝可梦详细信息失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPokemonDetails();
  }, [pokemon.name]);

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const backgroundColor = typeColors[primaryType] || typeColors.normal;

  // 生成备用图片URL
  const getFallbackImageUrl = (pokemonId: number) => {
    const fallbacks = [
      `https://img.pokemondb.net/artwork/${pokemon.name}.jpg`,
      `https://img.pokemondb.net/artwork/${pokemon.name}.png`,
      pokemon.sprites.front_default,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    ];
    return fallbacks.find(url => url && url !== pokemon.sprites.other['official-artwork'].front_default);
  };

  const handleImageError = () => {
    if (!imageError && !fallbackUrl) {
      const fallback = getFallbackImageUrl(pokemon.id);
      if (fallback) {
        setFallbackUrl(fallback);
      } else {
        setImageError(true);
      }
    } else {
      setImageError(true);
    }
  };

  const getStatColor = (statName: string): string => {
    const statValue = pokemon.stats.find(stat => stat.stat.name === statName)?.base_stat || 0;
    if (statValue >= 120) return 'bg-red-500';
    if (statValue >= 90) return 'bg-orange-500';
    if (statValue >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // 获取技能学习方式
  const getMoveLearnMethod = (move: any): string => {
    const versionGroup = move.version_group_details?.[0];

    if (versionGroup) {
      if (versionGroup.level_learned_at !== undefined) {
        return language === 'zh' ? `等级 ${versionGroup.level_learned_at}` : `Level ${versionGroup.level_learned_at}`;
      }
      if (versionGroup.move_learn_method?.name === 'egg') {
        return language === 'zh' ? '蛋' : 'Egg';
      }
      if (versionGroup.move_learn_method?.name === 'tutor') {
        return language === 'zh' ? '教学' : 'Tutor';
      }
      if (versionGroup.move_learn_method?.name === 'machine') {
        return language === 'zh' ? '招式学习器' : 'TM';
      }
    }

    return language === 'zh' ? '未知' : 'Unknown';
  };

  // 获取技能学习方式的标签颜色
  const getLearnMethodColor = (method: string): string => {
    if (method.includes('等级')) return 'bg-blue-100 text-blue-800';
    if (method.includes('蛋')) return 'bg-pink-100 text-pink-800';
    if (method.includes('教学')) return 'bg-purple-100 text-purple-800';
    if (method.includes('TM')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const imageUrl = fallbackUrl || pokemon.sprites.other['official-artwork'].front_default;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>{t('status.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部背景 */}
        <div className="relative h-48 bg-gray-100 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ID */}
          <div className="absolute top-4 left-4 text-gray-600 text-xl font-bold">
            {formatPokemonId(pokemon.id)}
          </div>

          {/* 图片 */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative w-40 h-40">
              {!imageError && imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={pokemon.name}
                  fill
                  className="object-contain"
                  onError={handleImageError}
                  unoptimized={true}
                  priority={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white rounded-full border-2 border-gray-200">
                  <div className="text-center">
                    <div className="text-gray-400 text-3xl font-bold mb-1">
                      {pokemon.id}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {pokemon.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="pt-24 pb-8 px-8">
          {/* 名称和分类 */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold capitalize mb-2">
              {getLocalizedPokemonName(pokemon.name, language)}
            </h1>
            {species && (
              <p className="text-gray-600">
                {language === 'zh' ? getPokemonCategory(species) : species.genera.find(g => g.language.name === 'en')?.genus || 'Unknown'}
              </p>
            )}
          </div>

          {/* 属性标签 */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`pokemon-type-badge ${typeColors[type.type.name] || 'bg-gray-500'} text-lg px-4 py-2`}
              >
                {getLocalizedTypeName(type.type.name, language)}
              </span>
            ))}
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-1">{t('detail.height')}</div>
              <div className="text-xl font-bold">{formatHeight(pokemon.height)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-1">{t('detail.weight')}</div>
              <div className="text-xl font-bold">{formatWeight(pokemon.weight)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-1">{t('detail.color')}</div>
              <div className="text-xl font-bold capitalize">
                {species?.color.name || t('detail.unknown')}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-1">{t('detail.habitat')}</div>
              <div className="text-xl font-bold capitalize">
                {species?.habitat?.name || t('detail.unknown')}
              </div>
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="mb-8">
            <div className="flex space-x-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'stats'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {t('tabs.stats')}
              </button>
              <button
                onClick={() => setActiveTab('abilities')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'abilities'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {t('tabs.abilities')}
              </button>
              <button
                onClick={() => setActiveTab('moves')}
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'moves'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {t('tabs.moves')}
              </button>
            </div>
          </div>

          {/* 标签页内容 */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              {/* 能力值 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('detail.stats')}</h2>
                <div className="space-y-3">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center gap-4">
                      <div className="w-20 text-right font-medium">
                        {getStatNames(language)[stat.stat.name] || stat.stat.name}
                      </div>
                      <div className="w-16 text-center font-bold">
                        {stat.base_stat}
                      </div>
                      <div className="flex-1">
                        <div className="pokemon-stat-bar">
                          <div
                            className={`pokemon-stat-fill ${getStatColor(stat.stat.name)}`}
                            style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 描述 */}
              {species && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t('detail.description')}</h2>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-6 border border-gray-200">
                    {language === 'zh' ? getPokemonChineseDescription(species) :
                      species.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'No description available'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'abilities' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('detail.abilities')}</h2>
              <div className="space-y-4">
                {abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className={`border rounded-lg p-4 ${
                      ability.is_hidden
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold capitalize">
                        {getLocalizedAbilityName(ability.ability.name, language)}
                      </h3>
                      {ability.is_hidden && (
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                          {t('detail.hiddenAbility')}
                        </span>
                      )}
                    </div>
                    {ability.details && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {language === 'zh'
                          ? ability.details.flavor_text_entries?.find((entry: any) => entry.language.name === 'zh-Hans')?.flavor_text ||
                            ability.details.flavor_text_entries?.find((entry: any) => entry.language.name === 'en')?.flavor_text ||
                            ability.details.effect_entries?.[0]?.effect ||
                            '暂无描述'
                          : ability.details.flavor_text_entries?.find((entry: any) => entry.language.name === 'en')?.flavor_text ||
                            ability.details.effect_entries?.[0]?.effect ||
                            'No description available'
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t('detail.moves')}</h2>
                <button
                  onClick={() => setShowAllMoves(!showAllMoves)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  {showAllMoves
                    ? (language === 'zh' ? '显示部分技能' : 'Show Less')
                    : (language === 'zh' ? `显示全部技能 (${moves.length})` : `Show All Moves (${moves.length})`)
                  }
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{language === 'zh' ? '习得方式：' : 'Learning Methods:'}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${getLearnMethodColor(language === 'zh' ? '等级' : 'Level')}`}>
                      {language === 'zh' ? '等级' : 'Level'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getLearnMethodColor(language === 'zh' ? '招式学习器' : 'TM')}`}>
                      TM
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getLearnMethodColor(language === 'zh' ? '蛋' : 'Egg')}`}>
                      {language === 'zh' ? '蛋' : 'Egg'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getLearnMethodColor(language === 'zh' ? '教学' : 'Tutor')}`}>
                      {language === 'zh' ? '教学' : 'Tutor'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {(showAllMoves ? moves : moves.slice(0, 20)).map((move) => (
                  <div
                    key={move.move.name}
                    className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">
                        {getLocalizedMoveName(move.move.name, language)}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${getLearnMethodColor(getMoveLearnMethod(move))}`}>
                          {getMoveLearnMethod(move)}
                        </span>
                        {move.details?.type?.name && (
                          <span className={`px-2 py-1 rounded text-white text-xs ${typeColors[move.details.type.name] || 'bg-gray-500'}`}>
                            {getLocalizedTypeName(move.details.type.name, language)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      {move.details?.power && (
                        <span>{language === 'zh' ? '威力' : 'Power'}: {move.details.power}</span>
                      )}
                      {move.details?.accuracy && (
                        <span>{language === 'zh' ? '命中' : 'Accuracy'}: {move.details.accuracy}%</span>
                      )}
                      {move.details?.pp && (
                        <span>PP: {move.details.pp}</span>
                      )}
                      {move.details?.damage_class?.name && (
                        <span className="capitalize">
                          {move.details.damage_class.name === 'physical' ? (language === 'zh' ? '物理' : 'Physical') :
                           move.details.damage_class.name === 'special' ? (language === 'zh' ? '特殊' : 'Special') :
                           move.details.damage_class.name === 'status' ? (language === 'zh' ? '变化' : 'Status') :
                           move.details.damage_class.name}
                        </span>
                      )}
                    </div>

                    {move.details && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {language === 'zh'
                          ? move.details.flavor_text_entries?.find((entry: any) => entry.language.name === 'zh-Hans')?.flavor_text ||
                            move.details.flavor_text_entries?.find((entry: any) => entry.language.name === 'en')?.flavor_text ||
                            move.details.effect_entries?.[0]?.short_effect ||
                            '暂无描述'
                          : move.details.flavor_text_entries?.find((entry: any) => entry.language.name === 'en')?.flavor_text ||
                            move.details.effect_entries?.[0]?.short_effect ||
                            'No description available'
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {!showAllMoves && moves.length > 20 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    {language === 'zh'
                      ? `显示前20个技能，共${moves.length}个可学会的技能`
                      : `Showing first 20 of ${moves.length} learnable moves`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}