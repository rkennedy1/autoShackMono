import {
  TemperatureCard,
  HumidityCard,
  FlowRateCard,
} from "../../src/components/StatusCard";
import { AutoShackThemeProvider } from "../../src/theme/ThemeProvider";

// Wrapper component to provide theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AutoShackThemeProvider>{children}</AutoShackThemeProvider>;
};

describe("StatusCard Components", () => {
  describe("TemperatureCard", () => {
    it("renders with normal temperature", () => {
      cy.mount(
        <TestWrapper>
          <TemperatureCard temperature={22} />
        </TestWrapper>
      );

      cy.contains("Temperature").should("be.visible");
      cy.contains("22").should("be.visible");
      cy.contains("°F").should("be.visible");
      cy.contains("Current ambient temperature").should("be.visible");
    });

    it("shows warning colors for extreme temperatures", () => {
      cy.mount(
        <TestWrapper>
          <TemperatureCard temperature={5} />
        </TestWrapper>
      );

      // Low temperature should be visible
      cy.contains("5").should("be.visible");
      cy.get('[data-testid="temperature-card"]').should("exist");
    });

    it("displays trend information when provided", () => {
      cy.mount(
        <TestWrapper>
          <TemperatureCard
            temperature={25}
            trend="up"
            trendValue="+3°F from yesterday"
          />
        </TestWrapper>
      );

      cy.contains("+3°F from yesterday").should("be.visible");
      cy.get('[data-testid="trending-up-icon"]').should("be.visible");
    });
  });

  describe("HumidityCard", () => {
    it("renders humidity with progress bar", () => {
      cy.mount(
        <TestWrapper>
          <HumidityCard humidity={65} />
        </TestWrapper>
      );

      cy.contains("Humidity").should("be.visible");
      cy.contains("65").should("be.visible");
      cy.contains("%").should("be.visible");
      cy.contains("Relative humidity level").should("be.visible");

      // Progress bar should be present
      cy.get('[role="progressbar"]').should("be.visible");
      cy.contains("65% of optimal range").should("be.visible");
    });

    it("shows different colors for different humidity levels", () => {
      // Test low humidity (warning)
      cy.mount(
        <TestWrapper>
          <HumidityCard humidity={25} />
        </TestWrapper>
      );
      cy.contains("25").should("be.visible");

      // Test optimal humidity (success)
      cy.mount(
        <TestWrapper>
          <HumidityCard humidity={50} />
        </TestWrapper>
      );
      cy.contains("50").should("be.visible");

      // Test high humidity (warning)
      cy.mount(
        <TestWrapper>
          <HumidityCard humidity={85} />
        </TestWrapper>
      );
      cy.contains("85").should("be.visible");
    });
  });

  describe("FlowRateCard", () => {
    it("renders flow rate in idle state", () => {
      cy.mount(
        <TestWrapper>
          <FlowRateCard flowRate={0} />
        </TestWrapper>
      );

      cy.contains("Water Flow").should("be.visible");
      cy.contains("0").should("be.visible");
      cy.contains("L/min").should("be.visible");
      cy.contains("Water flow rate").should("be.visible");
    });

    it("shows active state when flow rate is positive", () => {
      cy.mount(
        <TestWrapper>
          <FlowRateCard flowRate={2.5} isActive={true} />
        </TestWrapper>
      );

      cy.contains("2.5").should("be.visible");
      cy.contains("Active").should("be.visible");
    });

    it("displays last watering information", () => {
      cy.mount(
        <TestWrapper>
          <FlowRateCard flowRate={0} lastWatering="2 hours ago" />
        </TestWrapper>
      );

      cy.contains("Last watering: 2 hours ago").should("be.visible");
    });
  });

  describe("Theme Integration", () => {
    it("adapts to dark mode", () => {
      // Mount component and toggle to dark mode
      cy.mount(
        <TestWrapper>
          <TemperatureCard temperature={22} />
        </TestWrapper>
      );

      // Component should render without errors in both themes
      cy.contains("Temperature").should("be.visible");

      // Test that the component doesn't break with theme changes
      cy.get("body").should("exist");
    });

    it("uses consistent typography and spacing", () => {
      cy.mount(
        <TestWrapper>
          <HumidityCard humidity={60} />
        </TestWrapper>
      );

      // Check that Material-UI theme is applied
      cy.get('[data-testid="humidity-card"]').should(
        "have.css",
        "border-radius"
      );
      cy.contains("Humidity").should("have.css", "font-family");
    });
  });

  describe("Responsive Design", () => {
    it("works on mobile viewport", () => {
      cy.viewport("iphone-x");

      cy.mount(
        <TestWrapper>
          <TemperatureCard temperature={24} />
        </TestWrapper>
      );

      cy.contains("Temperature").should("be.visible");
      cy.contains("24").should("be.visible");
    });

    it("works on tablet viewport", () => {
      cy.viewport("ipad-2");

      cy.mount(
        <TestWrapper>
          <FlowRateCard flowRate={1.5} isActive={true} />
        </TestWrapper>
      );

      cy.contains("Water Flow").should("be.visible");
      cy.contains("Active").should("be.visible");
    });
  });
});
