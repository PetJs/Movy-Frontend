import axios from "axios";
import axiosInstance from "@/api/axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Data } from "@/types";
import Watchlist from "../assets/svg/Add to wishlist.svg"
import Logo from "../assets/svg/logo.svg";
import Bookmark from "../assets/svg/bookmark.svg"

// Placeholder Component
const PlaceholderCard = () => (
  <div className="w-32 flex-shrink-0 p-4 bg-gray-300 rounded shadow-md animate-pulse">
    <div className="h-32 bg-gray-400 rounded mb-2"></div>
    <div className="h-4 bg-gray-400 rounded w-3/4 mb-1"></div>
    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
  </div>
);

const MoviePage: React.FC = () => {
  const [cast, setCast] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingCast, setLoadingCast] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  // const [watchlist, setWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const placeholderCards = Array.from({ length: 10 }, (_, i) => i);
  

  const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    return userId ? parseInt(userId, 10) : null;
  };

  useEffect(() => {
    const userId = getUserIdFromLocalStorage();

    if (!userId) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAddToWatchlist = async (movie: Data) => {
    const userId = getUserIdFromLocalStorage();
    
    if (!userId) {
      navigate('/login');
      return;
    }
  
    setLoadingCast(true);
    console.log(movie)
    try {
      const res = await axiosInstance.post("/add-watchlist", {
        user_id: Number(userId),
        movie_id: movie.movie_id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
      });
      console.log(res.data)
      setIsInWatchlist(true);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    } finally {
      setLoadingCast(false);
    }
  };

  const getCast = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie?.movie_id}/credits`,
        {
          params: { api_key: "2c0bea08d227ef6f04fad2db2b9920a4" },
        }
      );
      setCast(response.data.cast);
    } catch (err) {
      console.error("Failed to fetch cast", err);
    } finally {
      setLoadingCast(false);
    }
  };

  const getRecommendations = async () => {
    try {
      const response = await axiosInstance.get(`/recommendations/${movie?.movie_id}`);
      if (response.data && Array.isArray(response.data.recommendations)) {
        setRecommendations(response.data.recommendations);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleMovieClick = (movie: Data) => {
    navigate("/moviePage", {
      state: movie,
    });
  };

  const handleWatchNowClick = () => {
    const userId = getUserIdFromLocalStorage();
    const videoId = movie?.movie_id;

    if (!userId) {
      console.log("User is not logged in.");
      navigate('/login');
      return;
    }

    navigate('/stream', { state: { userId, videoId } });
  };

  const movie = location.state as Data;
  const genres = Array.isArray(movie.genres) ? movie.genres.join(', ') : '';

  useEffect(() => {
    if (movie?.movie_id) {
      getCast();
      getRecommendations();
    }
  }, [movie]);

  if (!movie) {
    return <div>Loading...</div>; // Handle missing movie state
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9C4AA099] via-[#3D1B3F99] via-[#1A0C1B99] to-[#00000099]">
      <div className="mr-4">
        <Link to='/'>
          <img src={Logo} alt="Icon" className="md:w-40 w-40" />
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-5">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.original_title}
          className="w-full md:w-72 rounded"
        />
        <div className="w-full md:w-auto">
          <h1 className="text-xl font-bold md:mt-0 mt-2">{movie.title}</h1>
          <p>Genre: {genres || 'No genres available'}</p> 
          <p>{movie.release_date}</p>
          <p>Rating {movie.rating}</p>
          <div className="flex gap-6  mt-4">
            <button
              onClick={handleWatchNowClick}
              className="bg-black rounded text-white px-2 py-1"
            >
              Watch Now
            </button>
            <button
              onClick={() => handleAddToWatchlist(movie)}
              className="text-black"
            >
              <img
                src={isInWatchlist ? Bookmark : Watchlist}
                alt="Watchlist Icon"
                className="md:w-10 w-8"
              />
            </button>
          </div>
          <p>Overview: {movie.overview}</p>
        </div>
      </div>

      {/* CAST */}
      <div className="m-6">
        <h2 className="text-lg font-bold">Cast</h2>
        <div className="flex overflow-x-scroll gap-4 rounded-md hide-scrollbar mt-4">
          {loadingCast
            ? placeholderCards.map((_, index) => <PlaceholderCard key={index} />)
            : cast.map((actor: any) => (
                <div key={actor.id} className="relative flex-shrink-0 cursor">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="rounded-full object-cover"
                  />
                  <div className="p-2">
                    <p className="text-sm font-semibold truncate text-black">{actor.name}</p>
                    <p className="text-xs text-gray-500">As: {actor.character}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="m-6">
        <h2 className="text-lg font-bold">Movies You May Like</h2>
        <div className="flex overflow-x-scroll gap-4 rounded-md hide-scrollbar mt-4">
          {loadingRecommendations
            ? placeholderCards.map((_, index) => <PlaceholderCard key={index} />)
            : recommendations.map((movie: Data) => (
                <div key={movie.movie_id} className="relative flex-shrink-0 cursor">
                  <button onClick={() => handleMovieClick(movie)}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                      alt={movie.title}
                      className="w-32 rounded-md"
                    />
                    <div className="p-2">
                      <p className="text-sm font-semibold truncate text-black">{movie.title}</p>
                    </div>
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
