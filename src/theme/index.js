import { createTheme } from "@mui/material";

// DEFAULT LIGHT THEME
export const theme = createTheme({
  palette: {
    mode: "light", // Enforce light theme
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Enforce light theme scrollbars
          scrollbarColor: "#888 #fff",
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#bbb",
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&:focus, &:focus-visible": {
            outline: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&:focus-within": {
            outline: "none",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});