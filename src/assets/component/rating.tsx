import React from "react";

interface StarRatingProps {
  rating: number; 
  maxStars?: number; 
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  const ratingToFive = (rating / 10) * maxStars; 
  const filledStars = Math.floor(ratingToFive); 
  const halfStar = ratingToFive - filledStars >= 0.5; 
  const emptyStars = maxStars - filledStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center ">
      {[...Array(filledStars)].map((_, index) => (
        <span key={`filled-${index}`} className="text-[#FFD700] text-lg">
          ★
        </span>
      ))}

      {halfStar && (
        <span className="text-[#FFD700] text-lg relative inline-block">
          <span className="absolute overflow-hidden w-1/2 left-0 top-0 h-full">
            ★
          </span>
          <span className="text-[#E0E0E0] absolute left-1/2 top-0 w-1/2 h-full overflow-hidden">
            ★
          </span>
        </span>
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <span key={`empty-${index}`} className="text-[E0E0E0] text-lg">
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
