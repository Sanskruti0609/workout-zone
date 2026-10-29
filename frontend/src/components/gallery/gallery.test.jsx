import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GalleryGrid from "./GalleryGrid.jsx";
import ReviewsSection from "../home/ReviewsSection.jsx";

const items = [
  { id: 1, mediaType: "IMAGE", url: "/images/equipment/a.jpg", caption: "Squat racks" },
  { id: 2, mediaType: "VIDEO", url: "/uploads/b.mp4", posterUrl: null, caption: "Treadmills" },
  { id: 3, mediaType: "IMAGE", url: "/images/equipment/c.jpg", caption: null },
];

describe("GalleryGrid", () => {
  it("lazy-loads images and opens a larger view", async () => {
    render(<GalleryGrid items={items} />);
    const imgs = document.querySelectorAll(".gal-tile img");
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach((i) => expect(i).toHaveAttribute("loading", "lazy"));
    await userEvent.click(screen.getByRole("button", { name: /view photo: squat racks/i }));
    expect(screen.getByRole("dialog", { name: /gallery viewer/i })).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });
  it("plays videos with controls and navigates with keys, closing on Escape", async () => {
    render(<GalleryGrid items={items} />);
    await userEvent.click(screen.getByRole("button", { name: /play video: treadmills/i }));
    const video = document.querySelector(".lb video");
    expect(video).toHaveAttribute("controls");
    expect(video.getAttribute("src")).toMatch(/\/uploads\/b\.mp4$/);
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("shows only the first few items until expanded", async () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ id: i + 1, mediaType: "IMAGE", url: `/images/equipment/${i}.jpg`, caption: `Item ${i + 1}` }));
    render(<GalleryGrid items={many} initialCount={6} />);
    expect(document.querySelectorAll(".gal-tile")).toHaveLength(6);
    await userEvent.click(screen.getByRole("button", { name: /show all 9/i }));
    expect(document.querySelectorAll(".gal-tile")).toHaveLength(9);
  });
});

describe("ReviewsSection", () => {
  const reviews = [
    { id: 1, displayName: "Asha", quote: "Clean gym and helpful trainers.", rating: 5, photoUrl: null },
    { id: 2, displayName: "Rohan", quote: "Good equipment.", rating: null, photoUrl: null },
  ];
  it("shows real reviews with stars only when a rating exists", async () => {
    globalThis.fetch = (url) => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: new URL(url).pathname === "/api/testimonials" ? reviews : { googleRating: 4.2, reviewCount: 282 } }) });
    render(<ReviewsSection />);
    expect(await screen.findByText("Clean gym and helpful trainers.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "5 out of 5 stars" })).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /stars/ })).toHaveLength(1);
    expect(screen.getByRole("button", { name: /next reviews/i })).toBeInTheDocument();
  });
  it("renders nothing visible when there are no reviews and no rating", async () => {
    globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
    const { container } = render(<ReviewsSection />);
    await new Promise((r) => setTimeout(r, 30));
    expect(container.querySelector(".rev-card")).toBeNull();
    expect(screen.queryByText(/what members say/i)).not.toBeInTheDocument();
  });
});
