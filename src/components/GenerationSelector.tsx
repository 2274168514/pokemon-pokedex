'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generations, type Generation } from '@/data/generations';

interface GenerationSelectorProps {
  selectedGeneration: number;
  onGenerationChange: (generationId: number) => void;
}

export default function GenerationSelector({ selectedGeneration, onGenerationChange }: GenerationSelectorProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentGeneration = generations.find(gen => gen.id === selectedGeneration);

  const handleSelect = (generationId: number) => {
    onGenerationChange(generationId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span className="font-medium text-gray-900">
          {currentGeneration ? currentGeneration.localName[language] : t('filter.allGenerations')}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
          <div className="max-h-80 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => handleSelect(0)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedGeneration === 0
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div className="font-medium">
                  {language === 'zh' ? '全部世代' : 'All Generations'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'zh' ? `全部宝可梦 (1025)` : `All Pokémon (1025)`}
                </div>
              </button>

              {generations.map((generation) => (
                <button
                  key={generation.id}
                  onClick={() => handleSelect(generation.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedGeneration === generation.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium">
                    {generation.localName[language]}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'zh'
                      ? `#${generation.startId} - #${generation.endId} (${generation.totalPokemon}只)`
                      : `#${generation.startId} - #${generation.endId} (${generation.totalPokemon} Pokémon)`
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}