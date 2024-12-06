import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import '../css/style.css'
import axios from "axios";
import Logo from "../assets/svg/logo.svg";
import { Data, TVShowData, Profile } from "@/types";
import axiosInstance from "@/api/axios";

export default function DashboardPage() {
  const [searchData, setSearchData] = useState<Data[]>([])
  const [trendingMovies, setTrendingMovies] = useState<Data[]>([])
  const [actionMovies, setActionMovies] = useState<Data[]>([])
  const [anime, setAnime] = useState<Data[]>([])
  const [romance, setRomance] = useState<Data[]>([])
  const [hollywood, setHollywood] = useState<Data[]>([])
  const [comedy, setComedy] = useState<Data[]>([])
  const [big, setBig] = useState<Data[]>([])
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [profile, setProfile] = useState<Profile | null>(null);

  const navigate = useNavigate()
  const handleclick = () => {
    console.log("I'm click")
  }

  const userId = localStorage.getItem("userId")

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setFilter(selectedOption);
    console.log(selectedOption === "TV" ? "/tv-search" : "/search");
  };

  const placeholderCards = Array.from({ length: 10 }, (_, i) => i);

  const handleMovieClick = (item: Data | TVShowData) => {
    if ('show_id' in item) { // Check if it's a TV Show
      navigate("/tv-page", {
        state: {
          isTVShow: true,
          tv_id: item.show_id,
          title: item.title,
          posterPath: item.posterPath,
          overview: item.overview,
          rating: item.rating,
          release_date: item.release_date,
          genres: item.genres,
          backdropPath: item.backdropPath,
          season_count: (item as TVShowData).season_count, 
          episode_count: (item as TVShowData).episode_count,
          seasons: (item as TVShowData).seasons, 
        },
      });
    } else if ('movie_id' in item) { 
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
    }
  };
  
  
  const handleChange = debounce(async (e: React.ChangeEvent<HTMLInputElement>)=>{
    const query = e.target.value.trim()

    if(!query){
      setSearchData([])
      return
    }

    try{
      const endpoint = filter === "TV" ? "/tv-search" : "/search";
      const results = await axios.get(`${endpoint}`, {
      params: {query}
    })
      
      console.log(results.data)

      if(results.data && Array.isArray(results.data.movies)){
        setSearchData(results.data.movies)
      }
      console.log(searchData);

    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  },500)

  useEffect(()=>{
    const fetchTrending = async () => {
      try{
        const response = await axiosInstance.get("/trending")
        console.log("API Response:", response.data);

        if(response.data && Array.isArray(response.data.trendingMovies)){
          setTrendingMovies(response.data.trendingMovies)
          setBig([response.data.trendingMovies[0]])
          console.log("Selected Movie for Big:", response.data.trendingMovies[0]);
        }
      }catch(err){
          console.error("Error Fetching data: ", err)
      }finally{
        setLoading(false)
      }
    }

    const fetchAction = async () => {
      try{
        const response = await axiosInstance.get("/action-movies")
        console.log("API Response:", response.data);

        if(response.data && Array.isArray(response.data.actionMovies)){
          setActionMovies(response.data.actionMovies)
        }
      }catch(err){
          console.error("Error Fetching data: ", err)
      }finally{
        setLoading(false)
      }
    }

    const fetchAnime = async () => {
      try{
        const response = await axiosInstance.get("/anime")
        console.log("API Response:", response.data);

        if(response.data && Array.isArray(response.data.anime)){
          setAnime(response.data.anime)
        }
      }catch(err){
          console.error("Error Fetching data: ", err)
      }finally{
        setLoading(false)
      }
    }

    const fetchRomance = async () => {
      try{
        const response = await axiosInstance.get("/romance")
        console.log("API Response:", response.data);

        if(response.data && Array.isArray(response.data.romance)){
          setRomance(response.data.romance)
        }
      }catch(err){
          console.error("Error Fetching data: ", err)
      }finally{
        setLoading(false)
      }
    }

    const fetchHollywood = async () => {
      try{
        const response = await axiosInstance.get("/hollywood")
        console.log("API Response:", response.data);

        if(response.data && Array.isArray(response.data.hollywood)){
          setHollywood(response.data.hollywood)
        }
      }catch(err){
          console.error("Error Fetching data: ", err)
      }finally{
        setLoading(false)
      }
    }

    const fetchComedy = async () => {
      try{
        const response = await axiosInstance.get("/comedy")
        console.log("API Response:", response.data);

        if(response.data && Array.isArray(response.data.comedy)){
          setComedy(response.data.comedy)
        }
      }catch(err){
          console.error("Error Fetching data: ", err)
      }finally{
        setLoading(false)
      }
    }

    const getUser = async () => {
      try {
        const response = await axiosInstance.get(`/profile/${userId}`); 
        console.log(response.data)
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchAction()
    fetchTrending();
    fetchRomance()
    fetchAnime()
    fetchHollywood()
    fetchComedy()
    getUser();
  }, [])
  
  return (
    <>
      <div className=" relative bg-gradient-to-br from-[#9C4AA099] via-[#3D1B3F99] via-[#1A0C1B99] to-[#00000099] text-white">
        <header className="bg-[#281229]">
          <nav className="flex justify-between  items-center w-[97%] mx-auto  ">
            <div className="mr-4">
              <Link to='/'>
                <img src={Logo} alt="Icon" className="md:w-40 w-40" />
              </Link>
            </div>
            <div className="relative flex items-center gap-2">
              <select 
                onChange={handleSelectChange}
                className="absolute left-1 bg-[#EFEAEF] text-black rounded-l px-1 focus:outline-none w-16">
                <option value="All">All</option>
                <option value="Movies">Movies</option>
                <option value="TV">TV series</option>
              </select>

              <input
                onChange={handleChange}
                type="text"
                className="w-full md:w-[600px] bg-[#EFEAEF] rounded py-1 pl-20 pr-10 text-black"
                placeholder="Type here..."
              />

              <div className="absolute right-3 text-black">
                <button>
                  <FontAwesomeIcon icon={faSearch}  />
                </button>
              </div>

              {searchData.length > 0 && (
                <div className="absolute bg-[#FFFFFF] text-black w-full rounded shadow-lg max-h-64 overflow-y-auto z-10 top-full left-0 transform translate-x-0 hide-scrollbar">
                  {searchData.map((item, index) => (
                    <div
                      key={index}
                      className="px-2 py-2 hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                    >
                      <button
                        onClick={() => handleMovieClick(item)} 
                        className="flex"
                      >
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} 
                          alt={item.title} 
                          className="rounded w-12" 
                        />
                        <h2 className="text-lg text-left font-semibold truncate text-left ml-2 text-black">
                          {item.title}
                        </h2>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
            </div>

            <div className="flex items-center gap-2 py-2">
              <Link
                to="/watchlist"
                className="border-2 px-2 border-[#CDBDCE] ml-2 rounded text-white whitespace-nowrap"
              >
                <button>WatchList</button>
              </Link>

              <div className="flex items-center justify-center rounded-full p-1 w-12 h-12 ">
                <Link to='/profile'>
                  <button>
                    {profile?.user?.pfp? (
                      <img src={profile.user.pfp} alt="Profile"  />
                    ) : (
                      <FontAwesomeIcon icon={faUser} size="xl" />
                    )}
                  </button>
                </Link>
              </div>
            </div>
          </nav>

          <div className="relative flex flex-col lg:flex-row items-center lg:space-x-4">
            <div className="flex-shrink-0 lg:mb-0 relative w-full">
              {big.length > 0 ? (
                big[0]?.backdropPath ? (
                  <div className="relative w-full ">
                    {/* Image */}
                    <img
                      src={`https://image.tmdb.org/t/p/w500${big[0].backdropPath}`}
                      alt={big[0].title || "Movie Image"}
                      className="w-full h-auto"
                    />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 text-white hover:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.75 12l-6 4V8l6 4z"
                        />
                      </svg>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-2">
                      <h2 className="text-[#6D2E70] text-xl font-semibold">Your Next Favourite Movie Awaits</h2>
                      <p 
                        className="truncate"
                        style={{ maxWidth: "120ch", wordWrap: "break-word" }}
                      >Uncover hidden gems, track your watchlist, and stream effortlessly. Your personal movie companion is here</p>
                    </div>
                  </div>
                ) : (
                  <p>No backdrop image available for {big[0]?.title || "this movie"}</p>
                )
              ) : (
                <p>No movie data available</p>
              )}
            </div>
          </div>
        </header>
        
        {/* THE FILTERING PART */}
        <div className="p-2 min-h-screen">
            <div className="text-xl">
                <button onClick={handleclick} className="mb-4 flex">
                    TRENDING
                    <p className="ml-4"> &gt; </p>
                </button>
            </div>
          <div className="flex overflow-x-scroll gap-4  rounded-md hide-scrollbar mb-4">
            {loading
              ? placeholderCards.map((_, index) => (
                  <div
                    key={index}
                    className="w-60 flex-shrink-0 p-4 bg-gray-300 rounded shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                ))
              : trendingMovies.map((item: Data) => (
                  <div
                    key={item.movie_id}
                    className="relative flex-shrink-0 rounded transition-colors duration-300 ease-in-out cursor"
                  >
                    <button onClick={() => handleMovieClick(item)}>
                      <img src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`} alt={item.original_title} className="rounded" />
                      <h2 className="text-lg font-semibold truncate text-left ml-2 text-black">{item.original_title}</h2>
                    </button>
                    
                  </div>
                ))}
          </div>

          <div className="text-xl">
                <button onClick={handleclick} className="mb-4 flex">
                    ACTION MOVIES
                    <p className="ml-4"> &gt; </p>
                </button>
            </div>
          <div className="flex overflow-x-scroll gap-4  rounded-md hide-scrollbar mb-4">
            {loading
              ? placeholderCards.map((_, index) => (
                  <div
                    key={index}
                    className="w-60 flex-shrink-0 p-4 bg-gray-300 rounded shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                ))
              : actionMovies.map((item: Data) => (
                <div
                key={item.movie_id}
                className="relative flex-shrink-0 rounded cursor"
              >
                <button onClick={() => handleMovieClick(item)}>
                      <img src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`} alt={item.original_title} className="rounded" />
                      <h2 className="text-lg font-semibold truncate text-left ml-2 text-black">{item.original_title}</h2>
                </button>
              </div>
                ))}
          </div>

          <div className="text-xl">
                <button onClick={handleclick} className="mb-4 flex">
                    ANIME
                    <p className="ml-4"> &gt; </p>
                </button>
            </div>
          <div className="flex overflow-x-scroll gap-4  rounded-md hide-scrollbar mb-4">
            {loading
              ? placeholderCards.map((_, index) => (
                  <div
                    key={index}
                    className="w-60 flex-shrink-0 p-4 bg-gray-300 rounded shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                ))
              : anime.map((item: Data) => (
                <div
                key={item.movie_id}
                className="relative flex-shrink-0 rounded cursor"
              >
                <button onClick={() => handleMovieClick(item)}>
                      <img src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`} alt={item.original_title} className="rounded" />
                      <h2 className="text-lg font-semibold truncate text-left ml-2 text-black">{item.title}</h2>
                    </button>
              </div>
                ))}
          </div>

          <div className="text-xl">
                <button onClick={handleclick} className="mb-4 flex">
                    ROMANCE
                    <p className="ml-4"> &gt; </p>
                </button>
            </div>
          <div className="flex overflow-x-scroll gap-4  rounded-md hide-scrollbar mb-4">
            {loading
              ? placeholderCards.map((_, index) => (
                  <div
                    key={index}
                    className="w-60 flex-shrink-0 p-4 bg-gray-300 rounded shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                ))
              : romance.map((item: Data) => (
                  <div
                    onClick={handleclick}
                    key={item.movie_id}
                    className="relative flex-shrink-0 rounded cursor"
                  >
                    <button onClick={() => handleMovieClick(item)}>
                      <img src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`} alt={item.original_title} className="rounded" />
                      <h2 className="text-lg font-semibold truncate text-left ml-2 text-black">{item.original_title}</h2>
                    </button>
                  </div>
                ))}
          </div>

          <div className="text-xl">
                <button onClick={handleclick} className="mb-4 flex">
                    HOLLYWOOD
                    <p className="ml-4"> &gt; </p>
                </button>
            </div>
          <div className="flex overflow-x-scroll gap-4  rounded-md hide-scrollbar mb-4">
            {loading
              ? placeholderCards.map((_, index) => (
                  <div
                    key={index}
                    className="w-60 flex-shrink-0 p-4 bg-gray-300 rounded shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                ))
              : hollywood.map((item: Data) => (
                  <div
                    onClick={handleclick}
                    key={item.movie_id}
                    className="relative flex-shrink-0 rounded cursor"
                  >
                    <button onClick={() => handleMovieClick(item)}>
                      <img src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`} alt={item.original_title} className="rounded" />
                      <h2 className="text-lg font-semibold truncate text-left ml-2 text-black">{item.original_title}</h2>
                    </button>
                  </div>
                ))}
          </div>

          <div className="text-xl">
                <button onClick={handleclick} className="mb-4 flex">
                    COMEDY
                    <p className="ml-4"> &gt; </p>
                </button>
            </div>
          <div className="flex overflow-x-scroll gap-4  rounded-md hide-scrollbar mb-4">
            {loading
              ? placeholderCards.map((_, index) => (
                  <div
                    key={index}
                    className="w-60 flex-shrink-0 p-4 bg-gray-300 rounded shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                  </div>
                ))
              : comedy.map((item: Data) => (
                  <div
                    onClick={handleclick}
                    key={item.movie_id}
                    className="relative flex-shrink-0 rounded cursor"
                  >
                    <button onClick={() => handleMovieClick(item)}>
                      <img src={`https://image.tmdb.org/t/p/w500${item.backdropPath}`} alt={item.original_title} className="rounded" />
                      <h2 className="text-lg font-semibold truncate text-left ml-2 text-black">{item.original_title}</h2>
                    </button>
                  </div>
                ))}
          </div>
        </div>

       
      </div>
    </>
  );
}
