import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App.jsx";

const DAYS = [0, 1, 2, 3, 4, 5, 6];
const timings = DAYS.flatMap((d) => [
  { id: d * 10 + 1, dayOfWeek: d, startTime: "06:00", endTime: "12:00", sessionType: "UNISEX" },
  { id: d * 10 + 2, dayOfWeek: d, startTime: "12:00", endTime: "15:00", sessionType: d >= 1 && d <= 5 ? "LADIES_ONLY" : "UNISEX" },
]);
const routes = {
  "/api/business": { name: "Workout Zone", address: "Parel East, Mumbai", phone: "+91 84528 03039", googleRating: 4.2, reviewCount: 282 },
  "/api/trainers": [{ id: 1, name: "Atish Babu Shinde", role: "Main Trainer", gender: "MALE", isMainTrainer: true }],
  "/api/services": [{ id: 1, name: "Strength Training", slug: "gym-strength-training", description: "Build strength.", imageUrl: null }],
  "/api/timings": timings,
  "/api/promotions/active": null,
};

beforeEach(() => {
  window.scrollTo = () => {};
  globalThis.fetch = (url) => {
    const path = new URL(url).pathname;
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: path in routes ? routes[path] : [] }) });
  };
});

it("renders the homepage sections in order and no empty promotion", async () => {
  const { container } = render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByText(/Your goals/i)).toBeInTheDocument();
  expect(await screen.findByText("Strength Training")).toBeInTheDocument();
  expect(await screen.findByText(/out of 5 on Google/)).toBeInTheDocument();
  expect(await screen.findByText("Monday – Friday")).toBeInTheDocument();
  const ids = [...container.querySelectorAll("section[id]")].map((s) => s.id);
  expect(ids).toEqual(["home", "services", "hyrox", "gallery", "reviews", "timings", "contact"]);
  expect(ids.indexOf("services")).toBeLessThan(ids.indexOf("hyrox"));
  expect(ids.indexOf("hyrox")).toBeLessThan(ids.indexOf("gallery"));
  expect(ids.indexOf("gallery")).toBeLessThan(ids.indexOf("reviews"));
  expect(ids.indexOf("reviews")).toBeLessThan(ids.indexOf("timings"));
  expect(ids.indexOf("timings")).toBeLessThan(ids.indexOf("contact"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("shows weekdays as one entry plus Saturday and Sunday, with the ladies-only hours", async () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(await screen.findByText("Monday – Friday")).toBeInTheDocument();
  expect(screen.getByText("Saturday")).toBeInTheDocument();
  expect(screen.getByText("Sunday")).toBeInTheDocument();
  expect(screen.queryByText("Tuesday")).not.toBeInTheDocument();
  expect(screen.getByText(/12:00 PM – 3:00 PM on weekdays/)).toBeInTheDocument();
});

it("lists the trainers on the trainers page", async () => {
  render(<MemoryRouter initialEntries={["/trainers"]}><App /></MemoryRouter>);
  expect(await screen.findByText("Atish Babu Shinde")).toBeInTheDocument();
});

it("shows a 404 page for unknown routes", () => {
  render(<MemoryRouter initialEntries={["/nope"]}><App /></MemoryRouter>);
  expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
});
