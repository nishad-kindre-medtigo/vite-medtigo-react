import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from "@fullcalendar/interaction";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";
// import timeGridPlugin from "@fullcalendar/timegrid";
import './style.css';
import schedullingServices from 'src/services/schedullingServices';
import { useSelector } from 'react-redux';
import {
  Grid,
  Checkbox, 
  DialogActions,
  Dialog,
  InputLabel,
  TextField,
  MenuItem,
  Button,
  Box,
  Card,
  CircularProgress,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import hospitalsService from 'src/services/hospitalsService';
import departmentsService from 'src/services/departmentsService';
import { useLocation } from 'react-router-dom';
import shiftServices from 'src/services/shiftServices';
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import useBreakpoints from 'src/hooks/useBreakpoints';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#fff',
    color: '#000'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: '#fff'
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f6f6f6'
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const customFilters = {
  hospital: {
    label: 'Hospital*',
    key: 'id',
    options: [{ name: 'Not available' }],
    value: ''
  },
  department: {
    label: 'Department*',
    key: 'id',
    options: [{ name: 'Not available' }],
    value: ''
  },
  schedule: {
    label: 'Schedule*',
    key: 'id',
    options: [{ name: 'Not available' }],
    value: ''
  }
};

const AvailabilityPage = () => {
  const [filters, setFilters] = React.useState(customFilters);
  const [departmentID, setDepartmentID] = useState([]);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [events, setEvents] = useState();
  const location = useLocation();
  const schedulesFilterData = React.useRef(null);
  const { user } = useSelector(state => state.account);
  const [schedule, setSchedule] = useState();
  const [shifts, setShifts] = useState([]);
  const [showShifts, setShowShifts] = useState(false);
  const [showShiftToDate, setShowShiftToDate] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const openSnackbar = useOpenSnackbar();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentHospitalId, setCurrentHospitalId] = useState();
  const [currentDepartmentId, setCurrentDepartmentId] = useState();
  const [currentScheduleId, setCurrentScheduleId] = useState();
  const [addHospitalId, setAddHospitalId] = useState(false);
  const [addDepartmentId, setAddDepartmentId] = useState(false);
  const [addscheduleId, setAddScheduleId] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [isThirdPartySchedule, setIsThirdPartySchedule] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [expanded, setExpanded] = useState({});
  const { isMobile } = useBreakpoints();

  const handleChange = (scheduleID, panel) => (event, isExpanded) => {
    // Update filters based on expansion
    isExpanded
      ? handleFilters('schedule', scheduleID)
      : handleFilters('schedule', 'Please Select');

    // Set the expanded state to only the current panel, collapsing others
    setExpanded(isExpanded ? { [panel]: true } : false);
  };

  const ScheduleAccordion = ({
    scheduleID,
    component,
    scheduleName,
    startDate,
    endDate
  }) => {
    const isExpanded = expanded[scheduleName];

    // Handle expand/collapse when the expand icon is clicked
    const handleIconClick = event => {
      event.stopPropagation(); // Prevent click from bubbling up to the summary
      handleChange(scheduleID, scheduleName)(event, !isExpanded); // Manually toggle accordion
    };

    return (
      <Accordion
        expanded={isExpanded} // Use `isExpanded` for controlled expansion
        elevation={0}
        sx={{
          my: 2,
          border: '1px solid #DFDFDF',
          background: isExpanded && '#F6F6F6'
        }}
      >
        <AccordionSummary
          onClick={handleIconClick} // Prevent default Accordion behavior
          expandIcon={
            <ArrowDropDownRoundedIcon
              sx={{ fontSize: { xs: '40px', md: '50px' }, color: '#2872C1' }}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <CalendarMonthOutlinedIcon sx={{ mr: 1, alignContent: 'center' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center', // Align items horizontally
              justifyContent: !isMobile && 'space-between', // Ensure the button is next to the expand icon
              flexDirection: { xs: 'column', md: 'row' }, // Vertical for mobile, horizontal for laptop
              width: isMobile ? '70%' : '100%',
              textAlign: 'left'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: '#102048',
                  fontSize: { xs: '12px', md: '16px' },
                  fontWeight: 600,
                  pr: { xs: 0, md: 2 },
                  borderRight: { xs: 'none', md: '1px solid #C8C8C8' }
                  // width: '100%'
                }}
              >
                Schedule Name : {scheduleName}
              </Typography>
              <Typography
                component="span"
                sx={{
                  color: '#102048',
                  fontSize: { xs: '12px', md: '16px' },
                  pl: { xs: 0, md: 2 },
                  fontWeight: 400
                  // width: '100%'
                }}
              >
                Timeline:{' '}
                {moment(startDate).format('MMM DD YYYY') +
                  ' to ' +
                  moment(endDate).format('MMM DD YYYY')}
              </Typography>
              {isExpanded && isMobile && (
                <Button
                  onClick={e => {
                    e.stopPropagation(); // Prevent button click from collapsing accordion
                    saveAvailability();
                  }}
                  color="primary"
                  variant="contained"
                  disableElevation
                  sx={{
                    fontSize: { xs: '12px', md: '16px' },
                    height: '36px',
                    fontWeight: 600,
                    mt: 2
                  }}
                >
                  {!isAllDatesEntered() && !isThirdPartySchedule
                    ? 'SEND AVAILABILITY'
                    : 'EDIT'}
                </Button>
              )}
            </Box>
            {isExpanded && !isMobile && (
              <Button
                onClick={e => {
                  e.stopPropagation(); // Prevent button click from collapsing accordion
                  saveAvailability();
                }}
                color="primary"
                variant="contained"
                disableElevation
                sx={{
                  fontSize: { xs: '12px', md: '16px' },
                  height: '36px',
                  fontWeight: 600,
                  mt: { sm: 1, md: 0 }
                }}
              >
                {!isAllDatesEntered() && !isThirdPartySchedule
                  ? 'SEND AVAILABILITY'
                  : 'EDIT'}
              </Button>
            )}
          </Box>
        </AccordionSummary>

        {/* <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            marginBottom: '10px',
            paddingBottom: '20px',
            borderBottom: '1px solid #DFDFDF'
          }}
        >
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '0.03em',
              marginRight: '10px',
              color: '#3A3A3A'
            }}
          >
            {currentDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </Typography>
          <div style={{ display: 'flex', gap: '10px' }}>
            <IconButton
              onClick={handlePrev}
              style={{
                border: '1px solid #2872C1',
                borderRadius: '2px',
                padding: '3px'
              }}
            >
              <ChevronLeftIcon style={{ color: '#2872C1' }} />
            </IconButton>
            <IconButton
              onClick={handleNext}
              style={{
                border: '1px solid #2872C1',
                borderRadius: '2px',
                padding: '3px'
              }}
            >
              <ChevronRightIcon style={{ color: '#2872C1' }} />
            </IconButton>
          </div>
          <Button
            onClick={handleToday}
            variant="contained"
            color="primary"
            size="small"
            sx={{
              ml: 2,
              border: '1px solid #2872C1',
              background: '#FFFFFF',
              color: '#2872C1',
              borderRadius: '2px',
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '0.03em',
              fontFamily: 'Poppins',
              textTransform: 'none',
              padding: '2px 10px',
              '&:hover': {
                background: '#2872C1',
                color: '#FFFFFF'
              }
            }}
          >
            Today
          </Button>
        </Grid> */}
        <AccordionDetails
          sx={{
            pt: 0,
            overflow: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'lightgrey transparent',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'lightgrey',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            }
          }}
        >
          <Box
            sx={{
              minWidth: '1260px',
              overflow: 'hidden',
              background: '#F6F6F6'
            }}
          >
            {schedule && showCalendar ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  overflow: 'auto'
                }}
              >
                {component}
              </Box>
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <CircularProgress
                  fontSize="small"
                  style={{ color: '#2872C1' }}
                />
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const getScheduleData = async scheduleID => {
    try {
      const data = await schedullingServices.getOpenSchedules(
        scheduleID,
        user.id
      );
      const { scheduleData, availabilityData } = data.data;
      // if(!data.status){
      //     return
      // }
      const shiftsData = await shiftServices.getShiftsForASchedule(
        scheduleData.id
      );
      // setScheduleId(scheduleData.data[0].id)

      if (shiftsData.length > 0 && shiftsData[0].date) {
        setIsThirdPartySchedule(true);
      } else {
        setIsThirdPartySchedule(false);
      }

      const dates = iterateDates(
        scheduleData.start_date,
        scheduleData.end_date
      );
      setShowCalendar(false);
      if (availabilityData.length > 0) {
        const showShiftsToDate = [];
        setAvailability(
          availabilityData.map(value => {
            if (value.isShift) {
              showShiftsToDate.push(value.date.split('T')[0]);
            }
            return { ...value, date: value.date.split('T')[0] };
          })
        );
        setShowShiftToDate(showShiftsToDate);
        setEvents(dates);
        setStartDate(scheduleData.start_date);
        setEndDate(scheduleData.end_date);
        setShifts(shiftsData);
        setSchedule(scheduleData);
        setShowCalendar(true);
      } else {
        const avail = [];
        dates.forEach(date => {
          avail.push({
            date: date.date,
            available: null,
            isShift: false,
            shiftIds: [],
            resourceIds: []
          });
        });
        setShowShiftToDate([]);
        setAvailability(avail);
        setEvents(dates);
        setStartDate(scheduleData.start_date);
        setEndDate(scheduleData.end_date);
        setShifts(shiftsData);
        setSchedule(scheduleData);
        setShowCalendar(true);
      }
    } catch (err) {
      setEvents(null);
      setSchedule(null);
      openSnackbar('This Schedule is not Opened.', 'error');
    }
  };

  const handleFilters = async (index, value) => {
    if (index === 'department') {
      try {
        const data = await schedullingServices.getScheduleForDepartment(
          value,
          user.id
        );
        setScheduleList(data.data);
      } catch (err) {
        setEvents(null);
        setSchedule(null);
        openSnackbar('The Schedule for this department is Closed.', 'error');
      }
    }
    if (index === 'schedule') {
      if (value === 'Please Select') {
        setEvents(null);
        setSchedule(null);
      } else {
        await getScheduleData(value);
      }
    }
    setFilters({ ...filters, [index]: { ...filters[index], value } });
  };

  const clearDepartmentAndSchedule = () => {
    setFilters({
      ...filters,
      department: {
        ...filters['department'],
        options: [{ name: 'Not available' }],
        value: ''
      }
    });
  };

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('scheduleId')) {
        await getScheduleData(localStorage.getItem('scheduleId'));
      }
    })();
    if (
      localStorage.getItem('hospitalId') &&
      localStorage.getItem('departmentId') &&
      localStorage.getItem('scheduleId')
    ) {
      setCurrentHospitalId(localStorage.getItem('hospitalId'));
      setCurrentDepartmentId(localStorage.getItem('departmentId'));
      setCurrentScheduleId(localStorage.getItem('scheduleId'));
    }

    (async () => {
      const events = await schedullingServices.getTeamSchedule(user.id);
      setData(events.data);
      setData2(events.data1);
      setDepartmentID(events.department);
    })();
    if (location.state?.data) {
      schedulesFilterData.current = {
        hospitalId: location.state.data.departments.hospitalID.toString(),
        departmentId: location.state.data.departmentID.toString()
      };
    }
    (async () => {
      const resp = await hospitalsService.getHospitals();
      let newResp;
      // let filteredValue=31
      // const filteredOptions = resp.filter(item => item.id === filteredValue);
      if (resp.length > 0) {
        newResp = [{ name: 'Please Select' }].concat(resp);
      } else {
        newResp = [{ name: 'Not available' }];
      }

      if (localStorage.getItem('hospitalId')) {
        setFilters({
          ...filters,
          hospital: {
            ...filters['hospital'],
            options: newResp,
            // value: schedulesFilterData.current.hospitalId,
            value: localStorage.getItem('hospitalId')
          }
        });
      } else {
        setFilters({
          ...filters,
          hospital: { ...filters['hospital'], options: newResp }
          // value: localStorage.getItem("hospitalId")
        });
      }
      if (localStorage.getItem('departmentId')) {
        handleFilters('department', localStorage.getItem('departmentId'));
      }
    })();
    return () => {
      localStorage.removeItem('hospitalId');
      localStorage.removeItem('scheduleId');
      localStorage.removeItem('departmentId');
    };
  }, []);

  useEffect(() => {
    (async () => {
      clearDepartmentAndSchedule();
      if (filters.hospital.value) {
        try {
          const resp = await departmentsService.getDepartments(
            filters.hospital.value
          );

          let newResp;
          const filteredOptions = resp.filter(item =>
            departmentID.includes(item.id)
          );
          if (filteredOptions.length > 0)
            newResp = [{ name: 'Please Select' }].concat(filteredOptions);
          else {
            newResp = [{ name: 'Not available' }];
          }
          if (currentDepartmentId) {
            setFilters({
              ...filters,
              department: {
                ...filters['department'],
                options: newResp,
                value: currentDepartmentId
              }
            });
          } else {
            setFilters({
              ...filters,
              department: {
                ...filters['department'],
                options: newResp,
                value: ''
              }
            });
          }
        } catch (err) {
          console.error("Error setting filters: ", err)
        }
        // handleFilters("schedule", currentScheduleId)
      }
    })();
  }, [filters.hospital.value]);

  useEffect(() => {
    (async () => {
      if (filters.department.value) {
        if (currentScheduleId) {
          setFilters({
            ...filters,
            schedule: {
              ...filters['schedule'],
              options: [{ name: 'Please Select' }, ...scheduleList],
              value: currentScheduleId
            }
          });
        } else {
          setFilters({
            ...filters,
            schedule: {
              ...filters['schedule'],
              options: [{ name: 'Please Select' }, ...scheduleList],
              value: ''
            }
          });
        }
      }
    })();
    // setCurrentHospitalId()
    // setCurrentDepartmentId()
    // setCurrentScheduleId()
  }, [filters.department.value]);

  const iterateDates = (startDateStr, endDateStr) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const dates = [];
    const event = [];

    // Make sure startDate is before or equal to endDate
    if (startDate > endDate) {
      console.error('Start date should be before or equal to end date.');
      return dates;
    }

    // Iterate over the dates
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]); // Format date as "YYYY-MM-DD" and push to the array
      event.push({
        date: dates[dates.length - 1],
        title: 'AVAIL',
        beginDate: dates[dates.length - 1]
      });
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return event;
  };

  const isAllDatesEntered = () => {
    for (let i = 0; i < availability.length; i++) {
      if (
        (availability[i].available === null && !availability[i].isShift) ||
        (availability[i].isShift && availability[i].shiftIds.length === 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const saveAvailability = async () => {
    if (!isAllDatesEntered() && !isThirdPartySchedule) {
      openSnackbar(
        'Please enter your availability for all the dates in the schedule.',
        'error'
      );
      return;
    }

    setShowConfirmation(true);
  };

  function renderEventContent(eventInfo) {
    if (isThirdPartySchedule) {
      if (
        !shifts.find(
          shift => shift.date == eventInfo.event.extendedProps.beginDate
        )
      ) {
        return;
      }
    }
    const whatToCheck = availability.find(avail => {
      return avail.date === eventInfo.event.extendedProps.beginDate;
    });
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          alignItems: 'start',
          gap: '5px',
          backgroundColor: 'white',
          fontSize: '12px',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            color="success"
            checked={whatToCheck && whatToCheck.available}
            onChange={e => {
              if (e.target.checked) {
                const alteredData = availability.map(avail => {
                  if (avail.date === eventInfo.event.extendedProps.beginDate) {
                    return {
                      ...avail,
                      available: true,
                      isShift: false,
                      shiftIds: [],
                      resourceIds: []
                    };
                  }
                  return avail;
                });
                setAvailability(alteredData);
                // setShowShiftToDate(
                //   showShiftToDate.filter(data => {
                //     return data !== eventInfo.event.extendedProps.beginDate;
                //   })
                // );
              } else {
                const alteredData = availability.map(avail => {
                  if (avail.date === eventInfo.event.extendedProps.beginDate) {
                    return {
                      ...avail,
                      available: null,
                      isShift: false,
                      shiftIds: [],
                      resourceIds: []
                    };
                  }
                  return avail;
                });
                setAvailability(alteredData);
              }
            }}
          />
          <h3 style={{ color: 'green' }}>Available</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            color="error"
            checked={whatToCheck && !whatToCheck.available && whatToCheck.available !== null}
            onChange={e => {
              if (e.target.checked) {
                const alteredData = availability.map(avail => {
                  if (avail.date === eventInfo.event.extendedProps.beginDate) {
                    return {
                      ...avail,
                      available: false,
                      isShift: false,
                      shiftIds: [],
                      resourceIds: []
                    };
                  }
                  return avail;
                });
                setAvailability(alteredData);
                setShowShiftToDate(
                  showShiftToDate.filter(data => {
                    return data !== eventInfo.event.extendedProps.beginDate;
                  })
                );
              } else {
                const alteredData = availability.map(avail => {
                  if (avail.date === eventInfo.event.extendedProps.beginDate) {
                    return {
                      ...avail,
                      available: null,
                      isShift: false,
                      shiftIds: [],
                      resourceIds: []
                    };
                  }
                  return avail;
                });
                setAvailability(alteredData);
              }
            }}
          />
          <h3 style={{ color: 'red' }}>Not Available</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            color="default"
            checked={whatToCheck && whatToCheck.isShift}
            onChange={e => {
              if (e.target.checked) {
                const alteredData = availability.map(avail => {
                  if (avail.date === eventInfo.event.extendedProps.beginDate) {
                    return { ...avail, available: null, isShift: true };
                  }
                  return avail;
                });
                setAvailability(alteredData);
                setShowShiftToDate([
                  ...showShiftToDate,
                  eventInfo.event.extendedProps.beginDate
                ]);
                // setShowShifts(true)
              } else {
                const alteredData = availability.map(avail => {
                  if (avail.date === eventInfo.event.extendedProps.beginDate) {
                    return {
                      ...avail,
                      available: null,
                      isShift: false,
                      shiftIds: [],
                      resourceIds: []
                    };
                  }
                  return avail;
                });
                setAvailability(alteredData);
                setShowShiftToDate(
                  showShiftToDate.filter(data => {
                    return data !== eventInfo.event.extendedProps.beginDate;
                  })
                );
                // setShowShiftToDate()
                // setShowShifts(false)
              }
            }}
          />
          <h3 style={{ color: 'black' }}>Specific Shifts On</h3>
        </div>
        {showShiftToDate &&
          showShiftToDate.map(showDate => {
            if (showDate === eventInfo.event.extendedProps.beginDate) {
              return (
                shifts
                  .filter(shift => {
                    if (shift.date && isThirdPartySchedule) {
                      return (
                        shift.date &&
                        shift.date == eventInfo.event.extendedProps.beginDate
                      );
                    } else if (!isThirdPartySchedule) {
                      return true;
                    }
                  })
                  // shifts
                  .map((shift, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '12px'
                        }}
                      >
                        <Checkbox
                           color="primary"
                          checked={whatToCheck && whatToCheck.shiftIds.includes(
                            shift.dataValues.id
                          )}
                          onChange={e => {
                            if (e.target.checked) {
                              const alteredData = availability.map(avail => {
                                if (
                                  avail.date ===
                                  eventInfo.event.extendedProps.beginDate
                                ) {
                                  return {
                                    ...avail,
                                    shiftIds: [
                                      ...avail.shiftIds,
                                      shift.dataValues.id
                                    ],
                                    resourceIds: [
                                      ...avail.resourceIds,
                                      shift.resourceId
                                    ]
                                  };
                                }
                                return avail;
                              });
                              setAvailability(alteredData);
                            } else {
                              const alteredData = availability.map(avail => {
                                if (
                                  avail.date ===
                                  eventInfo.event.extendedProps.beginDate
                                ) {
                                  const updatedShiftIds = avail.shiftIds.filter(
                                    shiftId => {
                                      return shiftId !== shift.dataValues.id;
                                    }
                                  );
                                  const updatedResourceIds = avail.resourceIds.filter(
                                    resourceId => {
                                      return resourceId !== shift.resourceId;
                                    }
                                  );
                                  return {
                                    ...avail,
                                    shiftIds: updatedShiftIds,
                                    resourceIds: updatedResourceIds
                                  };
                                }
                                return avail;
                              });
                              setAvailability(alteredData);
                            }
                          }}
                        />
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <h3>{`${moment(
                            shift.dataValues.start_time,
                            'h:mm A'
                          ).format('HH:mm')} to ${moment(
                            shift.dataValues.end_time,
                            'h:mm A'
                          ).format('HH:mm')}`}</h3>
                          <h3>{shift.name}</h3>
                        </div>
                      </div>
                    );
                  })
              );
            }
          })}
      </div>
    );
  }

  return (
    <Box className='availability-page' mb={2} sx={{ minHeight: '50vh' }}>
      {/* Filters */}
      <Grid container my={1} spacing={2} alignItems="flex-end">
        {Object.keys(filters)
          .filter(key => key !== 'schedule')
          .map((key, index) => {
            return (
              <Grid key={index} size={{ xs: 12, md: 2 }}>
                <InputLabel sx={{ color: '#102048' }} htmlFor={key}>
                  {filters[key].label}
                </InputLabel>
                <TextField
                  name={key}
                  fullWidth
                  onChange={e => {
                    (async () => {
                      localStorage.removeItem('hospitalId');
                      localStorage.removeItem('scheduleId');
                      localStorage.removeItem('departmentId');
                      setCurrentDepartmentId();
                      setCurrentHospitalId();
                      setCurrentScheduleId();
                      handleFilters(key, e.target.value);
                    })();
                  }}
                  select
                  SelectProps={{
                    native: true,
                    IconComponent: props => (
                      <ArrowDropDownRoundedIcon
                        {...props}
                        style={{
                          fontSize: '40px',
                          color:
                            filters[key].options?.length < 2
                              ? 'rgba(0, 0, 0, 0.38)'
                              : '#334D6E'
                        }}
                      />
                    )
                  }}
                  value={filters[key].value}
                  variant="outlined"
                  disabled={filters[key].options?.length < 2}
                  id={key} // Adding id for InputLabel to link to TextField
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '50px !important'
                    }
                  }}
                >
                  {filters[key].options.map(option => {
                    return (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    );
                  })}
                </TextField>
              </Grid>
            );
          })}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            elevation={0}
            sx={{
              backgroundColor: '#F8F8F8',
              color: '#3A3A3A',
              fontSize: '12px',
              px: 2,
              py: { xs: 2, md: 0 },
              alignContent: 'center',
              minHeight: '50px'
            }}
          >
            <span style={{ fontWeight: 600 }}>Info:</span> {"You can set your availability for the entire day using 'Available' or 'Not Available', or select specific shifts to view timings. once you select your availability for all days. The 'Send Availability' button will activate accordingly."}
          </Card>
        </Grid>
      </Grid>

      {/* Calendar Accordions */}
      {scheduleList.length > 0 ? (
        scheduleList
          .filter(item => item.status === 'opened')
          .map(item => {
            return (
              <ScheduleAccordion
                key={item.id}
                scheduleID={item.id}
                scheduleName={item.name}
                startDate={item.start_date}
                endDate={item.end_date}
                component={
                  <div style={{ background: '#F6F6F6' }}>
                    <FullCalendar
                      // defaultView="timeGridDay"
                      // header={{
                      //   left: 'prev,next today',
                      //   center: 'title',
                      //   right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                      // }}
                      plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin
                      ]}
                      events={events}
                      eventContent={renderEventContent}
                      initialDate={schedule && schedule.start_date}
                    />
                  </div>
                }
              />
            );
          })
      ) : (
        <Box mt={2} sx={{
          fontSize: '16px',
          backgroundColor: '#F8F8F8',
          height: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
        }}>
          Please Apply Filters To Generate Data
        </Box>
      )}

      <Dialog
        fullWidth
        maxWidth="md"
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        PaperProps={{
          style: {
            backgroundColor: '#fff',
            color: '#000'
          }
        }}
      >
        <TableContainer
          style={{ minWidth: '950px' }}
          component={Paper}
          elevation={0}
        >
          <Table aria-label="customized table">
            <TableHead style={{ width: '100%' }}>
              <TableRow>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Available</StyledTableCell>
                <StyledTableCell align="center">Not Available</StyledTableCell>
                {shifts.map(shift => {
                  return (
                    <StyledTableCell key={shift.name} align="center">
                      {`${shift.name}`}
                      <div>
                        {`${moment(
                          shift.dataValues.start_time,
                          'h:mm A'
                        ).format('HH:mm')} to ${moment(
                          shift.dataValues.end_time,
                          'h:mm A'
                        ).format('HH:mm')}`}
                      </div>
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {availability.map(data => {
                return (
                  <StyledTableRow
                    key={data.date}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <StyledTableCell
                      style={{ color: '#000' }}
                      align="center"
                      component="th"
                      scope="row"
                    >
                      {moment(data.date).format('MMM DD YYYY')}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        color: '#000',
                        fontWeight: data.available ? 'bold' : ''
                      }}
                      align="center"
                    >
                      {data.available ? 'Yes' : '-'}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        color: '#000',
                        fontWeight: data.available === false ? 'bold' : ''
                      }}
                      align="center"
                    >
                      {data.available === false ? 'Yes' : '-'}
                    </StyledTableCell>
                    {shifts.map(shift => {
                      return (
                        <StyledTableCell
                          key={shift.dataValues.id}
                          style={{
                            color: '#000',
                            fontWeight:
                              data.isShift &&
                              data.shiftIds.includes(shift.dataValues.id)
                                ? 'bold'
                                : ''
                          }}
                          align="center"
                        >
                          {data.isShift &&
                          data.shiftIds.includes(shift.dataValues.id)
                            ? 'Yes'
                            : '-'}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setShowConfirmation(false)}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              try {
                await schedullingServices.saveProviderAvailability({
                  availability: availability,
                  userID: user.id,
                  scheduleID: schedule.id,
                  shifts
                });
                openSnackbar('Your data has been recorded.');
              } catch (err) {
                openSnackbar('Something went wrong.', 'error');
              }
              setShowConfirmation(false);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvailabilityPage;
