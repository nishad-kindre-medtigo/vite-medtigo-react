import moment from "moment";
import history from "../../../utils/history";
import { allCertificates, cme_states, ProfessionWithCertificates } from "../../../appConstants";

export const calculateValidity = (expiryDate) => {
  const now = moment();
  const expiry = moment(expiryDate);
  const duration = moment.duration(expiry.diff(now));
  const years = duration.years();
  const months = duration.months();

  if (years > 0) {
    return `${years} Year${years > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} Month${months > 1 ? 's' : ''}`;
  } else {
    return '';
  }
};

export const calculateStatus = (expiryDate) => {
  const now = moment().startOf('day');
  const expiry = moment(expiryDate).startOf('day');
  const daysUntilExpiry = expiry.diff(now, 'days');  

  if (daysUntilExpiry <= 0) {
    return 'Expired';
  } else if (daysUntilExpiry == 1) {
    return `Expiration in ${daysUntilExpiry} day`;
  } else if (daysUntilExpiry < 30) {
    return `Expiration in ${daysUntilExpiry} days`;
  } else if (daysUntilExpiry < 60) {
    return 'Expiration in 30+ days';
  } else if (daysUntilExpiry < 90) {
    return 'Expiration in 60+ days';
  } else if (daysUntilExpiry < 120) {
    return 'Expiration in 90+ days';
  } else if (daysUntilExpiry < 150) {
    return 'Expiration in 120+ days';
  } else if (daysUntilExpiry < 180) {
    return 'Expiration in 150+ days';
  } else {
    return 'Risk Free';
  }
};

export const getLicenseStatusImage = status => {
  switch (status) {
    case 'Expired':
      return '/icons/LicenseReports/expiredStatus.png'; // Assuming the images are in public/images
    case 'RiskFree':
      return '/icons/LicenseReports/riskFreeStatus.png';
    case 'Risk Free':
      return '/icons/LicenseReports/riskFreeStatus.png';
    default:
      return '/icons/LicenseReports/atRiskStatus.png'; // Default to yellow if status is unknown
  }
};

export const getLicenseStatus = (date) => {
  // Parse the input date to ensure it's a Date object
  const inputDate = new Date(date);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in time (milliseconds)
  const timeDifference = inputDate - currentDate;

  // Convert the difference to days
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Determine the status
  if (dayDifference < 0) {
    return "Expired";
  } else if (dayDifference > 180) {
    return "RiskFree";
  } else {
    return `Expiration in ${dayDifference} days`;
  }
};


export const formatDate = dateString => {
  return moment(dateString).format('MMM D, YYYY');
};

export const getMonthName = dateString => {
  return moment(dateString, 'YYYY-MM').format('MMMM YYYY');
}

export const handleBack = () => {
  history.goBack(); // This will take the user to the previous page
};

export const LicenseIdToName = (id) => {
  return allCertificates.find(item => item.id.trim() == id.trim())?.name;
}

export const clearSessionStorage = () => {
  sessionStorage.removeItem('month_DEA');
  sessionStorage.removeItem('month_Clinical_Certificate');
  sessionStorage.removeItem('month_State_CSR/CSC');
  sessionStorage.removeItem('month_cme');
}


export const RenewalCycle = (state, licenseId) => {
  if (licenseId !== '3993767000000019870') return { days: -1, years: -1 };

  // Find the matching state object by ID or name
  const matchingState = cme_states.find(
    (item) => item.id === state || item.name === state
  );

  if (!matchingState) {
    // If the state is not found, return default renewal year
    return { days: 730, years: Math.floor(730 / 365) }; // Default renewal cycle
  }

  let renewalDays = 730; // Default renewal days

  switch (matchingState.id) {
    case '3993767000000047571': // Michigan
    case '3993767000000047211': // Kentucky
    case '3993767000000047743': // Nevada
    case '3993767000000047311': // North Dakota
    case '3993767000000023401': // Wyoming
    case '3993767000000047235': // Minnesota
      renewalDays = 1095;
      break;
    case '3993767000000047427': // Alabama
    case '3993767000000047139': // Arkansas
    case '3993767000000047199': // Kansas
    case '3993767000000047539': // Louisiana
    case '3993767000000047631': // Oklahoma
    case '3993767000000026017': // Connecticut
      renewalDays = 365;
      break;
    case '3993767000000047391': // Washington
      renewalDays = 1460;
      break;
  }

  // Calculate years as an integer
  const renewalYears = Math.floor(renewalDays / 365);

  return {
    days: renewalDays,
    years: renewalYears,
  };
};
