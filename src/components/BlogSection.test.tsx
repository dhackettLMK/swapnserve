import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BlogSection from "./BlogSection";

describe("homepage article date selection", () => {
  it("selects the three most recent publication dates", () => {
    const { container } = render(<MemoryRouter><BlogSection /></MemoryRouter>);
    const publicationDates = Array.from(container.querySelectorAll("time"), element => element.dateTime);
    expect(publicationDates).toEqual(["2026-11-08", "2026-10-31", "2026-04-11"]);
  });
});