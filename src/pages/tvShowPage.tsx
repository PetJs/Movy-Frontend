import { Link, useLocation, useNavigate } from "react-router-dom";
import { Season } from "@/types";
import Logo from "../assets/svg/logo.svg";
import StarRating from "@/assets/component/rating";

const TVShowPage = () => {
  const { state } = useLocation();
  const {title, posterPath, overview, rating, seasons, tv_id } = state;
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
    <div className="min-h-screen bg-gradient-to-br from-[#9C4AA099] via-[#3D1B3F99] via-[#1A0C1B99] to-[#00000099]">
      <div className="mr-4">
        <Link to='/'>
          <img src={Logo} alt="Icon" className="md:w-40 w-40" />
        </Link>
      </div>
      
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-5 mb-4">
        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          className="w-72 rounded"
        />
        <div>
          <h1 className="font-semibold text-xl">{title}</h1>
          <p>{overview}</p>
          <StarRating rating={rating} />
        </div>
      </div>
      
      {/* Display Seasons and Episodes */}
      <div className="">
        {seasons &&
          seasons.map((season: Season, seasonIndex: number) => (
            <div key={season.season_id} >
              <h2 className="font-semibold text-lg">Season {seasonIndex}</h2>
              <p>Total Episodes: {season.episode_count}</p>

              <div className="grid">
                <h3>Episodes:</h3>
                {season.episodes &&
                  season.episodes.map((episode, episodeIndex) => (
                    <div key={episode.episode_id} className=" gap-4 mb-4">
                      <h4>
                        Episode {episodeIndex + 1}: {episode.title}
                      </h4>
                      <p>{episode.overview}</p>
                      <p>Air Date: {episode.air_date}</p>
                      <button
                        onClick={() =>
                          handleWatchNowClick(tv_id, seasonIndex, episodeIndex + 1)
                        }
                        className="bg-[#F7931D] rounded text-white px-2 py-1"
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
