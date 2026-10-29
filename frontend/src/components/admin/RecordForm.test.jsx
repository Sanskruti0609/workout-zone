import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecordForm, { toForm, toPayload, isoToLocal } from "./RecordForm.jsx";

const fields = [
  { name: "title", label: "Title" },
  { name: "startsAt", label: "Starts", type: "datetime", default: () => "2026-11-01T09:00:00.000Z" },
  { name: "url", label: "Photo or video", type: "upload", mediaTypeField: "mediaType" },
  { name: "mediaType", label: "Type", type: "select", default: "IMAGE", options: [["IMAGE", "Photo"], ["VIDEO", "Video"]] },
  { name: "isActive", label: "Published", type: "checkbox", default: false },
];

it("converts dates between the browser's local format and ISO", () => {
  const iso = "2026-11-01T09:00:00.000Z";
  const local = isoToLocal(iso);
  expect(local).toMatch(/^2026-11-0[01]T\d\d:\d\d$/);
  expect(toPayload(fields, { ...toForm(fields, null), startsAt: local }).startsAt).toBe(iso);
});

it("uploads a chosen file, fills in the link and detects video", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: { url: "/uploads/x.mp4", mediaType: "VIDEO", size: 10 } }) });
  const onSubmit = vi.fn().mockResolvedValue();
  render(<RecordForm fields={fields} item={null} onSubmit={onSubmit} />);
  await userEvent.type(screen.getByLabelText("Title"), "Treadmills");
  await userEvent.upload(screen.getByLabelText(/choose a file to upload/i), new File(["x"], "x.mp4", { type: "video/mp4" }));
  await waitFor(() => expect(screen.getByLabelText("Type")).toHaveValue("VIDEO"));
  const [, opts] = globalThis.fetch.mock.calls[0];
  expect(opts.headers["X-Requested-With"]).toBe("WorkoutZoneAdmin");
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(onSubmit.mock.calls[0][0]).toMatchObject({ title: "Treadmills", url: "/uploads/x.mp4", mediaType: "VIDEO", isActive: false });
});

it("offers a preview of the unsaved values", async () => {
  const onPreview = vi.fn();
  render(<RecordForm fields={fields} item={null} onSubmit={() => {}} onPreview={onPreview} />);
  await userEvent.type(screen.getByLabelText("Title"), "Offer");
  await userEvent.click(screen.getByRole("button", { name: "Preview" }));
  expect(onPreview.mock.calls[0][0].title).toBe("Offer");
});
