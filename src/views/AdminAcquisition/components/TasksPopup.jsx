import React, { useEffect, useState } from 'react';
import { Box, IconButton, Dialog, DialogTitle, DialogContent, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AccordionBox, AccordionTable } from '../../../components/CMECompliance';
import adminService from 'src/services/adminService';
import moment from 'moment';

const TasksPopup = ({
  open,
  handleClose,
  overDueTaskIDs,
  taskType = 'Loading...',
  userName = 'Loading...',
  licenseName = 'Loading...'
}) => {
  // State to manage the expanded state for each note
  const [expandedRows, setExpandedRows] = useState({});
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClosePopup = () => {
    setExpandedRows({});
    handleClose();
  }

  const handleToggleExpand = index => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const truncateText = (text, isExpanded, maxLength = 55) => {
    if (isExpanded || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const fetchTasksData = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminService.getUserAcquisitionLicenseOverdueTasks(overDueTaskIDs);
      setOverdueTasks(data);
    } catch (error) {
      console.error('Error fetching License Acquisition overview:', error);
      setOverdueTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log('overdueTasks: ', overdueTasks);
  // console.log("overDueTaskIDs: ", overDueTaskIDs);

  useEffect(() => {
    fetchTasksData();
  }, [overDueTaskIDs]);

  return (
    <Dialog open={open} onClose={handleClosePopup} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m: 0, p: 0 }}>
        <Box my={2} mx={3} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Typography style={{ fontSize: '24px', fontWeight: 600 }}>
            {taskType} Tasks for {licenseName}
          </Typography>
          <IconButton onClick={handleClosePopup} aria-label="close">
            <CloseRoundedIcon fontSize="large" />
          </IconButton>
        </Box>
        <hr style={{ color: '#D8D8D8', background: '#D8D8D8' }} />
        <Typography my={2} mx={3} style={{ fontSize: '24px', fontWeight: 600 }}>
          {userName}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <AccordionBox>
          <TableContainer>
            <AccordionTable>
              <TableHead sx={{ '& .MuiTableCell-head': { background: '#F3F3F3' } }}>
                <TableRow>
                  <TableCell>{taskType} Tasks</TableCell>
                  <TableCell>Assigned Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell width={350}>Note</TableCell>
                </TableRow>
              </TableHead>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading ... </TableCell>
                </TableRow>
              ) : (
                <>
                  {overdueTasks.length > 0 ? (
                    <TableBody>
                      {overdueTasks?.map((row, index) => {
                        const isExpanded = expandedRows[index] || false; // Default not expanded
                        return (
                          <TableRow hover key={index}>
                            <TableCell style={{ color: '#D35037' }}>
                              {row.Task_Type}
                            </TableCell>
                            <TableCell style={{ color: '#3A3A3A' }}>
                              {moment(row.assignedDate).format('MMM D, YYYY')}
                            </TableCell>
                            <TableCell style={{ color: '#3A3A3A' }}>
                              {moment(row.dueDate).format('MMM D, YYYY')}
                            </TableCell>
                            <TableCell style={{ color: '#3A3A3A' }}>
                              {truncateText(
                                row.Certificate_Task_Note,
                                isExpanded
                              )}
                              {row.Certificate_Task_Note.length > 55 && (
                                <span
                                  style={{
                                    fontWeight: 600,
                                    textDecoration: 'underline',
                                    color: '#4C4B4B',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => handleToggleExpand(index)}
                                >
                                  {isExpanded ? 'View Less' : 'View More'}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>No Data Available</TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </AccordionTable>
          </TableContainer>
        </AccordionBox>
      </DialogContent>
    </Dialog>
  );
};

export default TasksPopup;
