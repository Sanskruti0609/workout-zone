import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch.js";
import { markPromoSeen, shouldShowPromo } from "../../utils/promoStorage.js";
import PromoAnnouncement from "./PromoAnnouncement.jsx";

// Shows the single active promotion (if any). Renders nothing when there is none.
export default function PromoHost({ only }) {
  const { data: promo } = useFetch("/api/promotions/active");
  const [visible, setVisible] = useState(false);

  const valid = promo && !Array.isArray(promo) && Boolean(promo.title);

  useEffect(() => {
    if (!valid) return;
    if (shouldShowPromo(promo)) { setVisible(true); markPromoSeen(promo); }
  }, [promo, valid]);

  if (!valid || !visible) return null;
  const isPopup = promo.format === "POPUP";
  if (only === "popup" && !isPopup) return null;
  if (only === "inline" && isPopup) return null;
  return <PromoAnnouncement promo={promo} onClose={() => setVisible(false)} />;
}
