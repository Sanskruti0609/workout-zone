import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PromoAnnouncement from "./PromoAnnouncement.jsx";
import PromoHost from "./PromoHost.jsx";
import { shouldShowPromo, markPromoSeen } from "../../utils/promoStorage.js";

const promo = {
  id: 7, title: "Diwali Offer", description: "Join this week.", terms: "While stocks last.", theme: "DIWALI", emojis: null,
  ctaText: "Join now", ctaUrl: "/contact", format: "POPUP", frequency: "ONCE_PER_DAY",
  startsAt: "2026-11-01T00:00:00.000Z", endsAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-10-28T00:00:00.000Z",
};
const wrap = (ui) => <MemoryRouter>{ui}</MemoryRouter>;

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

describe("PromoAnnouncement", () => {
  it("renders a popup with title, dates, CTA, terms and a working close button", async () => {
    const onClose = vi.fn();
    render(wrap(<PromoAnnouncement promo={promo} onClose={onClose} />));
    expect(screen.getByRole("dialog", { name: "Diwali Offer" })).toBeInTheDocument();
    expect(screen.getByText(/Valid 1 Nov 2026/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Join now" })).toHaveAttribute("href", "/contact");
    expect(screen.getByText("Terms and conditions")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /close announcement/i }));
    expect(onClose).toHaveBeenCalled();
  });
  it("closes on Escape", async () => {
    const onClose = vi.fn();
    render(wrap(<PromoAnnouncement promo={promo} onClose={onClose} />));
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
  it("renders banner and card formats without a modal", () => {
    const { rerender } = render(wrap(<PromoAnnouncement promo={{ ...promo, format: "BANNER" }} onClose={() => {}} />));
    expect(screen.getByRole("region", { name: "Announcement" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(wrap(<PromoAnnouncement promo={{ ...promo, format: "CARD" }} onClose={() => {}} />));
    expect(screen.getByRole("heading", { name: "Diwali Offer" })).toBeInTheDocument();
  });
  it("omits the button when none is configured", () => {
    render(wrap(<PromoAnnouncement promo={{ ...promo, ctaText: null }} onClose={() => {}} />));
    expect(screen.queryByRole("link", { name: /join/i })).not.toBeInTheDocument();
  });
});

describe("display frequency", () => {
  it("ONCE never repeats, ONCE_PER_DAY waits a day, EVERY_VISIT always shows", () => {
    const t0 = 1_000_000_000_000;
    expect(shouldShowPromo({ ...promo, frequency: "ONCE" }, t0)).toBe(true);
    markPromoSeen({ ...promo, frequency: "ONCE" }, t0);
    expect(shouldShowPromo({ ...promo, frequency: "ONCE" }, t0 + 99 * 86400000)).toBe(false);
    markPromoSeen(promo, t0);
    expect(shouldShowPromo(promo, t0 + 3600000)).toBe(false);
    expect(shouldShowPromo(promo, t0 + 25 * 3600000)).toBe(true);
    markPromoSeen({ ...promo, frequency: "EVERY_VISIT" }, t0);
    expect(shouldShowPromo({ ...promo, frequency: "EVERY_VISIT" }, t0)).toBe(true);
  });
  it("an edited promotion is shown again", () => {
    markPromoSeen({ ...promo, frequency: "ONCE" });
    expect(shouldShowPromo({ ...promo, frequency: "ONCE", updatedAt: "2026-10-30T00:00:00.000Z" })).toBe(true);
  });
});

describe("PromoHost", () => {
  it("shows nothing when no promotion is active", async () => {
    globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: null }) });
    const { container } = render(wrap(<PromoHost />));
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
  it("shows the active promotion once, then respects the frequency", async () => {
    globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: promo }) });
    const first = render(wrap(<PromoHost />));
    expect(await screen.findByRole("dialog", { name: "Diwali Offer" })).toBeInTheDocument();
    first.unmount();
    const second = render(wrap(<PromoHost />));
    await new Promise((r) => setTimeout(r, 30));
    expect(second.container).toBeEmptyDOMElement();
  });
});
