import * as React from 'react';
import staffingServices from 'src/services/staffingServices';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const StaffingContext = React.createContext({});

export const StaffingContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.user);

  // JOB BOARD CONTEXT VALUES
  const [isLoading, setIsLoading] = React.useState(false);
  const [jobsData, setJobsData] = React.useState([]);
  const [userSavedJobs, setSavedJobs] = React.useState([]);
  const [userAppliedJobs, setUserAppliedJobs] = React.useState([]);

  // ADMIN VIEW ACCESS CONTEXT VALUES
  const [adminViewAccess, setAdminViewAccess] = React.useState(false); // Set Access to Admin View based on user role
  const [showAdminView, setShowAdminView] = React.useState(false); // Show Admin View based on Admin View Toggle

  // Change Admin View Toggle
  const toggleAdminView = () => {
    setShowAdminView((prev) => {
      const newValue = !prev;
      if (newValue) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      return newValue;
    });
  };

  // Set Admin View Access based on user role
  React.useEffect(() => {
    if ((user?.role && user?.role === 'department_admin') || user?.role === 'hospital_admin') {
      setAdminViewAccess(true);
    }
  }, []);

  // Get Admin View Toggle from Local Storage on Page Load
  React.useEffect(() => {
    if (window.location.pathname.includes('/admin')) {
      setShowAdminView(true);
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsData = await staffingServices.getAllJobs();
      setJobsData(jobsData.Data);
    } catch (error) {
      console.log(error);
      setJobsData([]);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const intendedData = await staffingServices.getAppliedJobs();
      setUserAppliedJobs(intendedData.data.data);
    } catch (error) {
      console.log(error);
      setUserAppliedJobs([]);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const bookmarkData = await staffingServices.getSavedJobs();
      setSavedJobs(bookmarkData.data.data);
    } catch (error) {
      console.log(error);
      setSavedJobs([]);
    }
  };

  // REFRESH JOBS WHEN SAVING OR APPLYING FOR A JOB
  const refreshJobs = () => {
    fetchJobs();
    fetchAppliedJobs();
    fetchSavedJobs();
  };

  // FETCH JOBS ONLY WHEN USER HAS UNITES STATES AS COUNTRY
  React.useEffect(() => {
    if (user?.country === 'United States') {
      const fetchCareerData = async () => {
        try {
          setIsLoading(true);
          await fetchJobs();
          await fetchAppliedJobs();
          await fetchSavedJobs();
        } catch (error) {
          console.error('Error fetching career data: ', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCareerData();
    }
  }, []);

  const defaultContext = {
    isLoading,
    jobsData,
    userAppliedJobs,
    userSavedJobs,
    refreshJobs,
    adminViewAccess,
    showAdminView,
    setShowAdminView,
    toggleAdminView
  };

  return (
    <StaffingContext.Provider value={defaultContext}>
      {children}
    </StaffingContext.Provider>
  );
};
