import { Data } from "@/types";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";
import { useNavigate } from "react-router-dom";

type Watchlist = Data[];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const placeholderCards = Array.from({ length: 10 }, (_, i) => i);

  const userId = localStorage.getItem("userId");

  const getWatchlist = async () => {
    try {
      const response = await axiosInstance.get(`/watchlist/${userId}`);
      setWatchlist(response.data);
    } catch (error) {
      console.error("Error fetching user watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovieFromWatchlist = async (movieId: number) => {
    try {
      const response = await axiosInstance.post("/delete-from-watchlist", {
        user_id: userId,
        movie_id: movieId,
      });

      if (response.status === 200) {
        setWatchlist((prevWatchlist) =>
          prevWatchlist?.filter((item) => item.movie_id !== movieId) || []
        );
      }
    } catch (error) {
      console.error("Error deleting movie from watchlist:", error);
    }
  };

  const handleMovieClick = (item: Data) => {
    navigate("/moviePage", {
      state: {
        isTVShow: false,
        movie_id: item.movie_id,
        posterPath: item.posterPath,
        original_title: item.original_title,
        overview: item.overview,
        title: item.title,
        tagline: item.tagline,
        adult: item.adult,
        genres: item.genres,
        rating: item.rating,
        release_date: item.release_date,
      },
    });
  };

  useEffect(() => {
    getWatchlist();
  }, []);

  if (!watchlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#CDBDCE]">
      <h1 className="text-2xl font-bold mb-4 text-white flex justify-center">Watchlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {loading
          ? placeholderCards.map((_, index) => (
              <div
                key={index}
                className="p-4 bg-gray-300 rounded shadow-md animate-pulse"
              >
                <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
              </div>
            ))
          : watchlist.map((item) => (
              <div
                key={item.movie_id}
                className="flex text-white p-2 rounded-lg shadow-lg"
              >
                <img
                  src={
                    item.posterPath
                      ? item.posterPath
                      : "/path/to/fallback-image.jpg"
                  }
                  alt={item.title}
                  className="w-40 h-60 object-cover rounded-lg mr-4"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="text-sm text-white mt-2 line-clamp-3">
                      {item.overview || "No description available."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleMovieClick(item)}
                      className="bg-[#F7931D] px-2 py-1 text-white rounded-md"
                    >
                      Watch Now
                    </button>
                    <button
                      onClick={() => deleteMovieFromWatchlist(item.movie_id)}
                      className="bg-red-500 px-2 py-1 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
