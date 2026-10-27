import { describe, it, expect } from "vitest";
import { getDashboardRoute } from "./useNavigation";

describe("getDashboardRoute", () => {
  it("routes each role to its dashboard", () => {
    expect(getDashboardRoute("APPLICANT")).toBe("/app/dashboard");
    expect(getDashboardRoute("EMPLOYER")).toBe("/employer/dashboard");
    expect(getDashboardRoute("ADMIN")).toBe("/admin/dashboard");
  });

  it("falls back to the applicant dashboard for unknown roles", () => {
    expect(getDashboardRoute("UNKNOWN" as never)).toBe("/app/dashboard");
  });
});
