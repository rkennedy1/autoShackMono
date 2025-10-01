// Jest provides describe, it, expect, beforeEach globally
import { render, screen, fireEvent } from "@testing-library/react";
import { AutoShackThemeProvider, useTheme } from "../ThemeProvider";
import { Button } from "@mui/material";

// Test component to access theme context
const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme-mode">{isDarkMode ? "dark" : "light"}</span>
      <Button onClick={toggleTheme} data-testid="toggle-button">
        Toggle Theme
      </Button>
    </div>
  );
};

describe("AutoShackThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    jest.clearAllMocks();
  });

  it("provides light theme by default", () => {
    render(
      <AutoShackThemeProvider>
        <TestComponent />
      </AutoShackThemeProvider>
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("light");
  });

  it("toggles between light and dark themes", () => {
    render(
      <AutoShackThemeProvider>
        <TestComponent />
      </AutoShackThemeProvider>
    );

    const themeDisplay = screen.getByTestId("theme-mode");
    const toggleButton = screen.getByTestId("toggle-button");

    // Should start with light theme
    expect(themeDisplay).toHaveTextContent("light");

    // Toggle to dark theme
    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent("dark");

    // Toggle back to light theme
    fireEvent.click(toggleButton);
    expect(themeDisplay).toHaveTextContent("light");
  });

  it("saves theme preference to localStorage", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <AutoShackThemeProvider>
        <TestComponent />
      </AutoShackThemeProvider>
    );

    const toggleButton = screen.getByTestId("toggle-button");

    // Toggle to dark theme
    fireEvent.click(toggleButton);

    // Should save to localStorage
    expect(setItemSpy).toHaveBeenCalledWith("autoShackTheme", "dark");

    setItemSpy.mockRestore();
  });

  it("loads saved theme preference from localStorage", () => {
    // Mock localStorage to return dark theme
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue("dark");

    render(
      <AutoShackThemeProvider>
        <TestComponent />
      </AutoShackThemeProvider>
    );

    expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark");
    
    getItemSpy.mockRestore();
  });

  it("throws error when useTheme is used outside provider", () => {
    // Temporarily suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });

  it("applies theme to child components", () => {
    render(
      <AutoShackThemeProvider>
        <div data-testid="themed-content">Content</div>
      </AutoShackThemeProvider>
    );

    // The content should be rendered (theme application is tested through visual/integration tests)
    expect(screen.getByTestId("themed-content")).toBeInTheDocument();
  });
});
