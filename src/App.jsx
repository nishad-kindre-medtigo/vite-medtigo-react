/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Auth from "./components/Auth";
import ScrollReset from "./components/ScrollReset";
import RoutesConfig from "./Routes";
import { CertificatesContextProvider } from "./context/CertificatesContext";
import { LearningContextProvider } from "./context/LearningContext";
import { StaffingContextProvider } from "./context/StaffingContext";
import { MyLearningDataProvider } from "./context/MyLearningContext";
import { LicenseContextProvider } from "./context/LicenseContext";
import { ReportFilterContextProvider } from "./context/ReportFilterContext";
import history from "./utils/history";
import { CONNECT_URL } from "./settings";

const theme = createTheme();

function App() {
  const params = new URLSearchParams(window.location.search);
  const URL = window.location.href;

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

  if (URL.includes("feedback")) {
    localStorage.setItem("open_route", true);
  }
  if (URL.includes("courses")) {
    localStorage.setItem("open_route", true);
  }
  if (URL.includes("onBoardingResendEmail")) {
    localStorage.setItem("open_route", true);
  }

  if (URL.includes("taskResponse")) {
    localStorage.setItem("open_route", true);
  }

  if (URL.includes("imageViewer")) {
    localStorage.setItem("open_route", true);
  }

  if (URL.includes("clerk-chat-consent")) {
    localStorage.setItem("open_route", true);
  }

  if (params.get("path") === "certificates") {
    localStorage.setItem("certificateType", "certificates");
    window.location.href = `${CONNECT_URL}/certificates`;
  }
  if (params.get("path") === "cme") {
    localStorage.setItem("certificateType", "cme");
    window.location.href = `${CONNECT_URL}/certificates`;
  }

  const [ok, _setOk] = React.useState(true);
  React.useEffect(() => {
    try {
      const whitelisted = [
        "medtigo",
        "localhost",
        "connect.medtigo.com",
        "qa.medtigo.com",
      ];
      // we have to check the current domain
      if (
        whitelisted.includes(window.parent.location.hostname) ||
        whitelisted.includes(window.parent.location.hostname.split(".")[1])
      ) {
        // if the domain is correct we are good to go
        return _setOk(false);
      }
    } catch (err) {
      // otherwise ACCESS DENIED"
      return;
    }

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

  if (ok) {
    return <></>;
  } else {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <SnackbarProvider maxSnack={1}>
              <Router history={history}>
                <Auth>
                  <CertificatesContextProvider>
                    <LearningContextProvider>
                      <StaffingContextProvider>
                        <LicenseContextProvider>
                          <MyLearningDataProvider>
                            <ReportFilterContextProvider>
                              <ScrollReset />
                              <RoutesConfig />
                            </ReportFilterContextProvider>
                          </MyLearningDataProvider>
                        </LicenseContextProvider>
                      </StaffingContextProvider>
                    </LearningContextProvider>
                  </CertificatesContextProvider>
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
