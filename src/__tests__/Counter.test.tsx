import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "../Counter";

test("increments count when button is clicked", () => {
    
    render(<Counter />);

  // Find the button
  const button = screen.getByRole("button", { name: /count is 0/i });

  // Click it once
  fireEvent.click(button);
  expect(button).toHaveTextContent("count is 1");

  // Click it again
  fireEvent.click(button);
  expect(button).toHaveTextContent("count is 2");
});
