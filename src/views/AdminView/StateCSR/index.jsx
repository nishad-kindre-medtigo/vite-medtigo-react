import React, { forwardRef, useEffect, useState, useImperativeHandle, useContext } from 'react';
import DepartmentAccordion from '../ClinicalCertificate/DepartmentAccordion';
import { Typography } from '@mui/material';
import adminService from 'src/services/adminService';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from 'src/components/CMECompliance';
import { InfoDialog, InfoIconTooltip } from '../LicenseReports/Components/index';
import { getMonthName } from '../utils';

const StateCSR = forwardRef((props, ref) => {
  const currentMonthSelected = sessionStorage.getItem('month_State_CSR/CSC');
  const [StateCSRSummary, setStateCSRSummary] = useState([]);
  const { selectedUsers, selectedDepartments, selectedStates, setLoading: setWaiting, filterDetails,errorMsg:errMsg } = useContext(ReportFilterContext);
  const [isLoading, setIsLoading] = useState(false);
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
      if(departmentIds.length==0) return;
      if(stateIds.length == 0) return;
      let month = null;
      if(sessionStorage.getItem('month_State_CSR/CSC')){
        month = [sessionStorage.getItem('month_State_CSR/CSC')];
      }
      const { data } = await adminService.getStateCSRSummary(departmentIds, userIds, stateIds, month);
      data.sort((a,b)=>b.count-a.count)
      setStateCSRSummary(data);
      setReportGenerated(true)
    } catch (error) {
      console.error('Error fetching StateCSR Summary:', error);
      setStateCSRSummary([]);
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
        {currentMonthSelected ?  `State CSR/CSC Expiration Report Generated for ${monthName}` : 'State CSR/CSC Report'}
        <InfoIconTooltip title="Info" onClick={handleOpen} />
      </Typography>
      {isLoading ? (
        <PlaceHolder loading={isLoading}/>
      ) :!reportGenerated ? (
        <PlaceHolder loading={isLoading} title={errorMsg}/>
      ) : StateCSRSummary.length > 0 ? (
        StateCSRSummary?.map((department, index) => (
          <DepartmentAccordion 
            key={index} 
            page="state-csr" 
            data={department} 
            allUserIds={department?.licenseData?.map(user => user?.userId)} 
            currentMonthSelected={currentMonthSelected}
          />
        ))
      ) : (
        <DefaultPlaceHolder/>
      )}
      <InfoDialog
        open={open}
        title="State CSR Report generated for: "
        details={filterDetails}
        onClose={handleClose}
      />
    </PageContainer>
  );
});

export default StateCSR;
