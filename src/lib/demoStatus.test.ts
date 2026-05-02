import { describe, expect, it } from "vitest";
import { getStatusTone, matchesStatusSearch } from "./demoStatus";
import type { AppointmentStatus } from "./demoAppointments";

describe("demo status helpers", () => {
  it("maps appointment statuses to tones", () => {
    expect(getStatusTone("pending")).toBe("warning");
    expect(getStatusTone("inProgress")).toBe("primary");
    expect(getStatusTone("cancelled")).toBe("danger");
    expect(getStatusTone("approved")).toBe("success");
    expect(getStatusTone("completed")).toBe("success");
  });

  it("matches status labels by search query", () => {
    const labels: Record<AppointmentStatus, string> = {
      pending: "Onay Bekliyor",
      inProgress: "İşlemde",
      approved: "Onaylandı",
      cancelled: "İptal",
      completed: "Tamamlandı",
    };
    expect(matchesStatusSearch("pending", "onay", labels)).toBe(true);
    expect(matchesStatusSearch("cancelled", "tamam", labels)).toBe(false);
  });
});
