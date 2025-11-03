'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PokemonDetails } from '@/types/pokemon';
import { formatPokemonId } from '@/lib/pokemon-api';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPokemonName, getLocalizedTypeName } from '@/utils/localization';

interface PokemonCardProps {
  pokemon: PokemonDetails;
  onClick: (pokemon: PokemonDetails) => void;
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

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');

  // 生成备用图片URL
  const getFallbackImageUrl = (pokemonId: number) => {
    // 尝试使用多个备用图片源
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

  const imageUrl = fallbackUrl || pokemon.sprites.other['official-artwork'].front_default;

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
      onClick={() => onClick(pokemon)}
    >
      <div className="relative">
        {/* ID */}
        <div className="text-sm text-gray-500 mb-2">
          {formatPokemonId(pokemon.id)}
        </div>

        {/* 图片 */}
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            {!imageError && imageUrl ? (
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                className="object-contain transition-all duration-300"
                onError={handleImageError}
                unoptimized={true}
                priority={pokemon.id <= 20} // 前20个宝可梦优先加载
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200">
                <div className="text-center">
                  <div className="text-gray-400 text-2xl font-bold mb-1">
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

        {/* 名字 */}
        <h3 className="text-xl font-bold text-center capitalize mb-3">
          {getLocalizedPokemonName(pokemon.name, language)}
        </h3>

        {/* 属性标签 */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`pokemon-type-badge ${typeColors[type.type.name] || 'bg-gray-500'}`}
            >
              {getLocalizedTypeName(type.type.name, language)}
            </span>
          ))}
        </div>

        {/* 基础信息 */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-gray-500">身高</div>
            <div className="font-semibold">{(pokemon.height / 10).toFixed(1)}m</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-gray-500">体重</div>
            <div className="font-semibold">{(pokemon.weight / 10).toFixed(1)}kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}