import { useFetch } from "../../hooks/useFetch.js";

export default function RatingBadge() {
  const { data } = useFetch("/api/business");
  if (!data?.googleRating) return null;
  return (
    <p className="inline-block rounded-full border border-neutral-700 px-4 py-1 text-sm">
      <span className="font-bold text-orange-500">{data.googleRating}/5</span>
      {data.reviewCount ? ` from ${data.reviewCount} Google reviews` : " on Google"}
    </p>
  );
}
