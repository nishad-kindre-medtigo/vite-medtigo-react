import React, { forwardRef, useEffect, useState, useImperativeHandle, useContext } from 'react';
import { Typography } from '@mui/material';
import adminService from 'src/services/adminService';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import DepartmentAccordion from './DepartmentAccordion';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from 'src/components/CMECompliance';
import { InfoDialog, InfoIconTooltip } from 'src/views/AdminView/LicenseReports/Components';

const StateLicense = forwardRef((props, ref) => {
  const [LicenseSummary, setLicenseSummary] = useState([]);
  const { selectedUsers, selectedDepartments, selectedStates, errorMsg:errMsg, filterDetails } = useContext(ReportFilterContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg,setErrorMsg]=useState('Please apply filters to Generate Report')  
  const [reportGenerated, setReportGenerated] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const departmentIds = selectedDepartments.map(dept => dept.id);
      const userIds = selectedUsers.map(user => user.id.toString());
      const stateIds = selectedStates.map(user => user.id.toString());
      if(departmentIds.length==0) return;
      if(stateIds.length==0) return;
      const { data } = await adminService.getAcquisitionLicenseSummary(departmentIds, userIds, stateIds);
      data.sort((a,b)=>b.count-a.count)
      setLicenseSummary(data);
      setReportGenerated(true)
    } catch (error) {
      console.error('Error fetching License Summary:', error);
      setLicenseSummary([]);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    callFunction: () => {
      fetchData();
    },
  }));

  // useEffect(() => {
  //   fetchData();
  // }, []);

  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        License Acquisition Status Report
        <InfoIconTooltip title="Info" onClick={handleOpen} />
      </Typography>
      {isLoading ? (
        <PlaceHolder loading={isLoading}/>
      ) : !reportGenerated ? (
        <PlaceHolder loading={isLoading} title={errorMsg} />
      ) : LicenseSummary.length > 0 ? (
        LicenseSummary?.map((department, index) => (
          <DepartmentAccordion key={index} page="state-license" data={department} allUserIds={department?.licenseData?.map(user => user?.userId)} />
        ))
      ) : (
        <DefaultPlaceHolder/>
      )}
      <InfoDialog
        open={open}
        title="License Acquisition Status Report generated for:"
        details={filterDetails}
        onClose={handleClose}
      />
    </PageContainer>
  );
});

export default StateLicense;
