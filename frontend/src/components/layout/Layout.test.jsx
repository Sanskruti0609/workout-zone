import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";

const app = (path) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<><h1>Home page</h1><section id="contact">Contact</section></>} />
        <Route path="/trainers" element={<h1>Trainers page</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>
);
const scrollTo = (y) => act(() => { window.scrollY = y; window.dispatchEvent(new Event("scroll")); });
const header = () => document.getElementById("siteHeader");

beforeEach(() => {
  window.scrollTo = () => {};
  window.scrollY = 0;
  globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { address: "Parel", phone: "+91 84528 03039" } }) });
});

it("shows only one Enquire button in the header while the hero is on screen", async () => {
  render(app("/"));
  expect(header()).toHaveClass("hero-view");
  const links = header().querySelectorAll("a");
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveTextContent("Enquire");
  expect(links[0]).toHaveAttribute("href", "/#contact");
  expect(header().querySelector(".nav-links")).toBeNull();
  expect(header().querySelector(".brand")).toBeNull();
  expect(header().querySelector(".burger")).toBeNull();
  expect(document.querySelector(".mobile-cta")).toBeNull();
  await screen.findByText("Home page");
});

it("brings the full navigation back after scrolling past the hero", () => {
  render(app("/"));
  scrollTo(2000);
  expect(header()).not.toHaveClass("hero-view");
  for (const name of ["Services", "HYROX", "Gallery", "Reviews", "Timings", "Trainers", "Memberships", "Contact"]) {
    expect(header().querySelector(".nav-links")).toHaveTextContent(name);
  }
  expect(header().querySelector(".brand")).not.toBeNull();
  expect(header().querySelector(".burger")).not.toBeNull();
  expect(document.querySelector(".mobile-cta")).not.toBeNull();
  scrollTo(0);
  expect(header()).toHaveClass("hero-view");
});

it("keeps the normal navigation on other pages", () => {
  render(app("/trainers"));
  expect(header()).not.toHaveClass("hero-view");
  expect(header().querySelector(".nav-links")).not.toBeNull();
});

it("Enquire scrolls to the enquiry form every time it is clicked, even when already at #contact", async () => {
  const scrollIntoView = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoView;
  render(app("/"));
  const wait = () => act(() => new Promise((r) => setTimeout(r, 120)));
  await userEvent.click(screen.getByRole("link", { name: "Enquire" }));
  await wait();
  expect(scrollIntoView).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole("link", { name: "Enquire" }));
  await wait();
  expect(scrollIntoView).toHaveBeenCalledTimes(2);
  expect(scrollIntoView.mock.instances[0].id).toBe("contact");
});