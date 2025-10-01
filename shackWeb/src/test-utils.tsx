import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AutoShackThemeProvider } from "./theme/ThemeProvider";

// Custom render function that includes theme provider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AutoShackThemeProvider>{children}</AutoShackThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
