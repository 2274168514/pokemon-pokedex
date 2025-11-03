'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedTypeName } from '@/utils/localization';
import { getAttackMatchups, getCombinedEffectiveness } from '@/data/type-effectiveness';

const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors: Record<string, { bg: string; text: string }> = {
  normal: { bg: 'bg-[#A8A878]', text: 'text-white' },
  fire: { bg: 'bg-[#F08030]', text: 'text-white' },
  water: { bg: 'bg-[#6890F0]', text: 'text-white' },
  electric: { bg: 'bg-[#F8D030]', text: 'text-gray-800' },
  grass: { bg: 'bg-[#78C850]', text: 'text-white' },
  ice: { bg: 'bg-[#98D8D8]', text: 'text-gray-800' },
  fighting: { bg: 'bg-[#C03028]', text: 'text-white' },
  poison: { bg: 'bg-[#A040A0]', text: 'text-white' },
  ground: { bg: 'bg-[#E0C068]', text: 'text-gray-800' },
  flying: { bg: 'bg-[#A890F0]', text: 'text-white' },
  psychic: { bg: 'bg-[#F85888]', text: 'text-white' },
  bug: { bg: 'bg-[#A8B820]', text: 'text-white' },
  rock: { bg: 'bg-[#B8A038]', text: 'text-white' },
  ghost: { bg: 'bg-[#705898]', text: 'text-white' },
  dragon: { bg: 'bg-[#7038F8]', text: 'text-white' },
  dark: { bg: 'bg-[#705848]', text: 'text-white' },
  steel: { bg: 'bg-[#B8B8D0]', text: 'text-gray-800' },
  fairy: { bg: 'bg-[#EE99AC]', text: 'text-white' },
};

const effectivenessColors: Record<string, string> = {
  '2': 'bg-green-500 text-white',
  '1': 'bg-gray-200 text-gray-800',
  '0.5': 'bg-orange-400 text-white',
  '0': 'bg-red-500 text-white',
};

interface TypeEffectivenessChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TypeEffectivenessChart({ isOpen, onClose }: TypeEffectivenessChartProps) {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('fire');
  const [selectedDefendingTypes, setSelectedDefendingTypes] = useState<string[]>([]);

  if (!isOpen) return null;

  const matchups = getAttackMatchups(selectedType);
  const combinedEffectiveness = selectedDefendingTypes.length > 0
    ? getCombinedEffectiveness(selectedType, selectedDefendingTypes)
    : 1;

  const handleDefendingTypeClick = (type: string) => {
    if (selectedDefendingTypes.includes(type)) {
      setSelectedDefendingTypes(selectedDefendingTypes.filter(t => t !== type));
    } else if (selectedDefendingTypes.length < 2) {
      setSelectedDefendingTypes([...selectedDefendingTypes, type]);
    }
  };

  const clearDefendingTypes = () => {
    setSelectedDefendingTypes([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {t('effectiveness.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 攻击方属性选择 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {t('effectiveness.selectAttackingType')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => {
                const colors = typeColors[type] || typeColors.normal;
                const isSelected = selectedType === type;

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`
                      px-4 py-2 rounded-full font-medium transition-all duration-200
                      ${isSelected
                        ? `${colors.bg} ${colors.text} ring-4 ring-opacity-50 ring-offset-2 ${colors.bg.replace('bg-', 'ring-')}`
                        : `${colors.bg} ${colors.text} opacity-60 hover:opacity-100 transform hover:scale-110`
                      }
                    `}
                  >
                    {getLocalizedTypeName(type, language)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 防御方属性选择 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t('effectiveness.selectDefendingTypes')}
              </h3>
              {selectedDefendingTypes.length > 0 && (
                <button
                  onClick={clearDefendingTypes}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t('filter.clearAll')}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => {
                const colors = typeColors[type] || typeColors.normal;
                const isSelected = selectedDefendingTypes.includes(type);

                return (
                  <button
                    key={type}
                    onClick={() => handleDefendingTypeClick(type)}
                    className={`
                      px-4 py-2 rounded-full font-medium transition-all duration-200
                      ${isSelected
                        ? `${colors.bg} ${colors.text} ring-4 ring-opacity-50 ring-offset-2 ${colors.bg.replace('bg-', 'ring-')}`
                        : `${colors.bg} ${colors.text} opacity-60 hover:opacity-100 transform hover:scale-110`
                      }
                    `}
                  >
                    {getLocalizedTypeName(type, language)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 综合效果显示 */}
          {selectedDefendingTypes.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                {t('effectiveness.combinedEffectiveness')}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {getLocalizedTypeName(selectedType, language)} →{' '}
                  {selectedDefendingTypes.map(t => getLocalizedTypeName(t, language)).join(' + ')}
                </span>
                <span className={`px-3 py-1 rounded-full font-bold ${effectivenessColors[combinedEffectiveness.toString()]}`}>
                  {combinedEffectiveness}×
                </span>
              </div>
            </div>
          )}

          {/* 克制关系表格 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {t('effectiveness.attackMatchups')}
            </h3>

            {/* 超有效 */}
            {matchups.strong.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2 text-green-600">
                  {t('effectiveness.superEffective')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchups.strong.map((type) => {
                    const colors = typeColors[type] || typeColors.normal;
                    return (
                      <span
                        key={type}
                        className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-medium`}
                      >
                        {getLocalizedTypeName(type, language)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 效果一般 */}
            {matchups.normal.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2 text-gray-600">
                  {t('effectiveness.normalEffective')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchups.normal.map((type) => {
                    const colors = typeColors[type] || typeColors.normal;
                    return (
                      <span
                        key={type}
                        className={`px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-sm font-medium`}
                      >
                        {getLocalizedTypeName(type, language)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 效果不好 */}
            {matchups.weak.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2 text-orange-600">
                  {t('effectiveness.notVeryEffective')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchups.weak.map((type) => {
                    const colors = typeColors[type] || typeColors.normal;
                    return (
                      <span
                        key={type}
                        className={`px-3 py-1 rounded-full bg-orange-400 text-white text-sm font-medium`}
                      >
                        {getLocalizedTypeName(type, language)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 无效果 */}
            {matchups.ineffective.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2 text-red-600">
                  {t('effectiveness.noEffect')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchups.ineffective.map((type) => {
                    const colors = typeColors[type] || typeColors.normal;
                    return (
                      <span
                        key={type}
                        className={`px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium`}
                      >
                        {getLocalizedTypeName(type, language)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}