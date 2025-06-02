import * as React from 'react';
import { useOpenSnackbar } from '../hooks/useOpenSnackbar';
import { useSelector } from 'react-redux';
import certificatesService from '../services/certificatesService';
import orderServices from '../services/orderServices';
import calculateCreditPoints from '../utils/calculateCreditPoints';
import alertPage from '../services/alertPage';
import { groupBy } from 'lodash';

export const CertificatesContext = React.createContext({});

export const CertificatesContextProvider = ({ children }) => {
  const user = useSelector(state => state.account.user);
  const openSnackbar = useOpenSnackbar();
  const [drawerStatus, setDrawerStatus] = React.useState(false); // Certificate Add/ Edit Drawer
  const [addedCertificate, setAddedCertificate] = React.useState(0); // Ref to trigger fetchData useEffect
  const [activeTab, setActiveTab] = React.useState(0); // NOT IN USE
  const [activeCertificateData, setActiveCertificateData] = React.useState({}); // Save data when clicked on Add or Edit Certificate
  const [isEdit, setIsEdit] = React.useState(false); // Store current mode for Certificate Drawer
  const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false);
  const [highlightedCertID, setHighlightedCertID] = React.useState(null);

  const [isLoading, setIsLoading] = React.useState(false); // Loading State till Certificates Data is fetched
  const [certificatesData, setCertificatesData] = React.useState([]); // In Certificates Tacker
  const [grantedLicenses, setGrantedLicenses] = React.useState([]); // In State License Monitoring Section
  const [CMECertificatesData, setCMECertificatesData] = React.useState([]); // In CME Compliance Tracker
  const [latestCertIds, setLatestCertIds] = React.useState([]);

  // For Dashboard Certificates Card
  const [generatedCertificates, setGeneratedCertificates] = React.useState([]); // User Generated Certificates
  const [addedCertificates, setAddedCertificates] = React.useState([]); // Certificates Added by User from Frontend
  const [oldCertificates, setOldCertificates] = React.useState([]); // Old User Generated Certificates

  const [deaCertificates, setDEACertificates] = React.useState([]); // DEA Certificates
  const [stateCSRCertificates, setStateCSRCertificates] = React.useState([]); // State CSR Certificates

  const [oldFullAccessOrder, setOldFullAccessOrder] = React.useState({}); // Store if old dull access order exists for user

  const [creditPoints, setCreditPoints] = React.useState(0); // Total Credit Points of All CME Certificates

  // For Dashboard CME Compliance Card
  const [claimedCreditPoints, setClaimedCreditPoints] = React.useState(0); // Total of CME Certificates Credits having entered_from_frontend = 0
  const [userAddedCreditPoints, setUserAddedCreditPoints] = React.useState(0); // Total of CME Certificates Credits having entered_from_frontend = 1

  // For Send Mail Popup
  const [recipientEmails, setRecipientEmails] = React.useState([]);
  const [sendACopy, setSendACopy] = React.useState({});

  // To Hide the TabPanel in Monitoring & Renewal Section for multiple pages
  const [hideTabPanel, setHideTabPanel] = React.useState(false);

  const fetchDummyCertificates = async () => {
    const dummyCertificates = await certificatesService.getDummyCertificates();
    return dummyCertificates;
  };

  const fetchClinicalCertificates = async () => {
    try {
      if (!user) return; // Skip if no user data is present
      let certificatesData = await certificatesService.getUserCertificates();
      const data = certificatesData.sort(function (a, b) { return b.entered_from_frontend - a.entered_from_frontend }).reverse();

      setCertificatesData(data);

      // Filter only medtigo course provider cards
      const filteredCertificates = data.filter(item => item.entered_from_frontend === 0 && item.state === 'Education');

      // Group filtered certificates by certificate_name
      const groupedCertificates = groupBy(filteredCertificates, 'certificate_name');

      // Combine the certificate with the latest Date_of_Creation from each group
      const firstCertificates = Object.values(groupedCertificates).map(certificates =>
        certificates.sort((a, b) => new Date(b.Date_of_Creation) - new Date(a.Date_of_Creation))[0]
      );

      // Exclude the latest certificate for each course based on Date_of_Creation
      const oldCertificates = Object.values(groupedCertificates)
        .flatMap(certificates =>
          certificates
            .filter(cert => cert.entered_from_frontend === 0) // Exclude certificates with entered_from_frontend = 1
            .sort((a, b) => new Date(b.Date_of_Creation) - new Date(a.Date_of_Creation)) // Sort by Date_of_Creation in descending order
            .slice(1) // Exclude the latest certificate
        )
        .filter(item => !item.certificate_name.includes('License'));

      const states = ['Education', 'Health', 'Malpractice', 'Transcripts and Scores', 'Transcripts & Scores'];

      setGeneratedCertificates(firstCertificates);
      setAddedCertificates(data.filter(certificate => certificate.entered_from_frontend === 1 && states.includes(certificate.state)));
      setOldCertificates(oldCertificates);
    } catch (error) {
      console.log(error);
      setCertificatesData([]);
    }
  };

  const fetchMonitoringStateLicenses = async () => {
    try {
      if (!user) return; // Skip if no user data is present
      const { data: grantedData } = await alertPage.getGrantedActiveLicenses(user.id);
      setGrantedLicenses(grantedData);
    } catch (error) {
      console.log(error);
      setGrantedLicenses([]);
    }
  };

  const fetchCMECertificates = async () => {
    try {
      if (!user) return; // Skip if no user data is present
      const CMECertificatesData = await certificatesService.getUserCertificates('cme');
      setCMECertificatesData(CMECertificatesData);
      setCreditPoints(calculateCreditPoints(CMECertificatesData));
      setClaimedCreditPoints(calculateCreditPoints(CMECertificatesData.filter(item => item.entered_from_frontend === 0)));
      setUserAddedCreditPoints(calculateCreditPoints(CMECertificatesData.filter(item => item.entered_from_frontend === 1)));
    } catch (error) {
      console.log(error);
      setCMECertificatesData([]);
      setCreditPoints(0);
    }
  };

  const fetchDEACertificates = async () => {
    try {
      if (!user) return; // Skip if no user data is present
      const data = await certificatesService.getDEACertificates();
      setDEACertificates(data);
    } catch (error) {
      console.log(error);
      setDEACertificates([]);
    }
  };

  const fetchStateCSRCertificates = async () => {
    try {
      if (!user) return; // Skip if no user data is present
      const data = await certificatesService.getStateCSRCertificates();
      setStateCSRCertificates(data);
    } catch (error) {
      console.log(error);
      setStateCSRCertificates([]);
    }
  };

  const fetchOldFullAccessOrder = async () => {
    try {
      const fullAccessOrder = await orderServices.isFullAccessOrder();
      setOldFullAccessOrder(fullAccessOrder);
    } catch (error) {
      console.log(error);
      setOldFullAccessOrder({});
    }
  }

  // OBJECT TO RUN FETCH DATA METHODS BASED ON CURRENT PAGE - FOR EDIT, DELETE & ADD CERTIFICATE ACTIONS
  const METHODS = {
    'CE/CME': fetchCMECertificates,
    'STATE LICENSE': fetchMonitoringStateLicenses,
    'DEA': fetchDEACertificates,
    'STATE CSR/CSC': fetchStateCSRCertificates,
    'CLINICAL CERTIFICATE': fetchClinicalCertificates
  };

  const fetchData = async () => {
    setIsLoading(true);
    fetchClinicalCertificates();
    fetchMonitoringStateLicenses();
    fetchCMECertificates();
    fetchDEACertificates();
    fetchStateCSRCertificates();
    fetchOldFullAccessOrder();
    setIsLoading(false);
  };

  const handleSendEmail = async (emails, sendACopy, isCME, shouldEmailCmeCredits, shouldEmailCertificate) => {
    try {
      if (isCME) {
        if (shouldEmailCmeCredits) {
          await certificatesService.sendCertificateEmail(
            { recipients: emails.join(','), sendACopy, isCME: true },
            activeCertificateData['id']
          );
        }
        if (shouldEmailCertificate) {
          await certificatesService.sendCertificateEmail(
            { recipients: emails.join(','), sendACopy, isCME: false },
            activeCertificateData['nonCMECertId']
          );
        }
        openSnackbar('Email(s) sent to recipients.');
        return;
      }
      await certificatesService.sendCertificateEmail(
        {
          recipients: emails.join(','),
          sendACopy,
          isCME:
            activeCertificateData['type'] === 'CME' ||
            activeCertificateData['type'] === 'cme'
        },
        activeCertificateData['id']
      );
      openSnackbar('Email(s) sent to recipients.');
    } catch (error) {
      openSnackbar('Oops! An error occurred while sending emails.', 'error');
    }
  };

  // Fetch Certificates on Component Mount & whenever a new Certificate is added from frontend or system generated
  React.useEffect(() => {
    fetchData();
  }, []);

  // Update Total CME Credit Points every time a CME Certificate is either claimed or added from frontend
  React.useEffect(() => {
    setCreditPoints(calculateCreditPoints(CMECertificatesData));
  }, [CMECertificatesData]);

  const defaultContext = {
    drawerStatus,
    setDrawerStatus,
    fetchData,
    isLoading,
    setIsLoading,
    METHODS,
    fetchCMECertificates,
    fetchMonitoringStateLicenses,
    fetchDEACertificates,
    fetchStateCSRCertificates,
    fetchClinicalCertificates,
    certificatesData,
    grantedLicenses,
    CMECertificatesData,
    generatedCertificates,
    addedCertificates,
    oldCertificates,
    deaCertificates,
    stateCSRCertificates,
    oldFullAccessOrder,
    latestCertIds,
    setLatestCertIds,
    setCreditPoints,
    creditPoints,
    claimedCreditPoints,
    userAddedCreditPoints,
    addedCertificate,
    setAddedCertificate,
    activeCertificateData,
    setActiveCertificateData,
    isEdit,
    setIsEdit,
    setIsEmailDialogOpen,
    isEmailDialogOpen,
    handleSendEmail,
    highlightedCertID,
    setHighlightedCertID,
    activeTab,
    setActiveTab,
    fetchDummyCertificates,
    recipientEmails,
    setRecipientEmails,
    sendACopy,
    setSendACopy,
    hideTabPanel,
    setHideTabPanel
  };

  return (
    <CertificatesContext.Provider value={defaultContext}>
      {children}
    </CertificatesContext.Provider>
  );
};

export const useCertificatesContext = () => {
  return React.useContext(CertificatesContext);
};