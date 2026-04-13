"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F4F2EF",
      paper: "#E8E6E3",
    },
    text: {
      primary: "#2F2F2F",
      secondary: "#6B6B6B",
    },
    primary: {
      main: "#6C7A89",
      light: "#8A97A6",
      dark: "#4F5B66",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#E8E6E3",
          transition: "background-color 0.2s ease, transform 0.2s ease",
          "&:hover": {
            backgroundColor: "#E8E6E3",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#6C7A89",
          "&:hover": { color: "#8A97A6" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#6C7A89",
          "&:hover": { backgroundColor: "#8A97A6" },
          "&:active": { backgroundColor: "#4F5B66" },
        },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
