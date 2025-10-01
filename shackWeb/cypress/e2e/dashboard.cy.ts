describe("Enhanced Dashboard", () => {
  beforeEach(() => {
    // Visit the application
    cy.visit("/");

    // Mock API responses
    cy.intercept("GET", "**/data/lastItem", {
      fixture: "lastItem.json",
    }).as("getLastItem");

    cy.intercept("GET", "**/data/lastThreeDays", {
      fixture: "lastThreeDays.json",
    }).as("getLastThreeDays");

    cy.intercept("GET", "**/schedule", {
      fixture: "scheduleItems.json",
    }).as("getSchedule");
  });

  describe("Header Functionality", () => {
    it("displays AutoShack branding and navigation", () => {
      cy.contains("AutoShack").should("be.visible");
      cy.get('[data-testid="eco-icon"]').should("be.visible");
    });

    it("shows real-time status indicators in header", () => {
      cy.wait("@getLastItem");

      // Should show temperature, humidity, and flow status
      cy.get('[data-testid="status-indicators"]').within(() => {
        cy.contains("°F").should("be.visible");
        cy.contains("%").should("be.visible");
        cy.contains(/Active|Idle/).should("be.visible");
      });
    });

    it("allows theme toggling", () => {
      // Get initial theme
      cy.get("body").then(($body) => {
        const initialBg = $body.css("background-color");

        // Click theme toggle
        cy.get('[data-testid="theme-toggle"]').click();

        // Background should change
        cy.get("body").should("not.have.css", "background-color", initialBg);

        // Toggle back
        cy.get('[data-testid="theme-toggle"]').click();
        cy.get("body").should("have.css", "background-color", initialBg);
      });
    });
  });

  describe("Status Cards", () => {
    it("displays all four status cards", () => {
      cy.wait("@getLastItem");

      // Check all status cards are present
      cy.contains("Temperature").should("be.visible");
      cy.contains("Humidity").should("be.visible");
      cy.contains("Water Flow").should("be.visible");
      cy.contains("Next Watering").should("be.visible");
    });

    it("shows temperature card with proper formatting", () => {
      cy.wait("@getLastItem");

      cy.contains("Temperature")
        .parent()
        .within(() => {
          // Should show temperature value and unit
          cy.contains(/\d+/).should("be.visible");
          cy.contains("°F").should("be.visible");
          cy.contains("Current ambient temperature").should("be.visible");
        });
    });

    it("shows humidity card with progress indicator", () => {
      cy.wait("@getLastItem");

      cy.contains("Humidity")
        .parent()
        .within(() => {
          // Should show humidity value and percentage
          cy.contains(/\d+/).should("be.visible");
          cy.contains("%").should("be.visible");
          cy.contains("Relative humidity level").should("be.visible");
          // Should have progress bar
          cy.get('[role="progressbar"]').should("be.visible");
        });
    });

    it("shows flow rate card with active/idle status", () => {
      cy.wait("@getLastItem");

      cy.contains("Water Flow")
        .parent()
        .within(() => {
          // Should show flow rate value
          cy.contains(/\d+\.?\d*/).should("be.visible");
          cy.contains("L/min").should("be.visible");
        });
    });

    it("shows next watering schedule", () => {
      cy.wait("@getSchedule");

      cy.contains("Next Watering")
        .parent()
        .within(() => {
          // Should show either a time or "Not scheduled"
          cy.contains(/\d{1,2}:\d{2}|Not scheduled/).should("be.visible");
        });
    });
  });

  describe("Chart Component", () => {
    it("displays chart with proper title and legend", () => {
      cy.wait("@getLastThreeDays");

      // Chart container should be visible
      cy.contains("Last 3 Days").should("be.visible");

      // Legend chips should be present
      cy.contains("Flow Rate").should("be.visible");
      cy.contains("Humidity").should("be.visible");
      cy.contains("Temperature").should("be.visible");
    });

    it("shows no data message when chart data is empty", () => {
      // Mock empty response
      cy.intercept("GET", "**/data/lastThreeDays", { body: [] }).as(
        "getEmptyData"
      );

      cy.reload();
      cy.wait("@getEmptyData");

      cy.contains("No data available").should("be.visible");
    });
  });

  describe("Schedule Management", () => {
    it("displays schedule in enhanced card format", () => {
      cy.wait("@getSchedule");

      cy.contains("Shack Schedule").should("be.visible");
      cy.contains("Add New Schedule").should("be.visible");
    });

    it("allows adding new schedule items", () => {
      cy.wait("@getSchedule");

      // Mock the add schedule API
      cy.intercept("POST", "**/schedule/add", {
        statusCode: 200,
        body: { id: 123, start_hour: 8, duration: 30 },
      }).as("addSchedule");

      cy.contains("Add New Schedule").click();

      // Should add a new schedule item to the UI
      cy.get('[id^="startTimeInput"]').should("have.length.at.least", 1);
    });
  });

  describe("Responsive Design", () => {
    it("adapts to mobile viewport", () => {
      cy.viewport("iphone-x");

      // Status cards should stack vertically on mobile
      cy.get('[data-testid="status-cards"]').should("be.visible");

      // Chart should be responsive
      cy.contains("Last 3 Days").should("be.visible");

      // Mobile-specific elements should be hidden/shown appropriately
      cy.get('[data-testid="mobile-hidden"]').should("not.be.visible");
    });

    it("works well on tablet viewport", () => {
      cy.viewport("ipad-2");

      // All components should be visible and properly sized
      cy.contains("AutoShack").should("be.visible");
      cy.contains("Temperature").should("be.visible");
      cy.contains("Last 3 Days").should("be.visible");
      cy.contains("Shack Schedule").should("be.visible");
    });
  });

  describe("Loading States", () => {
    it("shows loading skeletons while data loads", () => {
      // Add delay to API responses to see loading states
      cy.intercept("GET", "**/data/lastItem", {
        delay: 1000,
        fixture: "lastItem.json",
      }).as("getLastItemSlow");

      cy.visit("/");

      // Should show skeleton components
      cy.get('[data-testid="loading-skeleton"]').should("be.visible");

      cy.wait("@getLastItemSlow");

      // Loading should disappear
      cy.get('[data-testid="loading-skeleton"]').should("not.exist");
    });
  });

  describe("Error Handling", () => {
    it("handles API errors gracefully", () => {
      // Mock API failure
      cy.intercept("GET", "**/data/lastItem", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("getLastItemError");

      cy.visit("/");
      cy.wait("@getLastItemError");

      // Should show error message
      cy.contains("Failed to load dashboard data").should("be.visible");
    });
  });
});
