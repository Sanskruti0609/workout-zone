import { useFetch } from "../../hooks/useFetch.js";
import { Async } from "./Status.jsx";
import Icon from "./Icon.jsx";
import { mapsLink, telHref } from "../../utils/format.js";

export default function ContactBlock() {
  const state = useFetch("/api/business");
  return (
    <Async state={state}>
      {(b) => (
        <>
          <div className="c-info-list">
            <div className="c-info-row"><Icon className="ic" name="pin" /><div><div className="lbl">Location</div><span className="val">{b.address}</span></div></div>
            <div className="c-info-row"><Icon className="ic" name="phone" /><div><div className="lbl">Phone</div><a className="val" href={telHref(b.phone)}>{b.phone}</a></div></div>
            {b.openingInfo && <div className="c-info-row"><Icon className="ic" name="clock" /><div><div className="lbl">Hours</div><span className="val">{b.openingInfo}</span></div></div>}
            <div className="c-info-row"><Icon className="ic" name="instagram" /><div><div className="lbl">Instagram</div><a className="val" href="https://www.instagram.com/workoutzone_parel/" target="_blank" rel="noopener noreferrer">@workoutzone_parel</a></div></div>
          </div>
          <div className="contact-info-actions">
            <a className="btn btn-primary" href={telHref(b.phone)}>Call now</a>
            <a className="btn btn-outline" href={mapsLink(b)} target="_blank" rel="noopener noreferrer">Get directions</a>
          </div>
        </>
      )}
    </Async>
  );
}
