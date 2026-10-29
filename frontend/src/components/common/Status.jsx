export function Loading() {
  return <p className="muted" role="status">Loading...</p>;
}
export function ErrorMessage({ message }) {
  return <p className="err" role="alert">Could not load this information ({message}). Please try again shortly.</p>;
}
export function Empty({ children }) {
  return <p className="muted">{children}</p>;
}
export function Async({ state, empty = "Nothing to show yet.", children }) {
  if (state.loading) return <Loading />;
  if (state.error) return <ErrorMessage message={state.error} />;
  if (!state.data || (Array.isArray(state.data) && state.data.length === 0)) return <Empty>{empty}</Empty>;
  return children(state.data);
}
