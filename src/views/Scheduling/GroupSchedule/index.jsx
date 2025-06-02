import React, { useCallback, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import './style.css';
import { useEffect } from 'react';
import schedullingServices from '../../../services/schedullingServices';
import { useSelector } from 'react-redux';
import { Box,CircularProgress,Grid,IconButton, Snackbar, TextField, Divider, Dialog, DialogActions, Typography, Button} from '@mui/material';
import hospitalsService from '../../../services/hospitalsService';
import departmentsService from '../../../services/departmentsService';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useOpenSnackbar } from '../../../hooks/useOpenSnackbar';
import shiftServices from '../../../services/shiftServices';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const GroupSchedulePage = () => {
  const openSnackbar = useOpenSnackbar();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [departmentID, setDepartmentID] = useState([]);
  const [selectedDndId, setSelectedDndId] = useState(null);
  const [firstClickedId, setFirstClickedId] = useState(null);
  const [currentDepartment, setCurrentDepartment] = useState();
  const [currentHospital, setCurrentHospital] = useState();
  const { user } = useSelector(state => state.account);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectedDndIds, setSelectedDndIds] = useState([]);
  const [currentScheduleId, setCurrentScheduleId] = useState();
  const [clickedCount, setClickedCount] = useState(0);
  const [senderSwapInfo, setSenderSwapInfo] = useState();
  const [senderProviderId, setsenderProviderId] = useState(null);
  const [senderEmail, setsenderEmail] = useState(null);
  const [receiverSwapInfo, setReceiverSwapInfo] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
  const [scheduleList, setScheduleList] = useState([]);
  const [events, setEvents] = useState();
  const [schedule, setSchedule] = useState();
  const [currentHospitalId, setCurrentHospitalId] = useState();
  const [currentDepartmentId, setCurrentDepartmentId] = useState();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [totalClicks, setTotalClicks] = useState(0);
  const [selectedEventIds, setSelectedEventIds] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [allow, setAllow] = useState(false);
  const [showSwapErrorDialog, setSwapErrorDialog] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [checkedStates, setCheckedStates] = useState({});
  const [showSwapDialog, setShowSwapDialog] = useState(false)
  const [showSwapEmailDialog, setShowSwapEmailDialog] = useState(false)
  const [firstSelectedShift, setFirstSelectedShift] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [
    showSwapPreviousDayNotAllowed,
    setShowSwapPreviousDayNotAllowed
  ] = useState(false);
  const [filters, setFilters] = React.useState({
    hospital: {
      label: 'Hospital',
      key: 'id',
      options: [{ name: 'Not available' }],
      value: ''
    },
    department: {
      label: 'Department',
      key: 'id',
      options: [{ name: 'Not available' }],
      value: ''
    },
    schedule: {
      label: 'Schedule',
      key: 'id',
      options: [{ name: 'Not available' }],
      value: ''
    }
  });
  const schedulesFilterData = React.useRef(null);
  const location = useLocation();

  const eventttt = async () => {
    const events = await schedullingServices.getTeamSchedule(user.id);
    setDepartmentID(events.department);
  };

  useEffect(() => {
    eventttt();
  }, []);

const handleFilters = async (index, value) => {
  if (index === 'department') {
    try {
      const data = await schedullingServices.getScheduleForDepartment(value, user.id);
      const publishedDepartments = data.data.filter(department => department.status === 'published');

      let departmentIdFromDepartment = null;
      publishedDepartments.forEach(department => {
        departmentIdFromDepartment = department.id;
      });

      setScheduleList(publishedDepartments);
      setFilters({ ...filters, department: { ...filters.department, value: departmentIdFromDepartment } });
    } catch (err) {
      console.error('Error fetching schedule for department:', err);
      setEvents([]);
      setSchedule(null);
    }
  }

  if (index === 'schedule') {
    if (value === 'Please Select') {
      setEvents([]);
      setSchedule(null);
    } else {
      try {
        const scheduleData = await getScheduleData(value);
        if (scheduleData && scheduleData.length > 0) {
          setEvents([...scheduleData]); // Ensure new array is passed
          setSchedule(value);
        } else {
          setEvents([]);
          setSchedule(null);
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setEvents([]);
        setSchedule(null);
      }
    }
  }

  setFilters({ ...filters, [index]: { ...filters[index], value } });
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
          console.error(err);
        }
      }
    })();
  }, [filters.hospital.value]);

  const getScheduleData = async (selectedScheduleID) => {
    let scheduleCount = 0; 
    try {
      scheduleCount++;

      setIsLoading(true)

      const publishedShiftResponse = await schedullingServices.getPublishedShift(selectedScheduleID);
      
      if (publishedShiftResponse && publishedShiftResponse.data) {
        const shiftsData = publishedShiftResponse.data.shifts.map(shift => ({
          startTime: shift.start_time,
          endTime: shift.end_time,
          shiftID: shift.id,
          resourceId: shift.resourceId,
          name: shift.name,
          providerId: shift.providerId, // Ensure this exists in the API response
          email: shift.email, // Ensure this exists in the API response
        }));

        
        setCurrentDate(new Date(publishedShiftResponse.data.scheduleData.start_date))
  
        const dndInfo = publishedShiftResponse.data.dndData.map(dndData => ({
          DndID: dndData.id,
          email: dndData.email,
          startDate: dndData.start_date,
          providerId: dndData.providerId,
          resourceId: dndData.resourceID,
          Username: dndData.name,
          updatedStartTime: dndData.startTime,
          updatedEndTime: dndData.endTime

        }));
  
        const mergedData = dndInfo.map(dnd => {
          const dndResourceId = String(dnd.resourceId);
          const matchingShift = shiftsData.find(shift => String(shift.resourceId) === dndResourceId);
  
          return matchingShift
            ? {
                ...dnd,
                startTime: matchingShift.startTime,
                endTime: matchingShift.endTime,
                shiftID: matchingShift.shiftID,
                resourceId: matchingShift.resourceId,
                name: matchingShift.name,
                providerId: matchingShift.providerId || dnd.providerId,
                email: matchingShift.email || dnd.email,
              }
            : {
                ...dnd,
                startTime: null,
                endTime: null,
                shiftID: null,
                resourceId: dnd.resourceId,
                name: dnd.Username,
                dndID: dnd.DndID,
                email: dnd.email,
                providerId: dnd.providerId,
              };
        });
  
        const finalData = mergedData.map(value => ({
          resourceId: value.resourceId,
          start: `${value.startDate}T${value.startTime || '00:00:00'}`,
          end: `${value.startDate}T${value.endTime || '23:59:59'}`,
          title: value.updatedStartTime && value.updatedEndTime ? `${value.updatedStartTime} - ${value.updatedEndTime}` : `${value.startTime} - ${value.endTime}`,
          id: value.shiftID || `no-shift-${value.providerId}-${value.startDate}`,
          providerId: value.providerId,
          name: value.Username || value.name,
          beginTime: value.startTime,
          closeTime: value.endTime,
          onDate: value.startDate,
          email: value.email,
          shiftname: value.name,
          dndID: value.DndID 
        }));
        setEvents([...finalData]);
        setIsLoading(false)
        return [...finalData];
      }
  
      return [];
    } catch (err) {
        setIsLoading(false)
      console.error('Error fetching schedule data:', err);
      return [];
    }
  };
  
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
  }, [filters.department.value]);

  useEffect(() => {
    if (location.state?.data) {
      schedulesFilterData.current = {
        hospitalId: location.state.data.departments.hospitalID.toString(),
        departmentId: location.state.data.departmentID.toString()
      };
    }
    (async () => {
      const hospitalResponse = await hospitalsService.getHospitals();
      let newResp;
      if (hospitalResponse.length > 0) {
        newResp = [{ name: 'Please Select' }].concat(hospitalResponse);
      } else {
        newResp = [{ name: 'Not available' }];
      }
      if (schedulesFilterData.current) {
        setFilters({
          ...filters,
          hospital: {
            ...filters['hospital'],
            options: newResp,
            value: schedulesFilterData.current.hospitalId
          }
        });
      } else {
        setFilters({
          ...filters,
          hospital: { ...filters['hospital'], options: newResp }
        });
      }
    })();
  }, []);

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
      clearDepartmentAndSchedule();
      if (filters.hospital.value) {
        const resp = await departmentsService.getDepartments(
          filters.hospital.value
        );

        let newResp;
        const filteredOptions = resp.filter(item =>
          departmentID.includes(item.id)
        );
        if (filteredOptions.length > 0)
          newResp = [{ name: 'Please Select' }].concat(filteredOptions);
        else newResp = [{ name: 'Not available' }];
        if (schedulesFilterData.current) {
          setFilters({
            ...filters,
            department: {
              ...filters['department'],
              options: newResp,
              value: schedulesFilterData.current.departmentId
              // value:80
            }
          });
        } else {
          setFilters({
            ...filters,
            department: {
              ...filters['department'],
              options: newResp,
              value: ' '
            }
          });
        }
      }
    })();
  }, [filters.hospital.value, departmentID]);

const handleEventClick = (eventInfo) => {
    const currentUserName = `${user.first_name} ${user.last_name}`;
    const clickedEventName = eventInfo.event._def.extendedProps.name;
    const clickedEventId = eventInfo.event.id;
    

    const clickedDate = moment(eventInfo.event._def.extendedProps.onDate);
    if (clickedDate.isBefore(moment(), 'day')) {
      setShowSwapPreviousDayNotAllowed(true);
      return;
    }

    const resetSelection = () => {
      setSenderSwapInfo(undefined);
      setReceiverSwapInfo(undefined);
      setClickedCount(0);
      eventInfo.view.calendar.getEvents().forEach(event => {
        event.setProp('backgroundColor', '');
      });
    };

    // If the clicked event is already selected, deselect it
    if ((senderSwapInfo && senderSwapInfo.dndId === clickedEventId) ||
        (receiverSwapInfo && receiverSwapInfo.dndId === clickedEventId)) {
      resetSelection();
      return;
    }

    // First click logic (select sender)
    if (!senderSwapInfo) {
      if (clickedEventName !== currentUserName) {
        setClickedCount(0);
        setSnackbarMessage("You must select your own shift first.");
        setSnackbarOpen(true);
        return;
      }

      const newSenderSwapInfo = {
        dndId: eventInfo.event._def.extendedProps.dndID,
        senderId: eventInfo.event._def.extendedProps.providerId,
        resourceId: eventInfo.event._def.resourceIds[0],
        name: clickedEventName,
        startTime: eventInfo.event._def.extendedProps.beginTime,
        endTime: eventInfo.event._def.extendedProps.closeTime,
        startDate: eventInfo.event._def.extendedProps.onDate,
        senderEmail: eventInfo.event._def.extendedProps.email,
      };
      
      setsenderProviderId(eventInfo.event._def.extendedProps.providerId);
      setsenderEmail(eventInfo.event._def.extendedProps.email);
      setSenderSwapInfo(newSenderSwapInfo);

    } 
    // Second click logic (select receiver)
    else if (!receiverSwapInfo) {
      if (clickedEventName === currentUserName) {
        setSnackbarMessage("Second click must be another user's shift.");
        setSnackbarOpen(true);
        return;
      }

      const newReceiverSwapInfo = {
        dndId: eventInfo.event._def.extendedProps.dndID,
        providerId: eventInfo.event._def.extendedProps.providerId,
        resourceId: eventInfo.event._def.resourceIds[0],
        name: clickedEventName,
        startTime: eventInfo.event._def.extendedProps.beginTime,
        endTime: eventInfo.event._def.extendedProps.closeTime,
        startDate: eventInfo.event._def.extendedProps.onDate,
        email: eventInfo.event._def.extendedProps.email,
      };

      setReceiverSwapInfo(newReceiverSwapInfo);

      const isValid = hasAtLeast8Hours(
        senderSwapInfo.startDate, senderSwapInfo.startTime, senderSwapInfo.endTime,
        newReceiverSwapInfo.startDate, newReceiverSwapInfo.startTime, newReceiverSwapInfo.endTime
      );

      if (isValid) {
        setShowSwapDialog(true);
      } else {
        setSwapErrorDialog(true);
        resetSelection();
      }
    }
  };

  const handleCheckBoxClick = useCallback((e, eventId, dndId, isPastShift, eventName, startDate, startTime, endTime, providerId, email) => {
    e.stopPropagation();
    if (isPastShift) {
      setSnackbarMessage("You cannot select past shifts.");
      setSnackbarOpen(true);
      return;
    }

    const currentUserName = `${user.first_name} ${user.last_name}`;

    setSelectedDndIds((prevSelectedDndIds) => {

      if (prevSelectedDndIds.includes(dndId)) {
        // Uncheck logic
        setTotalClicks(prev => prev - 1);
        setCheckedStates(prev => ({ ...prev, [dndId]: false }));
        if (dndId === firstSelectedShift?.dndId) {
          setFirstSelectedShift(null);
        }
        const updatedSelectedIds = prevSelectedDndIds.filter(id => id !== dndId);
        return updatedSelectedIds;
      } else if (prevSelectedDndIds.length < 2) {
        if (totalClicks === 0) {
          if (eventName !== currentUserName) {
            setSnackbarMessage("You must select your own shift first.");
            setSnackbarOpen(true);
            return prevSelectedDndIds;
          }
          setFirstSelectedShift({ dndId, name: eventName, startDate, startTime, endTime, providerId, email });
        } else if (totalClicks === 1) {
          if (eventName === currentUserName) {
            setSnackbarMessage("Second click must be another user's shift.");
            setSnackbarOpen(true);
            return prevSelectedDndIds;
          }
          const senderSwap = firstSelectedShift;
          const receiverSwap = { dndId, name: eventName, startDate, startTime, endTime ,providerId, email};

          const isValid = hasAtLeast8Hours(
            senderSwap.startDate, senderSwap.startTime, senderSwap.endTime,
            receiverSwap.startDate, receiverSwap.startTime, receiverSwap.endTime
          );

          if (isValid) {
            setSenderSwapInfo(senderSwap);
            setReceiverSwapInfo(receiverSwap);
            setShowSwapDialog(true);
          } else {
            setSwapErrorDialog(true);
          }
        }
        setTotalClicks(prev => prev + 1);
        setCheckedStates(prev => ({ ...prev, [dndId]: true }));
        const updatedSelectedIds = [...prevSelectedDndIds, dndId];
        return updatedSelectedIds;
      }

      resetSwapStates();
      setSnackbarMessage("You can only select up to two shifts. Selection has been reset.");
      setSnackbarOpen(true);
      return [];
    });
  }, [totalClicks, user, firstSelectedShift]);

  const resetSwapStates = () => {
    setSenderSwapInfo(undefined);
    setReceiverSwapInfo(undefined);
    setSelectedDndIds([]);
    setTotalClicks(0);
    setCheckedStates({});
    setFirstSelectedShift(null);
  };


  useEffect(() => {
    return () => {
      resetSwapStates();
    };
  }, [schedule]);

   const hasAtLeast8Hours = (oneDate, oneStartTime, oneEndTime, twoDate, twoStartTime, twoEndTime) => {
    const oneStart = new Date(`${oneDate}T${oneStartTime}`);
    const oneEnd = new Date(`${oneDate}T${oneEndTime}`);
    const twoStart = new Date(`${twoDate}T${twoStartTime}`);
    const twoEnd = new Date(`${twoDate}T${twoEndTime}`);

    if (oneStart <= twoStart) {
        const oneEndHrs = moment(oneEnd).hours();
        const twoStartHrs = moment(twoStart).hours();
        if(oneEnd < oneStart){
          if(twoStartHrs - oneEndHrs >= 8){
            return true
          }else {
            return false
          }
        }

        if((24 - oneEndHrs + twoStartHrs) >= 8){
          return true
        }else {
          return false
        }
    } else if (twoStart <= oneStart) {
        
        const oneStartHrs = moment(oneStart).hours();
        const twoEndHrs = moment(twoEnd).hours();

        if(twoEnd < twoStart){
          if(oneStartHrs - twoEndHrs >= 8){
            return true
          }else {
            return false
          }
        }
        if((24 - twoEndHrs + oneStartHrs) >= 8){
          return true
        }else {
          return false
        }  
    }

    return false;
    }

  //  if(allow){
  //   const receiverSwap = receiverSwapInfo
  //   const senderSwap = senderSwapInfo
  //  let isValidSwap = false
  //       for(let i = 0; i < data2.length; i++){
  //       if(receiverSwap){
  //         if(data2[i].dataValues.providerId == receiverSwap.providerId && data2[i].scheduleData.shifts.departmentID == currentDepartment){
  //         if ( data2[i].dataValues.start_date != receiverSwap.startDate && moment(data2[i].dataValues.start_date, "YYYY-MM-DD").add(1, 'day').isSame(receiverSwap.startDate) || moment(data2[i].dataValues.start_date, "YYYY-MM-DD").subtract(1, 'day').isSame(receiverSwap.startDate) ){
  //           if(hasAtLeast8Hours(data2[i].dataValues.start_date, data2[i].scheduleData.shifts.start_time, data2[i].scheduleData.shifts.end_time, receiverSwap.startDate, senderSwap.startTime, senderSwap.endTime)){
  //             isValidSwap = true
  //           }else {
  //             isValidSwap = false
  //             break
  //           }
  //         }
  //         else {
  //           isValidSwap = true
  //         }
  //       }

  //       if(data2[i].dataValues.providerId == senderSwap.providerId && data2[i].scheduleData.shifts.departmentID == currentDepartment){
  //         if ( data2[i].dataValues.start_date != senderSwap.startDate && moment(data2[i].dataValues.start_date, "YYYY-MM-DD").add(1, 'day').isSame(senderSwap.startDate) || moment(data2[i].dataValues.start_date, "YYYY-MM-DD").subtract(1, 'day').isSame(senderSwap.startDate) ){
  //           if(hasAtLeast8Hours(data2[i].dataValues.start_date, data2[i].scheduleData.shifts.start_time, data2[i].scheduleData.shifts.end_time, senderSwap.startDate, receiverSwap.startTime, receiverSwap.endTime)){
  //             isValidSwap = true
  //           }else {
  //             isValidSwap = false
  //             break
  //           }
  //         }
  //         else {
  //           isValidSwap = true
  //         }
  //       }
        
  //       }
  //     }
  //     if(isValidSwap){
  //       setShowSwapDialog(true)
  //       }
  //     else {
  //       setSwapErrorDialog(true)
  //       setSenderSwapInfo(undefined)
  //       setReceiverSwapInfo(undefined)
  //     }
  //       setAllow(false)
  //  }

  //   if (clickedCount === 2 && receiverSwapInfo) {

  //     if(moment(senderSwapInfo.startDate).isBefore(moment(new Date())) || moment(receiverSwapInfo.startDate).isBefore(moment(new Date()))){
  //       console.log("came here");
  //       setSenderSwapInfo(undefined)
  //       setReceiverSwapInfo(undefined)
  //     setShowSwapPreviousDayNotAllowed(true)
  //     setClickedCount(0)
  //     return
  //   }
  //       setAllow(true)
  //     setClickedCount(0)
  //   }

   
  return (
    <>
      <Grid
        className='group-schedule-page'
        alignItems="center"
        style={{
          gap: '15px',
          display: 'flex',
          marginTop: '12px',
          marginBottom: '16px'
        }}
      >
         {Object.entries(filters).map(([key, filter], index) => (
      <Grid xs={12} sm={3} key={index} style={{ maxWidth: '20%' }}>
        <TextField
          fullWidth
          label={filter.label}
          name={key}
          onChange={e => handleFilters(key, e.target.value)}
          select
          SelectProps={{ native: true }}
          value={filter.value}
          required
          InputLabelProps={{
            shrink: true, // This will prevent the label from overlapping
          }}
        >
          {filter.options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </TextField>
      </Grid>
    ))}
        <Grid xs={12} sm={3}>
          <Typography
            style={{
              fontFamily: 'Poppins',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '18px',
              letterSpacing: '0.03em',
              textAlign: 'left',
              height: '24px',
              width: '505px'
            }}
          >
            Info: Send a swap request to your co-members by selecting your time
            zone and theirs, enabling you to exchange shifts that they will
            approve for convenience.
          </Typography>
        </Grid>
      </Grid>     
      
      {schedule && showCalendar ? (
  <Box p={2} style={{ border: '1px solid #DFDFDF', marginTop: '10px' }}>
    <Box>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{
          marginBottom: '10px',
          paddingBottom: '20px',
          borderBottom: '1px solid #DFDFDF',
          marginTop: '5px'
        }}
      >
        <Typography
          style={{
            fontWeight: '600',
            fontSize: '20px',
            letterSpacing: '0.03em',
            marginRight: '10px',
            color: '#3A3A3A',
            textTransform: 'uppercase'
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
              padding: '3px',
              backgroundColor: '#fff'
            }}
          >
            <ChevronLeftIcon style={{ color: '#2872C1' }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            style={{
              border: '1px solid #2872C1',
              borderRadius: '2px',
              padding: '3px',
              backgroundColor: '#fff'
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
        >
          Today
        </Button>
      </Grid>
      { isLoading ? <CircularProgress style={{display: "flex", margin: "150px 0px", marginLeft: "50%"}}/> 
      : <FullCalendar
        ref={calendarRef}
        plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
        editable={false}
        aspectRatio={1.5}
        contentHeight="auto"
        resourceAreaWidth="210px"
        events={events}
        key={schedule}
        initialDate={currentDate}
        resources={[]}
        eventClick={handleEventClick}
        showNonCurrentDates={false}
        eventContent={eventInfo => {
          const { event } = eventInfo;
          const CurrentUser = `${user.first_name} ${user.last_name}`;
          const isCurrentUser = event.extendedProps.name === CurrentUser;
          const isPastShift = moment(event.start).isBefore(moment(), 'day');
          
          return (
            <div style={{ padding: '5px' , width:'-webkit-fill-available'}}>
              <Typography variant="caption" style={{ fontWeight: 600 }}>
                {event.extendedProps.shiftname}
              </Typography>
              <Typography variant="caption" display="block">
                {event.title}
              </Typography>
              <div style={{ 
                background: isCurrentUser ? '#DFEEFF' : '#FAF4D6', 
                padding: '5px', 
                display: 'flex', 
                alignItems: 'center', 
                marginTop: '5px',
                width:'100%', 
              }}>
               <span onClick={(e) => handleCheckBoxClick(
                  e, 
                  event.id, 
                  event.extendedProps.dndID, 
                  isPastShift, 
                  event.extendedProps.name, 
                  event.extendedProps.onDate, 
                  event.extendedProps.beginTime, 
                  event.extendedProps.closeTime,
                  event.extendedProps.providerId,
                  event.extendedProps.email
                )}>
                  {checkedStates[event.extendedProps.dndID] ? 
                    <CheckBoxIcon style={{ fontSize: '18px', color: '#2872C1' , marginRight:'7px'}} /> : 
                    <CheckBoxOutlineBlankIcon style={{ fontSize: '18px', marginRight:'7px' }} />
                  }
                </span>
                <Typography variant="caption" style={{ fontWeight: 600 }}>
                  {event.extendedProps.name}
                </Typography>
              </div>
            </div>
          );
        }}
        views={{
          dayGridMonth: {
            dayHeaderFormat: { weekday: 'long' }
          }
        }}
      />
      }
    </Box>
  </Box>
) : <Box mt={2} style={{
  fontSize: '16px',
  backgroundColor: '#F8F8F8',
  height: '55vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
}}>
  Please Apply Filters To Generate Data
</Box> }

<Snackbar
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'center',
  }}
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  message={snackbarMessage}
/>

      <Dialog
        open={showSwapDialog}
        onClose={() => {
          setSenderSwapInfo(undefined);
          setReceiverSwapInfo(undefined);
          setShowSwapDialog(false);
        }}
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: '#fff',
            color:'#000',
            fontFamily:'Poppins'
          }}
        >
          <Typography>SEND SWAP REQUEST</Typography>
          <Divider></Divider>
          <div style={{}}>
            <Typography>{`${senderSwapInfo && senderSwapInfo.name} ${moment(
              senderSwapInfo && senderSwapInfo.startTime,
              'h:mm A'
            ).format('HH:mm')} to ${moment(
              senderSwapInfo && senderSwapInfo.endTime,
              'h:mm A'
            ).format('HH:mm')} ${moment(
              senderSwapInfo && senderSwapInfo.startDate
            ).format('MMM DD YYYY')}`}</Typography>
            <Typography>{`${receiverSwapInfo &&
              receiverSwapInfo.name}  ${moment(
              receiverSwapInfo && receiverSwapInfo.startTime,
              'h:mm A'
            ).format('HH:mm')} to ${moment(
              receiverSwapInfo && receiverSwapInfo.endTime,
              'h:mm A'
            ).format('HH:mm')} ${moment(
              receiverSwapInfo && receiverSwapInfo.startDate
            ).format('MMM DD YYYY')}`}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
            <DialogActions>
            <Button style={{color: '#2872C1',backgroundColor: 'white', border: '1px solid#2872C1' }}
  variant="contained"
  onClick={() => {
    resetSwapStates();  // Reset all states when cancelling
    setShowSwapDialog(false);
  }}
  
>
  CANCEL
</Button>
<Button
  variant="contained"
  color="secondary"
  style={{ backgroundColor: '#2872C1', color: 'white' }}
  onClick={() => {
    // Fetch the selected department ID and hospital ID from filters
    const selectedDepartmentId = filters.department.value;
    const selectedHospitalId = filters.hospital.value;

    if (!selectedDepartmentId || !selectedHospitalId) {
      console.error("Department ID or Hospital ID is not selected. Cannot proceed with swap request.");
      // You might want to show an error message to the user here
      return;
    }

    const swapRequestData = {
      departmentID: filters.department.value,
      hospitalId: filters.hospital.value,
      name: `${user.first_name} ${user.last_name}`,
      userId: user.id,
      senderDndId: senderSwapInfo.dndId,
      receiverDndId: receiverSwapInfo.dndId,
      senderId: senderSwapInfo.providerId,
      receiverId: receiverSwapInfo.providerId,
      senderEmail: senderSwapInfo.email,
      receiverEmail: receiverSwapInfo.email,
      senderShiftTime: `${senderSwapInfo.startTime} - ${senderSwapInfo.endTime} ${senderSwapInfo.startDate}`,
      receiverShiftTime: `${receiverSwapInfo.startTime} - ${receiverSwapInfo.endTime} ${receiverSwapInfo.startDate}`
    };

    (async () => {
      try {
        const swapData = await schedullingServices.swapRequest(swapRequestData);
        openSnackbar('Your swap request is sent successfully!');
        // setSnackbarOpen(true);
        resetSwapStates();  // Reset all states after successful request
      } catch (error) {
        console.error("Error during swap request: ", error);
        setSnackbarMessage("Error sending swap request. Please try again.");
        setSnackbarOpen(true);
      }
    })();
    setSenderSwapInfo(undefined);
    setReceiverSwapInfo(undefined);
    setShowSwapDialog(false);
    setTotalClicks(0);
    setCheckedStates({});
    
  }}
>
  Confirm
</Button>

            </DialogActions>
          </div>
        </div>
      </Dialog>
 
<Dialog
        open={showSwapErrorDialog}
        onClose={() => {
          setSenderSwapInfo(undefined);
          setReceiverSwapInfo(undefined);
          setSwapErrorDialog(false);
        }}
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background:'#fff',
            color:'#000',
            fontFamily:'Poppins'
          }}
        >
          <Typography>SEND SWAP REQUEST</Typography>
          <Divider></Divider>
          <div style={{}}>
            <Typography>{`There should be at least 8 hours of off time between shifts.`}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '25px', }}>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  setSenderSwapInfo(undefined);
                  setReceiverSwapInfo(undefined);
                  setSwapErrorDialog(false);
                  setTotalClicks(0);
                  setCheckedStates({});
                }}
              >
                OKAY
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={showSwapPreviousDayNotAllowed}
        onClose={() => {
          setShowSwapPreviousDayNotAllowed(false);
        }}
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background:'#fff',
            color:'#000',
            fontFamily:'Poppins'
          }}
        >
          <Typography>SEND SWAP REQUEST</Typography>
          <Divider></Divider>
          <div style={{}}>
            <Typography>{`You cannot send a swap request for a historical shift. Please contact your administrator.`}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '25px',  }}>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => {
                  setShowSwapPreviousDayNotAllowed(false);
                }}
              >
                OKAY
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={showSwapEmailDialog}
        onClose={() => setShowSwapEmailDialog(false)}
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'start'
          }}
        >
          <div>
            <Typography>Send a swap request via email</Typography>
            <Typography>
              {"All providers within your department will recieve an email with your swap request and department admin will be cc'ed"}
            </Typography>
            <Typography>{`You: ${senderSwapInfo &&
              senderSwapInfo.name} ${senderSwapInfo &&
              senderSwapInfo.startDate} ${senderSwapInfo &&
              senderSwapInfo.startTime} ${senderSwapInfo &&
              senderSwapInfo.endTime}`}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => setShowSwapEmailDialog(false)}
              >
                CANCEL
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  (async () => {
                    await schedullingServices.swapRequest({
                      departmentID: currentDepartment,
                      email: user.email,
                      name: user.first_name + ' ' + user.last_name,
                      userId: user.id
                    });
                  })();
                  setShowSwapEmailDialog(false);
                }}
              >
                SEND SWAP REQUEST
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default GroupSchedulePage;
