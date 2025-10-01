import React from "react";
import { Box } from "@mui/material";
import { AutoShackThemeProvider } from "./theme/ThemeProvider";
import AppHeader from "./components/AppHeader";
import EnhancedDashboard from "./pages/EnhancedDashboard";

function App() {
  return (
    <AutoShackThemeProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppHeader />
        <Box
          component="main"
          sx={{ flexGrow: 1, backgroundColor: "background.default" }}
        >
          <EnhancedDashboard />
        </Box>
      </Box>
    </AutoShackThemeProvider>
  );
}

export default App;
