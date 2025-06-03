import React, { forwardRef, useEffect, useState, useImperativeHandle, useContext } from 'react';
import DepartmentAccordion from '../ClinicalCertificate/DepartmentAccordion';
import { Typography } from '@mui/material';
import adminService from 'src/services/adminService';
import { ReportFilterContext } from '../../../context/ReportFilterContext';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from '../../../components/CMECompliance';
import { InfoDialog, InfoIconTooltip } from '../LicenseReports/Components/index';
import { getMonthName } from '../utils';

const DEA = forwardRef((props, ref) => {
  const currentMonthSelected = sessionStorage.getItem('month_DEA');
  const [DEASummary, setDEASummary] = useState([]);
  const { selectedUsers, selectedDepartments, selectedStates, errorMsg:errMsg } = useContext(ReportFilterContext);
  const [isLoading, setIsLoading] = useState(false);
  const {setLoading: setWaiting, filterDetails} = useContext(ReportFilterContext);
  const [open, setOpen] = useState(false);
  const [errorMsg,setErrorMsg]=useState('Click on GENERATE REPORT')  
  const [reportGenerated, setReportGenerated] = useState(false);
  const monthName = currentMonthSelected ? getMonthName(currentMonthSelected) : null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    setIsLoading(true);
    setWaiting(true);
    try {
      const departmentIds = selectedDepartments.map(dept => dept.id);
      const userIds = selectedUsers.map(user => user.id.toString());
      const stateIds = selectedStates.map(user => user.id.toString());
      if(departmentIds.length == 0) return;
      if(stateIds.length == 0) return;
      let month = null;
      if(sessionStorage.getItem('month_DEA')){
        month = [sessionStorage.getItem('month_DEA')];
      }
      const { data } = await adminService.getDEASummary(departmentIds, userIds, stateIds, month);
      data.sort((a,b)=>b.count-a.count)
      setDEASummary(data);
      setReportGenerated(true)
      // console.log('DEASummary: ', data);
    } catch (error) {
      console.error('Error fetching DEA Summary:', error);
      setDEASummary([]);
    } finally {
      setIsLoading(false);
      setWaiting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    callFunction: () => {
      fetchData();
    },
  }));

  useEffect(() => {
    fetchData();
  }, []);

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
        {currentMonthSelected ?  `DEA Expiration Report Generated for ${monthName}` : 'DEA Report'}
        <InfoIconTooltip title="Info" onClick={handleOpen} />
      </Typography>
      {isLoading ? (
        <PlaceHolder loading={isLoading}/>
      ) :!reportGenerated ? (
        <PlaceHolder loading={isLoading} title={errorMsg}/>
      ) : DEASummary.length > 0 ? (
        DEASummary?.map((department, index) => (
          <DepartmentAccordion 
            key={index} 
            page="dea" 
            data={department} 
            allUserIds={department?.licenseData?.map(user => user?.userId)} 
            currentMonthSelected={currentMonthSelected} 
          />
        ))
      ) : (
        <DefaultPlaceHolder />
      )}
      <InfoDialog
        open={open}
        title="DEA Report generated for: "
        details={filterDetails}
        onClose={handleClose}
      />
    </PageContainer>
  );
});

DEA.displayName = "DEA"; // Set the displayName explicitly

export default DEA;
