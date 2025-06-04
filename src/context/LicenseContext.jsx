import * as React from 'react';
import moment from 'moment';
import alertPage from 'src/services/alertPage';
import { useSelector } from 'react-redux';

export const LicenseContext = React.createContext({});

const DEFAULT_SUPPORT = {
  lead: {
    name: '',
    analyst: ''
  },
  analyst: {
    name: '',
    email: ''
  }
};

const getAnticipatedDaysCount = (expiryDate) => {
  const daysCount = moment(expiryDate).diff(moment(), 'days'); // Calculate the difference in days
  let daysText;

  // Categorize the days into ranges
  if (daysCount < 30) {
    daysText = `${daysCount}`; // Exact count if less than 30 days
  } else if (daysCount < 60) {
    daysText = '30+';
  } else if (daysCount < 90) {
    daysText = '60+';
  } else if (daysCount < 120) {
    daysText = '90+';
  } else if (daysCount < 150) {
    daysText = '120+';
  } else {
    daysText = '150+';
  }

  return { daysText, daysCount}
};

export const LicenseContextProvider = ({ children }) => {
  const user = useSelector((state) => state.account.user);
  const [licenseLoading, setLicenseLoading] = React.useState(false);
  const [licenseStepperData, setLicenseStepperData] = React.useState([]);
  const [supportData, setSupportData] = React.useState(DEFAULT_SUPPORT);
  const [taskSearchOptions, setTaskSearchOptions] = React.useState([]);
  const [notesData, setNotesData] = React.useState([]);

  // FETCH LICENSE STEPPER CARD DATA
  const fetchLicenseSummary = async () => {
    try {
      if (!user) return; // Skip if no user ID is present
      setLicenseLoading(true);
      const { data, searchOptions } = await alertPage.getLicenseSummary(user.id);
      const licenseStepperData = data.map(data => {
        const { daysText, daysCount: anticipatedDaysCount } = getAnticipatedDaysCount(data.expiry_date);

        return {
          licenseID: data.id,
          licenseName: data.certificate_name,
          state: data.state,
          state_abbr: data.state_abbr,
          validity: data.validity,
          anticipatedDaysCount,
          anticipatedDate: data.expiry_date,
          daysText,
          overdueCount: data.overdueTasksCount,
          timelyCount: data.timelyTasksCount,
        };
      });
      setLicenseStepperData(licenseStepperData);
      setTaskSearchOptions(searchOptions);
    } catch (err) {
      console.error('Error fetching License Stepper Data: ', err);
      setLicenseLoading(true);
      setLicenseStepperData([]);
      setTaskSearchOptions([]);
    } finally {
      setLicenseLoading(false);
    }
  };

  const fetchUserNotes = async () => {
    try {
      if (!user) return; // Skip if no user ID is present
      const { data: licenseNotes } = await alertPage.getUserLicenseNote(user.id);
      setNotesData(licenseNotes);
    } catch (err) {
      setNotesData([]);
    }
  };

  // FETCH USER SUPPORT DATA - ANALYST, LEAD ANALYST
  const fetchSupportData = async () => {
    try {
      if (!user) return; // Skip if no user ID is present
      const response = await alertPage.getAnalyst(user.id);
      if(response?.data){
        setSupportData(response.data);
      }
    } catch (err) {
      setSupportData({});
    }
  };

  React.useEffect(() => {
    fetchLicenseSummary();
    fetchUserNotes();
    fetchSupportData();
  }, []);

  const defaultContext = {
    licenseLoading,
    licenseStepperData,
    supportData,
    taskSearchOptions,
    notesData
  };

  return (
    <LicenseContext.Provider value={defaultContext}>
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicenceContext = () => {
  return React.useContext(LicenseContext);
}