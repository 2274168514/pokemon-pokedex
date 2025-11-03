export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
    front_default: string | null;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  names: any[];
  flavor_text_entries: any[];
  genera: any[];
  color: any;
  habitat: any;
  evolution_chain: {
    url: string;
  };
}