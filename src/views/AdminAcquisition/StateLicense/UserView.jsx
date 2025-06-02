import React, { useEffect, useState, useContext } from 'react';
import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip } from '@mui/material';
import { AccordionBox, AccordionTable, PlaceHolder, DefaultPlaceHolder, PageContainer } from '../../../components/CMECompliance';
import { InfoDialog, InfoIconTooltip } from '../../../views/AdminView/LicenseReports/Components';
import { useParams } from 'react-router';
import adminService from '../../../services/adminService';
import BackButtonWithTitle from '../../../components/Reports';
import moment from 'moment';
import { ReportFilterContext } from '../../../context/ReportFilterContext';
import TasksPopup from '../components/TasksPopup';

const SingleUserData = ({ userData, handleOpenUserInfo, handleTaskClick }) => {
  return (
    <>
      <Typography style={{ fontSize: '20px', fontWeight: 500 }} mb={2}>
        {userData?.first_name+' '+userData?.last_name}
        <InfoIconTooltip
          title={'Info'}
          onClick={() => handleOpenUserInfo({ email: userData.email, prof: userData.email })}
        />
      </Typography>
      <AccordionBox>
        <TableContainer>
          <AccordionTable>
            <TableHead sx={{'& .MuiTableCell-head': { background: '#F3F3F3' }}}>
              <TableRow>
                <TableCell width={400}>License Type</TableCell>
                <TableCell style={{ textAlign: 'left' }}>Acquisition Stages</TableCell>
                <TableCell>Open Tasks</TableCell>
                <TableCell>Timely Tasks</TableCell>
                <TableCell>Overdue Tasks</TableCell>
                <TableCell>Critical Tasks</TableCell>
                <TableCell>Anticipated Approval</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.certificates.map((row, index) => {
                return (
                  <TableRow hover key={index}>
                    <TableCell>{row.Certificate_Name} - {row.StateAbbr}</TableCell>
                    <TableCell style={{ textAlign: 'left' }}>{row.Validity}</TableCell>
                    <TableCell>{row.in_progress_tasks_count}</TableCell>
                    <TableCell>{Math.abs(row.in_progress_tasks_count - row.overdue_tasks_count - row.overdue_7days_tasks_count)}</TableCell>
                    <TableCell onClick={() => handleTaskClick("Overdue", row.overdue_task_ids, `${userData.first_name} ${userData.last_name}`, `${row.Certificate_Name} - ${row.StateAbbr}`)} style={{ color: '#D35037', cursor: 'pointer', textDecoration: 'underline'}}>
                      <Tooltip arrow title="Click to View Overdue Tasks">
                        {row.overdue_tasks_count}
                      </Tooltip>
                    </TableCell>
                    <TableCell onClick={() => handleTaskClick("Critical", row.overdue_7days_task_ids, `${userData.first_name} ${userData.last_name}`, `${row.Certificate_Name} - ${row.StateAbbr}`)} style={{ color: '#D35037', cursor: 'pointer', textDecoration: 'underline'}}>
                      <Tooltip arrow title="Click to View Critical Tasks">
                        {row.overdue_7days_tasks_count}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {moment(row.Expiry_Date).format('MMM D, YYYY')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </AccordionTable>
        </TableContainer>
      </AccordionBox>
    </>
  );
};

const AquisitionLicenseUserView = () => {
  const { deptID, userID } = useParams(); // Get the dept ID & user ID from the URL
  const { selectedDepartments, selectedStates } = useContext(ReportFilterContext);
  const [userLicense, setUserLicense] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState([
    { label: 'Email', value: 'test@test.com' },
    { label: 'Profession', value: 'Tester' }
  ]);
  const [open, setOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [overDueTaskIDs, setoverDueTaskIDs] = useState([]);
  const [licenseName, setLicenseName] = useState('');
  const [userName, setUserName] = useState('');
  const [taskType, setTaskType] = useState('');
  
  const handleOpenTask = () => setOpenTask(true);
  const handleCloseTask = () => setOpenTask(false);

  const handleTaskClick = (type, ids, userName, licenseName) => {
    setTaskType(type)
    setoverDueTaskIDs(ids);
    setUserName(userName);
    setLicenseName(licenseName);
    handleOpenTask();
  }

  const handleCloseUserInfo = () => setOpen(false);

  const handleOpenUserInfo = user => {
    setOpen(true);
    setUserDetails([{ label: 'Email', value: user.email }, { label: 'Department Name', value: deptID}]);
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userIds = userID.split(',').map(Number);
      const stateIds = selectedStates.map(user => user.id.toString());
      
      const { data } = await adminService.getUserAcquisitionLicense([parseInt(deptID)], userIds, stateIds);
      setUserLicense(data);
    } catch (error) {
      console.error('Error fetching License Acquisition overview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <PageContainer>
      <BackButtonWithTitle title={'License Acquisition Status Report'} />
      {isLoading ? (
        <PlaceHolder loading={isLoading} />
      ) : userLicense.length > 0 ?  (
        userLicense?.map(data => {
          return <SingleUserData key={data.email} userData={data} handleOpenUserInfo={handleOpenUserInfo} handleTaskClick={handleTaskClick} />;
        })
      ) : (
        <DefaultPlaceHolder />
      )}
      <InfoDialog
        open={open}
        title="User Information"
        details={userDetails}
        onClose={handleCloseUserInfo}
      />
      <TasksPopup 
        open={openTask}
        handleClose={handleCloseTask}
        taskType={taskType}
        userName={userName}
        licenseName={licenseName}
        overDueTaskIDs={overDueTaskIDs}
      />
    </PageContainer>
  );
};

export default AquisitionLicenseUserView;
