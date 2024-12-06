import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "@/api/axios"; 
import Logo from "../assets/svg/logo.svg";

const StreamingPage: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const { userId, videoId, isTVShow, seasonNumber, episodeNumber, original_title } = location.state || {};

  useEffect(() => {
    const fetchStream = async () => {
      if (!userId || !videoId) {
        setError("Invalid user or video ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const endpoint = isTVShow
          ? `/stream/tv/${userId}?videoId=${videoId}&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}`
          : `/stream/${userId}?videoId=${videoId}`;

          const response = await axiosInstance.get(endpoint); 
        if (isTVShow && response.data?.streamTvUrl) {
          setStreamUrl(response.data.streamTvUrl);
        } else if (!isTVShow && response.data?.streamUrl) {
          setStreamUrl(response.data.streamUrl);
        } else {
          setError("Stream not available.");
        }
      } catch (err: any) {
        console.log("Error fetching stream:", err.response ? err.response.data : err.message);
        setError("Failed to load stream. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [userId, videoId, isTVShow, seasonNumber, episodeNumber]);

  return (
    <div className="h-screen bg-gradient-to-br from-[#9C4AA099] via-[#3D1B3F99] via-[#1A0C1B99] to-[#00000099]">
      <div className="mr-4">
        <Link to='/'>
          <img src={Logo} alt="Icon" className="md:w-40 w-40" />
        </Link>
      </div>
      {loading ? (
        <div>Loading video...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : streamUrl ? (
        <div>
          <h2 className="flex items-center justify-center font-semibold">{original_title}</h2>
          <iframe
            src={streamUrl}
            allowFullScreen
            className="flex justify-center w-full h-[500px]"
          ></iframe>
        </div>
      ) : (
        <div>No stream available.</div>
      )}
    </div>
  );
};

export default StreamingPage;
