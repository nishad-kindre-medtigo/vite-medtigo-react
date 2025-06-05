import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { CssBaseline, ThemeProvider, StyledEngineProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Auth from "./components/Auth";
import ScrollReset from "./components/ScrollReset";
import RoutesConfig from "./Routes";
import ContextWrapper from "./context";
import history from "./utils/history";
import { CONNECT_URL } from "./settings";
import { theme } from "./theme";

function App() {
  const params = new URLSearchParams(window.location.search);
  const URL = window.location.href;
  const [access, setAccess] = useState(true);

  if (
    params.get("hospitalId") &&
    params.get("departmentId") &&
    params.get("scheduleId")
  ) {
    const hosp = params.get("hospitalId");
    const depart = params.get("departmentId");
    const sch = params.get("scheduleId");
    localStorage.setItem("hospitalId", hosp);
    localStorage.setItem("departmentId", depart);
    localStorage.setItem("scheduleId", sch);
  }

  if (params.get("data") === "/redirect/checkout") {
    localStorage.setItem("add-to-cart", params.get("add-to-cart"));
    const lang = params.get("lang");
    if (lang) {
      localStorage.setItem("lang", lang);
    }
    window.location.href = `https://${CONNECT_URL}/redirect/checkout`;
  }

  if (
    params.get("data") === "/state-licensing" &&
    params.get("email") &&
    params.get("route") &&
    params.get("platform")
  ) {
    localStorage.setItem("data", params.get("data"));
    sessionStorage.setItem("email", params.get("email"));
    sessionStorage.setItem("route", params.get("route"));
    sessionStorage.setItem("platform", params.get("platform"));
  }

  if (URL.includes("reset")) {
    localStorage.setItem("reset", "security");
    localStorage.setItem("medtigo", true);
  }

  if (params.get("path") === "certificates") {
    localStorage.setItem("certificateType", "certificates");
    window.location.href = `${CONNECT_URL}/certificates`;
  }
  
  if (params.get("path") === "cme") {
    localStorage.setItem("certificateType", "cme");
    window.location.href = `${CONNECT_URL}/certificates`;
  }

  const checkDomain = () => {
    try {
      const whitelisted = ["medtigo", "localhost", "connect.medtigo.com"];
      // we have to check the current domain
      if (
        whitelisted.includes(window.parent.location.hostname) ||
        whitelisted.includes(window.parent.location.hostname.split(".")[1])
      ) {
        // if the domain is correct we are good to go
        return setAccess(true);
      }
    } catch (err) {
      // otherwise ACCESS DENIED"
      setAccess(false);
      return;
    }
  };

  useEffect(() => {
    checkDomain();

    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("data");
    });
    return () => {
      window.removeEventListener("beforeunload", () => {
        localStorage.removeItem("data");
      });
      sessionStorage.clear();
      localStorage.removeItem("data");
    };
  }, []);

  if (!access) {
    return <></>;
  } else {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <SnackbarProvider maxSnack={1}>
              <Router history={history}>
                <Auth>
                  <ContextWrapper>
                    <ScrollReset />
                    <RoutesConfig />
                  </ContextWrapper>
                </Auth>
              </Router>
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

export default App;
