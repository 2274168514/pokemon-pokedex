// 宝可梦世代数据定义
export interface Generation {
  id: number;
  name: string;
  localName: {
    zh: string;
    en: string;
  };
  startId: number;
  endId: number;
  region: string;
  totalPokemon: number;
}

export const generations: Generation[] = [
  {
    id: 1,
    name: 'generation-i',
    localName: {
      zh: '第一世代',
      en: 'Generation I'
    },
    startId: 1,
    endId: 151,
    region: 'kanto',
    totalPokemon: 151
  },
  {
    id: 2,
    name: 'generation-ii',
    localName: {
      zh: '第二世代',
      en: 'Generation II'
    },
    startId: 152,
    endId: 251,
    region: 'johto',
    totalPokemon: 100
  },
  {
    id: 3,
    name: 'generation-iii',
    localName: {
      zh: '第三世代',
      en: 'Generation III'
    },
    startId: 252,
    endId: 386,
    region: 'hoenn',
    totalPokemon: 135
  },
  {
    id: 4,
    name: 'generation-iv',
    localName: {
      zh: '第四世代',
      en: 'Generation IV'
    },
    startId: 387,
    endId: 493,
    region: 'sinnoh',
    totalPokemon: 107
  },
  {
    id: 5,
    name: 'generation-v',
    localName: {
      zh: '第五世代',
      en: 'Generation V'
    },
    startId: 494,
    endId: 649,
    region: 'unova',
    totalPokemon: 156
  },
  {
    id: 6,
    name: 'generation-vi',
    localName: {
      zh: '第六世代',
      en: 'Generation VI'
    },
    startId: 650,
    endId: 721,
    region: 'kalos',
    totalPokemon: 72
  },
  {
    id: 7,
    name: 'generation-vii',
    localName: {
      zh: '第七世代',
      en: 'Generation VII'
    },
    startId: 722,
    endId: 809,
    region: 'alola',
    totalPokemon: 88
  },
  {
    id: 8,
    name: 'generation-viii',
    localName: {
      zh: '第八世代',
      en: 'Generation VIII'
    },
    startId: 810,
    endId: 905,
    region: 'galar',
    totalPokemon: 96
  },
  {
    id: 9,
    name: 'generation-ix',
    localName: {
      zh: '第九世代',
      en: 'Generation IX'
    },
    startId: 906,
    endId: 1025,
    region: 'paldea',
    totalPokemon: 120
  }
];

// 获取指定世代的数据
export function getGenerationById(id: number): Generation | undefined {
  return generations.find(gen => gen.id === id);
}

// 获取所有世代总数
export function getTotalPokemonCount(): number {
  return generations.reduce((total, gen) => total + gen.totalPokemon, 0);
}

// 获取指定ID属于哪个世代
export function getGenerationByPokemonId(pokemonId: number): Generation | undefined {
  return generations.find(gen => pokemonId >= gen.startId && pokemonId <= gen.endId);
}