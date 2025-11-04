'use client';

import { useState, useEffect } from 'react';
import { PokemonDetails } from '@/types/pokemon';
import { pokemonAPI } from '@/lib/pokemon-api';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchPokemon } from '@/utils/search';
import { generations } from '@/data/generations';
import PokemonCard from '@/components/PokemonCard';
import PokemonDetail from '@/components/PokemonDetail';
import SearchBar from '@/components/SearchBar';
import TypeFilter from '@/components/TypeFilter';
import LanguageSelector from '@/components/LanguageSelector';
import GenerationSelector from '@/components/GenerationSelector';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<PokemonDetails[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number>(0); // 0表示全部世代
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const POKEMON_PER_PAGE = 20;

  useEffect(() => {
    loadPokemonList();
  }, [selectedGeneration]);

  useEffect(() => {
    filterPokemon();
  }, [pokemonList, searchQuery, selectedTypes, selectedGeneration, currentPage, language]);

  const loadPokemonList = async () => {
    try {
      setLoading(true);
      setError(null);

      let limit, offset;

      if (selectedGeneration === 0) {
        // 加载所有世代的宝可梦
        limit = 1025; // 目前总共1025只宝可梦
        offset = 0;
      } else {
        // 加载指定世代的宝可梦
        const generation = generations.find(gen => gen.id === selectedGeneration);
        if (generation) {
          limit = generation.totalPokemon;
          offset = generation.startId - 1;
        } else {
          throw new Error('Invalid generation');
        }
      }

      const response = await pokemonAPI.getPokemonList(limit, offset);
      const pokemonDetails = await pokemonAPI.getMultiplePokemonDetails(
        response.results.map(p => p.name)
      );

      // 按ID排序
      pokemonDetails.sort((a, b) => a.id - b.id);

      setPokemonList(pokemonDetails);
      setTotalPages(Math.ceil(pokemonDetails.length / POKEMON_PER_PAGE));
    } catch (err) {
      setError(t('common.error'));
      console.error('加载失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPokemon = () => {
    let filtered = [...pokemonList];

    // 使用新的搜索函数支持中文搜索
    if (searchQuery && searchQuery.trim() !== '') {
      filtered = searchPokemon(filtered, searchQuery, language);
    }

    // 按属性筛选（单选）
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(pokemonType => pokemonType.type.name === selectedTypes[0])
      );
    }

    // 更新总页数
    const newTotalPages = Math.ceil(filtered.length / POKEMON_PER_PAGE);
    setTotalPages(newTotalPages);

    // 确保当前页在有效范围内
    const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, newTotalPages));
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
      return; // 等待下一次 useEffect 触发
    }

    // 分页
    const startIndex = (validCurrentPage - 1) * POKEMON_PER_PAGE;
    const endIndex = startIndex + POKEMON_PER_PAGE;
    filtered = filtered.slice(startIndex, endIndex);

    setFilteredPokemonList(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 重置到第一页
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    setCurrentPage(1); // 重置到第一页
  };

  const handleGenerationChange = (generationId: number) => {
    setSelectedGeneration(generationId);
    setCurrentPage(1); // 重置到第一页
  };

  const handlePokemonClick = (pokemon: PokemonDetails) => {
    setSelectedPokemon(pokemon);
  };

  const handleModalClose = () => {
    setSelectedPokemon(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* 头部 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                {t('app.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-200">
                {t('app.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索栏和世代选择器 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {/* 搜索栏 */}
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* 世代选择器 */}
            <div className="md:w-64">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('filter.generation')}</h3>
              </div>
              <GenerationSelector
                selectedGeneration={selectedGeneration}
                onGenerationChange={handleGenerationChange}
              />
            </div>
          </div>
        </div>

        {/* 属性筛选器 */}
        <div className="mb-8">
          <TypeFilter
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
          />
        </div>

        {/* 状态信息 */}
        {(loading || error || searchQuery || selectedTypes.length > 0 || selectedGeneration !== 0) && (
          <div className="mb-6">
            {loading && (
              <div className="text-center text-gray-600 dark:text-gray-300">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                  {t('status.loading')}
                </div>
              </div>
            )}

            {error && (
              <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                {error}
              </div>
            )}

            {!loading && !error && (searchQuery || selectedTypes.length > 0 || selectedGeneration !== 0) && (
              <div className="text-center text-gray-600 dark:text-gray-300">
                {t('status.found', { count: filteredPokemonList.length })}
                {searchQuery && (
                  <span>
                    {' '}{t('status.searchQuery', { query: searchQuery })}
                  </span>
                )}
                {selectedTypes.length > 0 && (
                  <span>
                    {' '}{t('status.selectedTypes', { types: t(`types.${selectedTypes[0]}`) })}
                  </span>
                )}
                {selectedGeneration !== 0 && (
                  <span>
                    {' '}{generations.find(gen => gen.id === selectedGeneration)?.localName[language] || ''}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* 宝可梦列表 */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {filteredPokemonList.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={handlePokemonClick}
                />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                >
                  {t('pagination.previous')}
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                >
                  {t('pagination.next')}
                </button>
              </div>
            )}

            {filteredPokemonList.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">{t('language.switch')}</div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {t('status.noResults')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('status.noResultsHint')}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* 宝可梦详情弹窗 */}
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}