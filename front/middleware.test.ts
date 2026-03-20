import { getRedirectPath } from "./middleware-logic";

describe("getRedirectPath", () => {
  it("redirige a /login si no hay token y accede a /chat", () => {
    const result = getRedirectPath({ pathname: "/chat", token: undefined });
    expect(result).toBe("/login");
  });

  it("redirige a /chat si ya hay token y accede a /login", () => {
    const result = getRedirectPath({ pathname: "/login", token: "abc" });
    expect(result).toBe("/chat");
  });

  it("no redirige si accede a /chat con token", () => {
    const result = getRedirectPath({ pathname: "/chat", token: "abc" });
    expect(result).toBeNull();
  });

  it("no redirige si accede a /login sin token", () => {
    const result = getRedirectPath({ pathname: "/login", token: undefined });
    expect(result).toBeNull();
  });
});
