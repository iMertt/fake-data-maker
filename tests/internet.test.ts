import { describe, expect, it } from "vitest";
import { email, ipv4, macAddress, password, url, username } from "../src/internet";

const usernamePattern = /^[a-z0-9.]+$/;
const emailPattern = /^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,}$/;

describe("internet", () => {
  it("username matches slug pattern over many draws", () => {
    for (let i = 0; i < 50; i += 1) {
      const value = username();
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
      expect(value).toMatch(usernamePattern);
    }
  });

  it("email matches basic RFC-like pattern over many draws", () => {
    for (let i = 0; i < 50; i += 1) {
      const value = email();
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
      expect(value.includes("@")).toBe(true);
      expect(value).toMatch(emailPattern);
    }
  });

  it("url ipv4 macAddress password are non-empty and formatted", () => {
    const macRe = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
    for (let i = 0; i < 30; i += 1) {
      expect(url().startsWith("https://")).toBe(true);
      expect(ipv4().split(".").length).toBe(4);
      expect(macAddress()).toMatch(macRe);
      expect(password().length).toBeGreaterThanOrEqual(12);
    }
  });
});
