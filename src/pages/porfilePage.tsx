import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';

interface History {
  id: number;
  title: string;
  poster_path: string;
  watched_at: Date;
}

interface Profile {
  user: {
    pfp: string;
    name: string;
    email: string;
  };
  watchHistory: History[];
  streak: {
    current_streak: number;
    last_updated: Date | null;
  };
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const userId = localStorage.getItem("userId")
  console.log(userId)

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(`/profile/${userId}`); 
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

  return (
    <div>
      <h2>User Profile</h2>
      <img src={profile.user.pfp} alt="" />
      <p>Name: {profile.user.name}</p>
      <p>Email: {profile.user.email}</p>
      <h3>Watch History</h3>
      <ul>
        {profile.watchHistory.map((history: History) => (
          <li key={history.id}>
            <img src={history.poster_path} alt={history.title} width={50} />
            <p>{`Movie: ${history.title}, Watched At: ${new Date(history.watched_at).toLocaleString()}`}</p>
          </li>
        ))}
      </ul>
      <h3>Streak</h3>
      <p>Current Streak: {profile.streak.current_streak}</p>
      <p>Last Updated: {profile.streak.last_updated ? new Date(profile.streak.last_updated).toLocaleString() : 'Never'}</p>
    </div>
  );
};

export default UserProfile;
