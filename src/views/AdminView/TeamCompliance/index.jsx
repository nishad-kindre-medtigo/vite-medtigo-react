import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle, useRef  } from 'react';
import { Drawer, Box, debounce, Typography } from '@mui/material';
import { cme_states as states } from '../../../appConstants';
import StateAccordion from './components/StateAccordion';
import CertificateDrawer from '../../../views/MonitoringRenewal/CertificateDrawer';
import { CertificatesContext } from '../../../context/CertificatesContext';
import { ReportTabs, ReportViewCom } from './components';
import { PlaceHolder } from '../../../components/CMECompliance';
import StateSpecificCMECervices from 'src/services/stateSpecificCMEService';
import { useParams } from 'react-router-dom';
import SingleUserSingleState from '../../../components/CMECompliance/reportsPage/singleUserSingleState';
import SingleUserMultiState from '../../../components/CMECompliance/reportsPage/singleUserMultiState';
import MultiUserSingleState from '../../../components/CMECompliance/reportsPage/multiUserSingleState';
import MultiUserMultiState from '../../../components/CMECompliance/reportsPage/multiUserMultiState';
import departmentsService from 'src/services/departmentsService';                  
import hospitalsService from 'src/services/hospitalsService'; 
import { useSelector } from 'react-redux';
import UserCollapse from './components/UserAccordion';
import ComplianceChart from './components/ComplianceChart';
// import useBreakpoints from 'src/hooks/useBreakpoints';
import { useSnackbar } from 'notistack';
import DepartmentCollapse from './components/DepartmentAccordion';
import { ReportFilterContext } from '../../../context/ReportFilterContext';
import { InfoDialog, InfoIconTooltip } from '../LicenseReports/Components/index';
import { getMonthName } from '../utils';
import { CircularProgress } from "@mui/material";
import CircularProgressWithLabel from '../../../components/CMECompliance/progressBar';
import ProgressStepper from './components/stepper';
import ReportTable, { SkeletonCMEReport } from './components/ReportTable';


const TeamComplianceReport = forwardRef((props, ref) => {
  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    callFunction: () => {
      GenerateReport();
    },
  }));
    // Context values
    const {
      selectedDepartments,
      selectedStates,
      selectedUsers,
      selectedProfessions,
      handleStateChange,
      handleDepartmentChange,
      handleProfessionChange,
      handleEmailChange,
      departmentList,
      userOptions,
      userInputValue,
      setUserInputValue,
      professionOptions,
      filterDetails,
      setLoading:setWaiting,
      filtersStatus,
      errorMsg:error,
      loading:waiting
  } = React.useContext(ReportFilterContext);

  const { drawerStatus, setDrawerStatus, setIsEdit, setActiveCertificateData } = useContext(CertificatesContext);
  const { user } = useSelector((state) => state.account);
  const { enqueueSnackbar } = useSnackbar();

  // View/Report-related states
  const [view, setView] = useState('table'); // Default view
  const [reportView, setReportView] = useState(sessionStorage.getItem('report_view') || 'by-state');
  const [personWiseChecked, setPersonWiseChecked] = useState(true);
  const [reportGenerated, setReportGenerated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = useState(0)
  // Filter-related states
  const [inputSearch, setInputSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState(null);
  const [step, setStep] = useState(null);
  const [chartUserID, setChartUserID] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [open, setOpen] = useState(false);
    const [fromChart, setFromChart] = useState(null);
    const [reportType, setReportType] = useState(null);

  // Data-related states
  const [hospitalIds, setHospitalIds] = React.useState([]);
  const [stateStats, setStateStats] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [complianceReports, setComplianceReports] = useState([]);
  const [apiPayload, setAPIPayload] = useState(null);

  // Error-related states
  const [errorMsg, setErrorMsg] = React.useState('Click GENERATE REPORT button');
  const [errorCode, setErrorCode] = React.useState(null);
  const [userBatchIndex, setUserBatchIndex] = useState(0);  // Track the user batch index
  const [stateBatchIndex, setStateBatchIndex] = useState(0);  // Track the state batch index
  const [hasMoreUser, setHasMoreUser] = useState(false);  // Track the user batch index
  const [hasMoreStates, setHasMoreStates] = useState(false);  // Track the state batch index
  const { type } = useParams();
  const [savedInterval, setSavedInterval] = useState(null);
  const preparePayload = (userBatchIndex) => {
    try {
      // Defaults for safety
      // const selectedDepartments = selectedDepartments || [];
      // const selectedUsers = selectedUsers || [];
      // const selectedStates = selectedStates || [];

      const designation_id = selectedProfessions.map((it) => it.id);

      // Extract departments, users, and states
      const depId = selectedDepartments.map((dep) => dep.id);
      const usersList = selectedUsers.map((user) => user.id);
      const statesList = selectedStates.map((state) => state.id);

      // Early exit conditions
      if (usersList.length === 0) return null;

      const month_year = sessionStorage.getItem('month_cme') || null;

      // Create payload object
      return {
        states_list: statesList,
        userIDs: usersList,
        deptIds: depId,
        all_states: false,
        all_users: false,
        designation_id,
        userBatchIndex:userBatchIndex,
        month_year
      };
    } catch (error) {
      console.error("Error preparing payload:", error);
      enqueueSnackbar("Failed to prepare payload", { variant: "error" });
      return null;
    }
  };



  React.useEffect(() => {
    // getReportRequestStatus();
    resetResult()
  }, [selectedDepartments, selectedStates, selectedUsers]);
  
  const getReportRequestStatus = async () => {
      try {
        const res = await StateSpecificCMECervices.GetReportStatus(user.email);
        setStep(res.stage || 1001);
        setStatus(res.status);
      } catch (error) {
        console.log(error);
      }
  };
  

  React.useEffect(() => {
    
  if(status!='in_progress' && reportGenerated){
    console.log('[STEP] clearing interval', status,step);
    clearInterval(savedInterval);
  }
  }, [step,status,savedInterval]);

  const updateUserStats = (newStats) => {
    setUserStats((prevUserStats) => {
      const updatedUserStats = newStats.map((newUserData) => {
        const existingUserData = prevUserStats.find(
          (userData) => userData.user === newUserData.user
        );

        if (existingUserData) {
          // Merge compliance/non-compliance states
          const mergedCompliantStates = [
            ...new Set([
              ...existingUserData.compliantStates.states,
              ...newUserData.compliantStates.states,
            ]),
          ];
          const mergedNonCompliantStates = [
            ...new Set([
              ...existingUserData.nonCompliantStates.states,
              ...newUserData.nonCompliantStates.states,
            ]),
          ];

          return {
            ...existingUserData,
            compliantStates: {
              ...existingUserData.compliantStates,
              count: mergedCompliantStates.length,
              states: mergedCompliantStates,
            },
            nonCompliantStates: {
              ...existingUserData.nonCompliantStates,
              count: mergedNonCompliantStates.length,
              states: mergedNonCompliantStates,
            },
          };
        }
        return newUserData;
      });

      // Avoid duplicate users
      return [
        ...prevUserStats.filter(
          (userData) =>
            !newStats.some((newUser) => newUser.user === userData.user)
        ),
        ...updatedUserStats,
      ];
    });
  };

  const updateReports = (reports)=>{
    setComplianceReports((prevComplianceData) => {
      // Filter out new user compliance data that is not already in the current state
      const updatedComplianceData = reports.filter(
        (newComplianceData) =>
          !prevComplianceData.some(
            (existingComplianceData) =>
              existingComplianceData.userId === newComplianceData.userId &&
              existingComplianceData.state === newComplianceData.state
          )
      );

      // Merge existing user compliance data with new data
      const mergedComplianceData = prevComplianceData.map((existingComplianceData) => {
        const matchingData = reports.find(
          (newComplianceData) =>
            newComplianceData.userId === existingComplianceData.userId &&
            newComplianceData.state === existingComplianceData.state
        );

        if (matchingData) {
          return {
            ...existingComplianceData,
            isProviderCompliant: matchingData.isProviderCompliant,
            licenseExpirationDate: matchingData.licenseExpirationDate,
            isLicenseUploaded: matchingData.isLicenseUploaded,
            userName: matchingData.userName,
            email: matchingData.email,
            departments: matchingData.departments,
          };
        }

        return existingComplianceData;
      });

      // Return the updated list: combine merged data and new user compliance data
      return [...mergedComplianceData, ...updatedComplianceData];
    });
  }

  const updateDepartmentStats = (newStats) => {
    setDepartmentStats((prev) => {
      const departmentMap = new Map();

      // Add existing departments
      prev.forEach((department) => {
        departmentMap.set(department.id, department);
      });

      // Merge or add new departments
      newStats.forEach((newDept) => {
        if (departmentMap.has(newDept.id)) {
          const existingDept = departmentMap.get(newDept.id);
          const mergedUsers = [
            ...existingDept.users,
            ...newDept.users.filter(
              (newUser) =>
                !existingDept.users.some((user) => user.userId === newUser.userId)
            ),
          ];
          departmentMap.set(newDept.id, { ...existingDept, users: mergedUsers });
        } else {
          departmentMap.set(newDept.id, newDept);
        }
      });

      return Array.from(departmentMap.values());
    });
  };

  const updateStateStats = (newStats) => {
    setStateStats((prevStateStats) => {
      const updatedStateStats = newStats.map((newStateData) => {
        const existingStateData = prevStateStats.find(
          (stateData) => stateData.state_id === newStateData.state_id
        );

        if (existingStateData) {
          return {
            ...existingStateData,
            compliantUsers:
              existingStateData.compliantUsers + newStateData.compliantUsers,
            nonCompliantUsers:
              existingStateData.nonCompliantUsers + newStateData.nonCompliantUsers,
          };
        }
        return newStateData;
      });

      return [
        ...prevStateStats.filter(
          (stateData) =>
            !newStats.some(
              (newState) => newState.state_id === stateData.state_id
            )
        ),
        ...updatedStateStats,
      ];
    });
  };

  const resetResult=()=>{
    setDepartmentStats([]);
    setStateStats([]);
    setUserStats([]);
    setComplianceReports([]);
    setReportGenerated(false);
  }


  const handleReportError = (error, defaultMsg) => {
    console.error(error);
    enqueueSnackbar(defaultMsg || "An unexpected error occurred.", {
      variant: "error",
    });
  };

  const GenerateReport2 = async (source = null) => {
    console.log('GenerateReport initaiting');
    const startTime = performance.now();
    let progressInterval;
    setReportGenerated(false);
    try {
        // if (type && type.includes('type')) return; 
        setWaiting(true);
        setLoading(true);
        setView('table');

        const payload = preparePayload();
        console.log('GenerateReport response', res);

        if (!payload) {
            clearInterval(progressInterval); 
            setLoading(false);
            setWaiting(false);
            return;
        }
        const res = await StateSpecificCMECervices.GenerateTeamCMEReport(payload);
        console.log('GenerateReport', res);
        sessionStorage.removeItem('month_cme');
        sessionStorage.removeItem('report_type');
        setReportGenerated(true);
        setLoading(false);
        setWaiting(false);
        setProgress(0);

        
        // if(!res.user_compliance_data.length > 0){
        //   handleReportResponse(res);
        // }
    } catch (error) {
        setLoading(false);
        setWaiting(false);
        setProgress(0);
        setReportGenerated(false);
        handleReportError(error, 'Failed to generate report!');
    } finally {
        // clearInterval(progressInterval); 
        console.log(`GenerateReport completed in ${Math.round(performance.now() - startTime)} ms`);
    }
};

  const GenerateReport = async (source = null, userBatchIndex = 0, stateBatchIndex = 0) => {
    try {

      // to avoid unneccessary api call
      if ((type && type.includes('type'))) {
        return;
      }
      
      if (userBatchIndex == 0) {
        setLoading(true);
      }
      setWaiting(true)

      setView('table');

      // Determine the payload based on sessionStorage or state
      let depId = [];
      let statesList = [];
      let usersList = [];
      let allUsers = false;
      const designation_id = selectedProfessions.map((it) => it.id);

      // Departments
      const department = selectedDepartments;
      if (department.length > 0) {
        depId = department.map(dep => dep.id);
      }
      // Users
      const user = selectedUsers;
      if (user.length > 0) usersList = user.map(u => u.id)
      if (!allUsers && usersList.length == 0) return;

      // States
      const states = selectedStates;
      if (states && states.length > 0) {
        statesList = states.map((item, index) => item.id);
      }
      let month_year = sessionStorage.getItem('month_cme') || null;
      let payload = preparePayload(userBatchIndex);
      let res = await StateSpecificCMECervices.GenerateTeamCMEReport(payload);
      sessionStorage.removeItem('month_cme')
      sessionStorage.removeItem('report_type')
      setHasMoreUser(res.hasMoreUsers)
      setHasMoreStates(res.hasMoreStates)
      // i want your suggestion here
      updateReports(res.user_compliance_data)
      // setUserStats(res.userStats)
      updateUserStats(res.userStats)
      setDepartmentStats(res.departmentStats)
      setStateStats(res.stateStats)
      setReportGenerated(true)
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to generate report!', { variant: 'error' });
    } finally {
      setLoading(false);
      setWaiting(false)
    }
  };
  

  React.useEffect(()=>{
    if(sessionStorage.getItem('month_cme')){ 
      setReportType(sessionStorage.getItem('report_type')||null)
      setFromChart(getMonthName(sessionStorage.getItem('month_cme')))
      GenerateReport();}
  },[])

  React.useEffect(()=>{
    GenerateReport();
  },[])

  React.useEffect(()=>{
  },[userStats, departmentStats, stateStats, complianceReports])
  

  // Determine if "All" should be selected
  const isAllSelected = selectedStates.length === states.length;
  const isAllDepSelected = selectedDepartments.length === departmentList.length;
  // const stateIDs = selectedStates?.map(item => item.id);

  const handleOpen = () => {
    setOpen(true);
}
const handleClose = () => setOpen(false);

  useEffect(() => {
    if(error && !error.includes('Select certificate type')) {
      setErrorMsg(error)
      setReportGenerated(false)}
      else{
        setErrorMsg('Click on GENERATE REPORT')
      }
  }, [error]);

  const loadMoreUsers = async () => {
    if(!hasMoreUser) return;
    // Call your backend API with the updated userBatchIndex and update the tableData
    GenerateReport(null,userBatchIndex + 1,stateBatchIndex)
    setUserBatchIndex(userBatchIndex + 1);

  };


  if(type=='type-1-report'){ // single user single state report
    return (
      <Box py={2}>
        {/* CME Compliance Toolbar */}
        {/* <CMEComplianceToolbar /> */}
        <SingleUserSingleState/>
      </Box>
    )
  }else if(type=='type-2-report'){ // single user multi state report
    return (
      <Box py={2}>
        {/* CME Compliance Toolbar */}
        {/* <CMEComplianceToolbar /> */}
        <SingleUserMultiState/>
      </Box>
    )
  }else if(type=='type-3-report'){ // multi user single state report
    return (
      <Box py={2}>
        {/* CME Compliance Toolbar */}
        {/* <CMEComplianceToolbar /> */}
        <MultiUserSingleState/>
      </Box>
    )
  }else if(type=='type-4-report'){ // multi user multi state report
    return (
      <Box py={2}>
        {/* CME Compliance Toolbar */}
        {/* <CMEComplianceToolbar /> */}
        <MultiUserMultiState/>
      </Box>
    )
  }   
  return (
    <Box style={{ minHeight: '80vh' }}>
      {/* CME Compliance Toolbar */}
      {/* <CMEComplianceToolbar /> */}
      <ReportViewCom View={view} 
      reportView={reportView} 
      setView={(v) => setView(v)} 
      comp={<InfoIconTooltip title="Info" onClick={handleOpen} />} 
      fromChart={fromChart}
      />
      {((loading) ? (
      // <ProgressStepper step={step} status={status}/>
        <SkeletonCMEReport showGroupColumn={selectedDepartments.length > 1} rows={Math.min(selectedUsers.length, 5)} count={selectedUsers.length}/>
      ) : !reportGenerated ? (
        <PlaceHolder loading={false} title={errorMsg} />
      ): <>
      {
        userStats.length>0 &&
              <ReportTable
                tableData={userStats}
                complianceReports={complianceReports}
                userData={userStats}
                selectedState={selectedState}
                departments={departmentStats}
                departmentList={departmentList}
                reportType={reportType}
                loadMoreUsers={loadMoreUsers}
                hasMoreUsers={hasMoreUser}
                hasMoreStates={hasMoreStates}
                count={selectedUsers}
                loading={waiting}
                showGroupColumn={selectedDepartments.length > 1}  
              />
      }
      </>
      )}

      {/* Add Certificate Drawer */}
      <CertificateDrawer type="CME Certificate" />
      <InfoDialog
        open={open}
        title="CME Compliance Report generated for: "
        details={filterDetails}
        onClose={handleClose}
      />
    </Box>
  );
});


export default TeamComplianceReport;
