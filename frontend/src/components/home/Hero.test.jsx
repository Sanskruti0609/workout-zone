import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";

const matches = (map) => (q) => ({ matches: !!map[q], media: q, addEventListener() {}, removeEventListener() {} });

beforeEach(() => {
  globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { googleRating: 4.2 } }) });
});
const renderHero = () => render(<MemoryRouter><Hero /></MemoryRouter>);

it("keeps all existing hero content and links", async () => {
  window.matchMedia = matches({});
  renderHero();
  expect(screen.getByText("Parel, Mumbai")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your goals.Your grind.Your zone.");
  expect(screen.getByText(/Build strength, improve endurance/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Explore memberships" })).toHaveAttribute("href", "/memberships");
  expect(screen.getByRole("link", { name: "Discover HYROX" })).toHaveAttribute("href", "/#hyrox");
  for (const t of ["Strength", "Yoga", "Zumba", "HYROX"]) expect(screen.getAllByText(t).length).toBeGreaterThan(0);
  expect(await screen.findByText("4.2/5 on Google")).toBeInTheDocument();
});

it("hides the decorative 3D plate from assistive technology", () => {
  window.matchMedia = matches({});
  renderHero();
  const stage = document.querySelector(".hz-stage");
  expect(stage).toHaveAttribute("aria-hidden", "true");
  expect(stage.querySelectorAll("img[alt]:not([alt=''])")).toHaveLength(0);
});

it("renders fewer 3D layers on phones than on desktop", () => {
  window.matchMedia = matches({ "(max-width: 899px)": true });
  const phone = renderHero();
  const phoneLayers = document.querySelectorAll(".hz-slice").length;
  phone.unmount();
  window.matchMedia = matches({});
  renderHero();
  expect(document.querySelectorAll(".hz-slice").length).toBeGreaterThan(phoneLayers);
  expect(phoneLayers).toBeLessThanOrEqual(8);
});

it("does not track the pointer for reduced motion or touch devices, and cleans up", () => {
  const add = vi.spyOn(window, "addEventListener");
  window.matchMedia = matches({ "(prefers-reduced-motion: reduce)": true, "(hover: hover) and (pointer: fine)": true });
  const a = renderHero(); a.unmount();
  window.matchMedia = matches({ "(hover: none)": true });
  const b = renderHero(); b.unmount();
  expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(0);
  add.mockRestore();
});

it("tracks the pointer on desktop and removes the listener on unmount", () => {
  const add = vi.spyOn(window, "addEventListener");
  const remove = vi.spyOn(window, "removeEventListener");
  window.matchMedia = matches({ "(hover: hover) and (pointer: fine)": true });
  const r = renderHero();
  expect(add.mock.calls.some(([t]) => t === "pointermove")).toBe(true);
  r.unmount();
  expect(remove.mock.calls.some(([t]) => t === "pointermove")).toBe(true);
  add.mockRestore(); remove.mockRestore();
});
