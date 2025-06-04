import React, { forwardRef, useEffect, useState, useImperativeHandle, useContext } from 'react';
import DepartmentAccordion from './DepartmentAccordion';
import { Typography } from '@mui/material';
import adminService from 'src/services/adminService';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from 'src/components/CMECompliance';
import { InfoDialog, InfoIconTooltip } from '../LicenseReports/Components/index';
import { getMonthName } from '../utils';

const ClinicalCertificate = forwardRef((props, ref) => {
  const currentMonthSelected = sessionStorage.getItem('month_Clinical_Certificate');
  const [isLoading, setIsLoading] = useState(false);
  const [ClinicalCertificateSummary, setClinicalCertificateSummary] = useState([]);
  const { selectedUsers, selectedDepartments, selectedProfessions, selectedCertificateTypes, setLoading: setWaiting, filterDetails, errorMsg:errMsg,setErrorMsg:setErrMsg } = useContext(ReportFilterContext);
  const [open, setOpen] = useState(false);
  const [errorMsg,setErrorMsg]=useState('Click on GENERATE REPORT')  
  const [reportGenerated, setReportGenerated] = useState(false);
  const monthName = currentMonthSelected ? getMonthName(currentMonthSelected) : null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    setIsLoading(true);
    setWaiting(true)
    try {
      const departmentIds = selectedDepartments.map(dept => dept.id);
      const designationIds = selectedProfessions.map(dept => dept.id);
      const certificateIds = selectedCertificateTypes.map(dept => dept.id);
      const userIds = selectedUsers.map(user => user.id.toString());
      if(departmentIds.length==0) return;
      let month = null;
      if(sessionStorage.getItem('month_Clinical_Certificate')){
        month = [sessionStorage.getItem('month_Clinical_Certificate')];
      }
      const { data } = await adminService.getClinicalCertificateSummary(departmentIds, designationIds, certificateIds, userIds, month);
      data.sort((a,b)=>b.count-a.count)
      setClinicalCertificateSummary(data);
      setReportGenerated(true)
    } catch (error) {
      console.error('Error fetching Clinical Certificates Summary:', error);
      setClinicalCertificateSummary([]);
    } finally {
      setIsLoading(false);
      setWaiting(false)
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
        if (errMsg  && !errMsg.includes('Select geographical area')) {
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
        {currentMonthSelected ?  `Clinical Certificate Expiration Report Generated for ${monthName}` : 'Clinical Certificate Report'}
        <InfoIconTooltip title="Info" onClick={handleOpen} />
      </Typography>
      {isLoading ? (
        <PlaceHolder loading={isLoading} />
      ) :!reportGenerated ? (
        <PlaceHolder loading={false} title={errorMsg} />
      ) : ClinicalCertificateSummary.length > 0 ? (
        ClinicalCertificateSummary.map((department, index) => (
          <DepartmentAccordion 
            key={index} 
            page="clinical-certificate" 
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
        title="Clinical Certificate Report generated for: "
        details={filterDetails}
        onClose={handleClose}
      />
    </PageContainer>
  );
});

export default ClinicalCertificate;
