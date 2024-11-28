import { useLocation, useNavigate } from "react-router-dom";
import { Season } from "@/types";

const TVShowPage = () => {
  const { state } = useLocation();
  const { isTVShow, title, posterPath, overview, rating, seasons, tv_id } = state;
  const navigate = useNavigate();

  const getUserIdFromLocalStorage = () => {
    return localStorage.getItem("userId"); 
  };

  const handleWatchNowClick = (videoId: number, season: number, episode: number) => {
    const userId = getUserIdFromLocalStorage();

    if (!userId) {
      console.log("User is not logged in.");
      navigate("/login");
      return;
    }

    console.log("UserId:", userId);
    console.log("VideoId:", videoId);
    console.log("Season:", season);
    console.log("Episode:", episode);

    navigate("/stream", {
      state: { userId, videoId, seasonNumber: season, episodeNumber: episode, isTVShow: true },
    });
  };

  return (
    <div >
      <div className="flex items-start gap-5">
        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          className="w-72"
        />
        <div>
          <h1>{title}</h1>
          <p>{overview}</p>
          <p>Rating: {rating}</p>
        </div>
      </div>
      
      {/* Display Seasons and Episodes */}
      <div className="flex">
        {seasons &&
          seasons.map((season: Season, seasonIndex: number) => (
            <div key={season.season_id} className="season">
              <h2>Season {seasonIndex + 1}</h2>
              <p>Total Episodes: {season.episode_count}</p>

              <div className="episodes">
                <h3>Episodes:</h3>
                {season.episodes &&
                  season.episodes.map((episode, episodeIndex) => (
                    <div key={episode.episode_id} className="flex gap-4 mb-4">
                      <h4>
                        Episode {episodeIndex + 1}: {episode.title}
                      </h4>
                      <p>{episode.overview}</p>
                      <p>Air Date: {episode.air_date}</p>
                      <button
                        onClick={() =>
                          handleWatchNowClick(tv_id, seasonIndex + 1, episodeIndex + 1)
                        }
                        className="bg-black rounded text-white px-2 py-1"
                      >
                        Watch Now
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TVShowPage;
