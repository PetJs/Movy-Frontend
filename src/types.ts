export interface Data {
  movie_id: number;
  title: string;
  original_title: string;
  tagline: string;
  adult: boolean;
  genres: string[];
  overview: string;
  popularity: number;
  rating: number;
  vote_count: number;
  release_date: string;
  backdropPath: string | null;
  posterPath: string | null;
}

export interface TVShowData {
  tv_id: number;
  title: string;
  posterPath: string;
  overview: string;
  rating: number;
  release_date: string;
  genres: string[];
  episode_count: number;
  season_count: number;
  backdropPath: string;
  seasons: Season[]; 
}

export interface Season {
  season_id: number;
  season_name: string;
  episode_count: number;
  episodes: Episode[];
}

export interface Episode {
  episode_id: number;
  title: string;
  overview: string;
  air_date: string;
}
