import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { GMAIL_API_ENDPOINT } from "@/utils/gmailService";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="r3f-canvas-mock">{children}</div>
  ),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Float: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  OrbitControls: () => null,
  RoundedBox: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

describe("Phase 11 Black Box Testing Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("tc_p11_01_activates_mobile_3d_lite_optimization_only_on_mobile_viewports", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 390,
    });
    window.dispatchEvent(new Event("resize"));

    render(<HomePage />);

    expect(
      screen.getByTestId("card-3d-canvas").getAttribute("data-mobile-optimized")
    ).toBe("true");

    act(() => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event("resize"));
    });

    expect(
      screen.getByTestId("card-3d-canvas").getAttribute("data-mobile-optimized")
    ).toBe("false");
  });

  it("tc_p11_02_toggles_collapsible_sidebar_and_operates_language_and_theme_toggles_inside_sidebar", () => {
    render(<HomePage />);

    const sidebar = screen.getByTestId("collapsible-sidebar");
    const toggleBtn = screen.getByTestId("btn-sidebar-toggle");

    expect(sidebar.getAttribute("data-open")).toBe("false");

    fireEvent.click(toggleBtn);
    expect(sidebar.getAttribute("data-open")).toBe("true");
    expect(screen.getByTestId("sidebar-backdrop")).toBeInTheDocument();

    const langToggle = screen.getByTestId("btn-lang-toggle");
    const themeToggle = screen.getByTestId("btn-theme-toggle");
    expect(sidebar).toContainElement(langToggle);
    expect(sidebar).toContainElement(themeToggle);

    fireEvent.click(langToggle);
    expect(screen.getByTestId("status-badge")).toHaveTextContent(
      "Open for Part-time & Freelance"
    );

    fireEvent.click(themeToggle);
    expect(screen.getByTestId("theme-container")).toHaveClass("bg-[#0D0F12]");
    expect(themeToggle).toHaveAttribute("data-theme-state", "dark");

    fireEvent.click(screen.getByTestId("btn-sidebar-close"));
    expect(sidebar.getAttribute("data-open")).toBe("false");
  });

  it("tc_p11_03_builds_direct_gmail_compose_url_with_hrd_recruitment_and_sender_email", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-inquiry-recruitment"));
    fireEvent.change(screen.getByTestId("input-client-name"), {
      target: { value: "HRD Tokopedia" },
    });
    fireEvent.change(screen.getByTestId("input-client-email"), {
      target: { value: "talent@tokopedia.com" },
    });
    fireEvent.change(screen.getByTestId("input-project-notes"), {
      target: { value: "Offering posisi Mobile Developer" },
    });

    const href =
      screen.getByTestId("btn-send-email").getAttribute("href") ?? "";
    expect(href.startsWith("https://mail.google.com/mail/?view=cm&fs=1")).toBe(
      true
    );
    expect(href).toContain("ahmadmuliasaputra1%40gmail.com");
    expect(href).toContain("talent%40tokopedia.com");
  });

  it("tc_p11_04_dispatches_direct_gmail_api_request_to_google_apps_script_endpoint", async () => {
    expect(GMAIL_API_ENDPOINT).toBe(
      "https://script.google.com/macros/s/AKfycbwRvh7ZkZ5XEhVB1VA_rG08x4NVayVkrsCUi5PMvggdC6j6GlR2LHh7afbi59NWKGA2/exec"
    );

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    }) as unknown as typeof fetch;

    render(<HomePage />);

    fireEvent.change(screen.getByTestId("input-client-name"), {
      target: { value: "PT Nusantara" },
    });
    fireEvent.change(screen.getByTestId("input-client-email"), {
      target: { value: "ceo@nusantara.id" },
    });
    fireEvent.change(screen.getByTestId("input-project-notes"), {
      target: { value: "Pembuatan aplikasi Android" },
    });

    fireEvent.click(screen.getByTestId("btn-send-gmail-api"));

    await waitFor(() => {
      expect(screen.getByTestId("email-dispatch-status")).toHaveTextContent(
        "Gmail"
      );
    });

    expect(global.fetch).toHaveBeenCalledWith(
      GMAIL_API_ENDPOINT,
      expect.any(Object)
    );
  });

  it("tc_p11_05_prevents_empty_email_submission_and_shows_validation_feedback", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByTestId("btn-send-gmail-api"));

    const status = screen.getByTestId("email-dispatch-status");
    expect(status).toBeVisible();
    expect(status.textContent?.length).toBeGreaterThan(0);
  });

  it("tc_p11_06_unmounts_custom_cursor_and_skips_mouse_listeners_on_mobile_and_touch_devices", () => {
    const addListenerSpy = vi.spyOn(window, "addEventListener");

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { unmount } = render(<HomePage />);
    expect(screen.queryByTestId("custom-cursor")).toBeNull();
    expect(
      addListenerSpy.mock.calls.some(([event]) => event === "mousemove")
    ).toBe(false);
    unmount();

    addListenerSpy.mockClear();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1280,
    });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: query === "(pointer: coarse)" || query === "(hover: none)",
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    const { unmount: unmountTouch } = render(<HomePage />);
    expect(screen.queryByTestId("custom-cursor")).toBeNull();
    unmountTouch();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      writable: true,
      configurable: true,
      value: 5,
    });

    const { unmount: unmountMaxTouch } = render(<HomePage />);
    expect(screen.queryByTestId("custom-cursor")).toBeNull();
    unmountMaxTouch();

    Object.defineProperty(navigator, "maxTouchPoints", {
      writable: true,
      configurable: true,
      value: 0,
    });
    render(<HomePage />);
    const cursor = screen.getByTestId("custom-cursor");
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass("hidden", "md:block", "pointer-events-none");
  });

  it("tc_p11_07_scales_down_meridian_globe_background_and_container_on_mobile_viewports", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<HomePage />);

    const globeBg = screen.getByTestId("neural-globe-bg");
    const meridiansContainer = screen.getByTestId("y2k-globe-meridians");
    const globeGroup = screen.getByTestId("meridian-globe-group");

    expect(globeBg).toHaveAttribute("data-mobile-optimized", "true");
    expect(globeBg).toHaveAttribute("data-camera-z", "7.2");
    expect(globeBg).toHaveAttribute("data-globe-scale", "0.52");
    expect(globeBg).toHaveClass(
      "opacity-25",
      "md:opacity-55",
      "w-[260px]",
      "h-[260px]",
      "sm:w-[340px]",
      "sm:h-[340px]",
      "md:w-full",
      "md:h-full",
      "mx-auto",
      "my-auto"
    );
    expect(meridiansContainer).toHaveClass(
      "w-[260px]",
      "h-[260px]",
      "sm:w-[340px]",
      "sm:h-[340px]",
      "md:w-full",
      "md:h-full",
      "mx-auto",
      "my-auto"
    );
    expect(globeGroup).toHaveAttribute("data-globe-scale", "0.52");

    act(() => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event("resize"));
    });

    expect(globeBg).toHaveAttribute("data-mobile-optimized", "false");
    expect(globeBg).toHaveAttribute("data-camera-z", "4.5");
    expect(globeBg).toHaveAttribute("data-globe-scale", "1");
    expect(globeGroup).toHaveAttribute("data-globe-scale", "1");
  });
});
