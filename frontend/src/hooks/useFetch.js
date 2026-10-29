import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    api(path)
      .then((r) => !cancelled && setState({ data: r.data, loading: false, error: null }))
      .catch((e) => !cancelled && setState({ data: null, loading: false, error: e.message }));
    return () => { cancelled = true; };
  }, [path]);
  return state;
}
