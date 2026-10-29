import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EnquiryForm from "./EnquiryForm.jsx";

it("shows validation errors and does not submit invalid data", async () => {
  const fetchMock = vi.fn();
  globalThis.fetch = fetchMock;
  render(<EnquiryForm />);
  await userEvent.click(screen.getByRole("button", { name: /send enquiry/i }));
  expect(await screen.findByText(/enter your name/i)).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});

it("submits a valid enquiry and shows a success message", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: { received: true } }) });
  globalThis.fetch = fetchMock;
  render(<EnquiryForm defaultType="MEMBERSHIP" />);
  await userEvent.type(screen.getByLabelText(/full name/i), "Test User");
  await userEvent.type(screen.getByLabelText(/^phone/i), "+91 98765 43210");
  await userEvent.click(screen.getByRole("button", { name: /send enquiry/i }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).enquiryType).toBe("MEMBERSHIP");
  expect(await screen.findByText(/has been received/i)).toBeInTheDocument();
});
