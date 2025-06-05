import React from "react";
import { UserDataProvider } from "./UserDataContext";
import { CertificatesContextProvider } from "./CertificatesContext";
import { LearningContextProvider } from "./LearningContext";
import { StaffingContextProvider } from "./StaffingContext";
import { MyLearningDataProvider } from "./MyLearningContext";
import { LicenseContextProvider } from "./LicenseContext";
import { ReportFilterContextProvider } from "./ReportFilterContext";

const ContextWrapper = ({ children }) => {
  return (
    <UserDataProvider>
      <CertificatesContextProvider>
        <LearningContextProvider>
          <StaffingContextProvider>
            <LicenseContextProvider>
              <MyLearningDataProvider>
                <ReportFilterContextProvider>
                  {children}
                </ReportFilterContextProvider>
              </MyLearningDataProvider>
            </LicenseContextProvider>
          </StaffingContextProvider>
        </LearningContextProvider>
      </CertificatesContextProvider>
    </UserDataProvider>
  );
};

export default ContextWrapper;
