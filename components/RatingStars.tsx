import { Star } from "lucide-react";

function RatingStars({ rating }: { rating: number }) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-[#B8860B] text-[#B8860B]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
}

export default RatingStars;