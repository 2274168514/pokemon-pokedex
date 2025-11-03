'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import TypeEffectivenessChart from './TypeEffectivenessChart';

const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors: Record<string, { bg: string; hover: string }> = {
  normal: { bg: 'bg-[#A8A878]', hover: 'hover:bg-[#8B8B6B]' },
  fire: { bg: 'bg-[#F08030]', hover: 'hover:bg-[#DD6B1F]' },
  water: { bg: 'bg-[#6890F0]', hover: 'hover:bg-[#5A7ED8]' },
  electric: { bg: 'bg-[#F8D030]', hover: 'hover:bg-[#E6C02E]' },
  grass: { bg: 'bg-[#78C850]', hover: 'hover:bg-[#6B7845]' },
  ice: { bg: 'bg-[#98D8D8]', hover: 'hover:bg-[#86C6C6]' },
  fighting: { bg: 'bg-[#C03028]', hover: 'hover:bg-[#A0221C]' },
  poison: { bg: 'bg-[#A040A0]', hover: 'hover:bg-[#8B3A8B]' },
  ground: { bg: 'bg-[#E0C068]', hover: 'hover:bg-[#C9A45A]' },
  flying: { bg: 'bg-[#A890F0]', hover: 'hover:bg-[#917ED8]' },
  psychic: { bg: 'bg-[#F85888]', hover: 'hover:bg-[#E6467A]' },
  bug: { bg: 'bg-[#A8B820]', hover: 'hover:bg-[#95A11C]' },
  rock: { bg: 'bg-[#B8A038]', hover: 'hover:bg-[#A09032]' },
  ghost: { bg: 'bg-[#705898]', hover: 'hover:bg-[#634E87]' },
  dragon: { bg: 'bg-[#7038F8]', hover: 'hover:bg-[#6131E6]' },
  dark: { bg: 'bg-[#705848]', hover: 'hover:bg-[#614E3E]' },
  steel: { bg: 'bg-[#B8B8D0]', hover: 'hover:bg-[#A5A5BD]' },
  fairy: { bg: 'bg-[#EE99AC]', hover: 'hover:bg-[#E67F96]' },
};

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export default function TypeFilter({ selectedTypes, onTypeChange }: TypeFilterProps) {
  const { t } = useLanguage();
  const [showEffectivenessChart, setShowEffectivenessChart] = useState(false);

  const handleTypeClick = (type: string) => {
    if (selectedTypes.includes(type)) {
      // 如果已选择该类型，则取消选择
      onTypeChange([]);
    } else {
      // 选择新类型（单选）
      onTypeChange([type]);
    }
  };

  const handleClearAll = () => {
    onTypeChange([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{t('filter.title')}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEffectivenessChart(true)}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
          >
            🎯 {t('effectiveness.viewChart')}
          </button>
          {selectedTypes.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('filter.clearAll')}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const isSelected = selectedTypes.includes(type);
          const colors = typeColors[type] || typeColors.normal;

          return (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`
                px-4 py-2 rounded-full text-white font-medium transition-all duration-200
                ${isSelected
                  ? `${colors.bg} ring-4 ring-opacity-50 ring-offset-2 ${colors.bg.replace('bg-', 'ring-')}`
                  : `${colors.bg} opacity-60 hover:opacity-100 transform hover:scale-110`
                }
                ${colors.hover}
              `}
            >
              {t(`types.${type}`)}
            </button>
          );
        })}
      </div>

      {selectedTypes.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            {t('filter.selected', { count: 1 })}
            <span className="ml-2 font-medium">
              {t(`types.${selectedTypes[0]}`)}
            </span>
          </p>
        </div>
      )}

      <TypeEffectivenessChart
        isOpen={showEffectivenessChart}
        onClose={() => setShowEffectivenessChart(false)}
      />
    </div>
  );
}