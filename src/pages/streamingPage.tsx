import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "@/api/axios";  // Assuming this is your axios instance.
import Logo from "../assets/svg/logo.svg";

const StreamingPage: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Extract params from location state
  const { userId, videoId, isTVShow, seasonNumber, episodeNumber } = location.state || {};

  useEffect(() => {
    const fetchStream = async () => {
      if (!userId || !videoId) {
        setError("Invalid user or video ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Construct the endpoint based on whether it's a TV show or movie
        const endpoint = isTVShow
          ? `/stream/tv/${userId}?videoId=${videoId}&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}`
          : `/stream/${userId}?videoId=${videoId}`;

        console.log("Constructed endpoint:", endpoint);

        // Make the API request
        const response = await axiosInstance.get(endpoint);

        // Check if the response contains the correct stream URL
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
        <iframe
          src={streamUrl}
          frameBorder="0"
          allowFullScreen
          className="flex justify-center w-full h-[500px]"
        ></iframe>
      ) : (
        <div>No stream available.</div>
      )}
    </div>
  );
};

export default StreamingPage;
