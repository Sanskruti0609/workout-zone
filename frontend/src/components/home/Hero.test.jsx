import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";

const matches = (map) => (q) => ({ matches: !!map[q], media: q, addEventListener() {}, removeEventListener() {} });
const renderHero = () => render(<MemoryRouter><Hero /></MemoryRouter>);
const frame = () => act(() => new Promise((r) => requestAnimationFrame(() => r())));

beforeEach(() => {
  globalThis.fetch = vi.fn();
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

it("shows the centered eyebrow, headline and description", () => {
  window.matchMedia = matches({});
  renderHero();
  expect(screen.getByText("Parel, Mumbai")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your goals.Your grind.Your zone.");
  expect(screen.getByText(/Build strength, improve endurance/)).toBeInTheDocument();
});

it("no longer has buttons, links, category tags or a Google rating", () => {
  window.matchMedia = matches({});
  renderHero();
  expect(screen.queryAllByRole("link")).toHaveLength(0);
  expect(screen.queryAllByRole("button")).toHaveLength(0);
  for (const t of ["Strength", "Yoga", "Zumba", "HYROX"]) expect(screen.queryByText(t)).not.toBeInTheDocument();
  expect(screen.queryByText(/on Google/)).not.toBeInTheDocument();
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

it("puts the decorative 3D plate behind the text and hides it from assistive technology", () => {
  window.matchMedia = matches({});
  const { container } = renderHero();
  const stage = container.querySelector(".hz-stage");
  expect(stage).toHaveAttribute("aria-hidden", "true");
  const kids = [...container.querySelector(".hz-hero").children];
  expect(kids.indexOf(stage)).toBeLessThan(kids.indexOf(container.querySelector(".hz-copy")));
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

it("updates the scroll progress used for the parallax", async () => {
  window.matchMedia = matches({});
  const { container } = renderHero();
  const hero = container.querySelector(".hz-hero");
  expect(hero.style.getPropertyValue("--p")).toBe("0.000");
  window.scrollY = 10_000;
  act(() => { window.dispatchEvent(new Event("scroll")); });
  await frame();
  expect(hero.style.getPropertyValue("--p")).toBe("1.000");
});

it("does not run scroll or pointer motion for reduced motion, and cleans up", () => {
  const add = vi.spyOn(window, "addEventListener");
  window.matchMedia = matches({ "(prefers-reduced-motion: reduce)": true, "(hover: hover) and (pointer: fine)": true });
  const r = renderHero(); r.unmount();
  const types = add.mock.calls.map(([t]) => t);
  expect(types).not.toContain("scroll");
  expect(types).not.toContain("pointermove");
  add.mockRestore();
});

it("tracks the pointer on desktop and removes its listeners on unmount", () => {
  const add = vi.spyOn(window, "addEventListener");
  const remove = vi.spyOn(window, "removeEventListener");
  window.matchMedia = matches({ "(hover: hover) and (pointer: fine)": true });
  const r = renderHero();
  expect(add.mock.calls.some(([t]) => t === "pointermove")).toBe(true);
  r.unmount();
  expect(remove.mock.calls.some(([t]) => t === "pointermove")).toBe(true);
  expect(remove.mock.calls.some(([t]) => t === "scroll")).toBe(true);
  add.mockRestore(); remove.mockRestore();
});