import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/svg/logo.svg";
import Streak from "../assets/svg/Vector.svg"
import { Profile, History } from '@/types';


const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")
  console.log(userId)

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(`/profile/${userId}`); 
      console.log(response.data)
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const logout = async ()=>{
    try{
      const result = await axiosInstance.get("/logout", {
        withCredentials: true,
      })

      if(result.status === 200){
        navigate('/login')
      }
    }catch(error){
      console.log('Error logging out:', error);
    }
  }

  return (
    <div className='bg-[#CDBDCE] h-screen'>
      <header className='bg-[#281229]'>
      <nav className="flex justify-between items-center w-[97%] mx-auto  ">
          <div className="mr-4">
            <Link to='/'>
              <img src={Logo} alt="Icon" className="md:w-40 w-40" />
            </Link>
          </div>

          <div className="flex items-center gap-2 py-2">
            <Link
              to="/watchlist"
              className="border-2 px-2 border-[#CDBDCE] ml-2 rounded text-white whitespace-nowrap"
            >
              <button>WatchList</button>
            </Link>

            <div className="flex items-center justify-center rounded-full w-14 h-14 ">
              <Link to='/profile'>
                <button>
                  {profile.user.pfp ? (
                    <img src={profile.user.pfp} alt="Profile"  />
                  ) : (
                    <FontAwesomeIcon icon={faUser} size="xl" />
                  )}
                </button>
              </Link>
            </div>
          </div>
        </nav>  

          {/* HERO SECTION */}
          <div className=" mt-6 ">
            <div className='flex gap-3 '>
              <img src={profile.user.pfp} alt="Notworking" className='md:w-40 w-24' />
              <div className='flex flex-col mt-10'>
                <p className='text-lg text-[#F7931D] font-bold'>Name: {profile.user.name}</p>
                <p className='text-white'>Email: {profile.user.email}</p>
              </div>
            </div>
            <div className='flex justify-between mt-4'>
              <div className='flex gap-1'>
                <p className='text-lg font-semibold text-white'>
                  Current Streak:
                  <span className="flex items-center gap-1">
                    {profile.streak.current_streak}
                    <img src={Streak} alt="Icon" className="w-4" />
                  </span>
                </p>
              </div>
              <p className='text-lg font-semibold text-white'>Last Updated: {profile.streak.last_updated ? new Date(profile.streak.last_updated).toLocaleString() : 'Never'}</p>
            </div>
          </div>
      </header>
      <div className='bg-[#CDBDCE] h'>
        <h3 className='font-bold text-xl flex items-center justify-center'>Watch History</h3>
        <ul>
          {profile.watchHistory.map((history: History) => (
            <li key={history.id} className='flex gap-4'>
              <img src={history.poster_path} alt={history.movie_title} className='w-40 rounded m-2' />
              <div className='font-semibold'>
                <p>{`Movie: ${history.movie_title}`}</p>
                <p>{`Watched At: ${new Date(history.watched_at).toLocaleString()}`}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button className="flex bg-[#F7931D] justify-center mx-auto border-none w-[75%] p-1 rounded mb-2 font-semibold text-lg text-[#FFFFFF]" onClick={logout}>
          LogOut
        </button>
      </div>
      
    </div>
  );
};

export default UserProfile;
