import { describe, expect, it } from "vitest";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "./security";

describe("security sanitizers", () => {
  it("normalizes text input", () => {
    expect(sanitizeText("  Hello   world \n\t test  ")).toBe("Hello world test");
  });

  it("lowercases and trims email", () => {
    expect(sanitizeEmail("  USER@Example.COM ")).toBe("user@example.com");
  });

  it("drops unsupported phone chars", () => {
    expect(sanitizePhone("+90 (555) 123-45a67<script>")).toBe("+90 (555) 123-4567");
  });
});
