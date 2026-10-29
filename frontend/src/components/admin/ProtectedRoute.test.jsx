import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../App.jsx";
import { AuthProvider } from "../../context/AuthContext.jsx";

it("redirects visitors without a session to the admin login", async () => {
  globalThis.fetch = () => Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ error: "Please log in" }) });
  render(<MemoryRouter initialEntries={["/admin/trainers"]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: /admin login/i })).toBeInTheDocument();
});
