import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main headline", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /select the best plugin/i })).toBeInTheDocument();
});
