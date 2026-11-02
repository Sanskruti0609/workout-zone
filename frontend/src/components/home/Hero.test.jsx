import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const heroCss = readFileSync(resolve(process.cwd(), "src/styles/hero.css"), "utf8");
const matches = (map) => (q) => ({ matches: !!map[q], media: q, addEventListener() {}, removeEventListener() {} });
const renderHero = () => render(<MemoryRouter><Hero /></MemoryRouter>);
const frame = () => act(() => new Promise((r) => requestAnimationFrame(() => r())));
const withServices = (list) => {
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: list }) }));
};
const SERVICES = [
  { id: 1, category: "Training" }, { id: 2, category: "Training" }, { id: 3, category: "training" },
  { id: 4, category: "Store" }, { id: 5, category: "Recovery" },
];

beforeEach(() => {
  withServices(SERVICES);
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

it("shows the centered eyebrow, headline and description", () => {
  window.matchMedia = matches({});
  renderHero();
  expect(screen.getByText("Parel, Mumbai")).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your goals.Your grind.Your zone.");
  expect(screen.getByText(/Build strength, improve endurance/)).toBeInTheDocument();
});

it("has no buttons or links in the hero itself", () => {
  window.matchMedia = matches({});
  renderHero();
  expect(screen.queryAllByRole("link")).toHaveLength(0);
  expect(screen.queryAllByRole("button")).toHaveLength(0);
});

it("shows the side details from the design: tagline, Est. badge and highlight chips", async () => {
  window.matchMedia = matches({});
  const { container } = renderHero();
  expect(container.querySelector(".hz-vtag")).toHaveTextContent("TrainMoveGrow");
  expect(container.querySelector(".hz-est")).toHaveTextContent("Est. Parel");
  expect(await screen.findByText(/One strong/)).toBeInTheDocument();
  expect(screen.getByRole("list", { name: "Highlights" })).toBeInTheDocument();
});

it("shows the real number of training services, never a made-up figure", async () => {
  window.matchMedia = matches({});
  const { container } = renderHero();
  await screen.findByText(/One strong/);
  const chip = await screen.findByText("3"); // 3 active services are filed under Training
  expect(chip.tagName).toBe("B");
  expect(container.textContent).not.toMatch(/8\+/);
});

it("hides the training chip when the data has no training services", async () => {
  withServices([{ id: 1, category: "Store" }]);
  window.matchMedia = matches({});
  const { container } = renderHero();
  await screen.findByText(/One strong/);
  expect(container.querySelector(".hz-chip b")).toBeNull();
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

it("has the three neon edge layers behind the plate", () => {
  window.matchMedia = matches({});
  const { container } = renderHero();
  const kids = [...container.querySelector(".hz-stage").children].map((e) => e.className);
  const plate = kids.indexOf("hz-enter");
  for (const c of ["hz-bloom", "hz-rimglow", "hz-rim"]) {
    expect(kids.indexOf(c)).toBeGreaterThanOrEqual(0);
    expect(kids.indexOf(c)).toBeLessThan(plate);
  }
});

it("keeps the neon rings visible: masks are sized to the element and the rings turn slowly and continuously", () => {
  const rules = (sel) => (heroCss.match(new RegExp(`${sel.replace(".", "\\.")}\\{[^}]*\\}`, "g")) || []).join("");
  for (const sel of [".hz-bloom", ".hz-rimglow", ".hz-rim"]) {
    // "closest-side" makes 100% equal the ring's own radius, so the ring cannot be clipped away
    expect(rules(sel)).toContain("circle closest-side");
    expect(rules(sel)).not.toContain("radial-gradient(circle,");
    expect(rules(sel)).toContain("hzRotate 32s linear infinite");
  }
  expect(heroCss).toContain("@keyframes hzRotate{to{transform:rotate(360deg)}}");
});