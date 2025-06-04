import React, { forwardRef, useImperativeHandle, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import licenseReportServices from 'src/services/licenseReportServices';
import { PlaceHolder, PageContainer } from 'src/components/CMECompliance';
import { ConfirmationDialog } from 'src/components/Reports/confirmationDilog';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { InfoDialog, InfoIconTooltip } from './Components';
import DepartmentAccordion from './DepartmentAccordion';
import { getMonthName } from '../utils';

const LicenseReports = forwardRef((props, ref) => {
  const [licenseReport, setLicenseReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [errorMsg,setErrorMsg]=useState('Please apply filters to Generate Report')  
  const [fromChart, setFromChart] = useState(null);

  const {
    selectedDepartments,
    selectedStates,
    selectedUsers,
    filterDetails,
    selectedProfessions,
    setLoading: setWaiting,
    errorMsg:errMsg
  } = useContext(ReportFilterContext);

  const cacheExpirationTime = 600000; // Cache expiration time in milliseconds (10 minutes)

  useImperativeHandle(ref, () => ({
    callFunction: () => {
      generateReport();
    }
  }));

  const generateCacheKey = payload => {
    return JSON.stringify(payload); // Can use a more optimized way to hash if needed
  };

  const fetchFromCache = key => {
    const cachedData = sessionStorage.getItem(key);
    if (!cachedData) return null;

    const parsedData = JSON.parse(cachedData);
    const currentTime = new Date().getTime();

    // Check if the cache has expired
    if (currentTime - parsedData.timestamp > cacheExpirationTime) {
      sessionStorage.removeItem(key); // Remove expired cache
      return null;
    }

    return parsedData.data;
  };

  const saveToCache = (key, data) => {
    const timestamp = new Date().getTime();
    data.sort((a,b)=>b.count-a.count)
    const cachedData = { data, timestamp };
    sessionStorage.setItem(key, JSON.stringify(cachedData));
  };

  const handleViewReport = userIds => {
    navigate(`/admin/reports/license/details/${userIds.join(',')}`);
  };

  const generateReport = async () => {
    setLoading(true);
    setWaiting(true);

    try {
      const states = selectedStates.map(it => it.id);
      const departments = selectedDepartments.map(it => it.id);
      const users = selectedUsers.map(it => it.id);
      const designation_id = selectedProfessions.map(it => it.id);
      if(departments.length==0 || states.length==0) return;
      const payload = {
        states,
        departments,
        usersFilterIds: users,
        designation_id,
        date:sessionStorage.getItem('month_cme')
      };
      const cacheKey = generateCacheKey(payload);

      // Check if the result is already cached
      const cachedResult = fetchFromCache(cacheKey);
      if (cachedResult) {
        setWaiting(false);
        // Simulate delay if data is fetched from cache
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for 2 seconds
        setLicenseReports(cachedResult);
        setReportGenerated(true);
      } else {
        const resp = await licenseReportServices.getLicenseStatusCountReport(
          payload
        );
        if(resp.length==0) setErrorMsg('No data available for selected filters')
        resp.sort((a,b)=>b.count-a.count)
        setLicenseReports(resp);
        setReportGenerated(true);
        saveToCache(cacheKey, resp); // Save the result to cache with timestamp
      }
    } catch (error) {
      console.error(error);
      setReportGenerated(false);
    } finally {
      setLoading(false);
      setWaiting(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  useEffect(() => {
    generateReport();
  }, []);

  React.useEffect(()=>{
    if(sessionStorage.getItem('month_cme')){ 
      setFromChart(getMonthName(sessionStorage.getItem('month_cme')))
      generateReport();}
  },[])

  useEffect(() => {
    if (errMsg && !errMsg.includes('Select certificate type')) {
        setErrorMsg(errMsg)
        setReportGenerated(false)
    }
    else {
        setErrorMsg('Click on GENERATE REPORT')
    }
}, [errMsg]);


  return (
    <PageContainer sx={{ pt: 0 }}>
      <Typography style={{ fontSize: '24px', fontWeight: 600 }} mb={2}>
        State License Report
        {fromChart?' for '+fromChart:null}
        <InfoIconTooltip title="Info" onClick={handleOpen} />
      </Typography>
      {
        loading ?
          <PlaceHolder loading />
          : !reportGenerated ?
            <PlaceHolder loading={false} title={errorMsg} />
            : licenseReport.length === 0 ?
              <PlaceHolder loading={false} title={errorMsg} />
              : licenseReport.map((department, index) => (
        <DepartmentAccordion
          key={index}
          department={department}
          onViewAll={() =>
            handleViewReport(department.licenseData.map(it => it.userId))
          }
          onViewSingle={id => handleViewReport(id)}
        />
      ))}
      <ConfirmationDialog
        msg="Send email reminder?"
        open={dialog}
        onCancel={() => setDialog(false)}
      />
      <InfoDialog
        open={open}
        title="State License Report generated for:"
        details={filterDetails}
        onClose={handleClose}
      />
    </PageContainer>
  );
});

export default LicenseReports;
