import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography, IconButton, Button, Grid, Tooltip, useMediaQuery, useTheme, Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions } from '@mui/material';
import schedullingServices from '../../../services/schedullingServices';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Close } from '@mui/icons-material';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const calendarRef = React.createRef();
  const { user } = useSelector(state => state.account);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialogEvent, setOpenDialogEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (window.location.pathname === "/schedule/my-schedule") {
      const hasReloaded = sessionStorage.getItem("hasReloaded");
      if (!hasReloaded) {
        sessionStorage.setItem("hasReloaded", "true");
        window.location.reload();
      }
    }
  
    window.addEventListener("load", () => {
      sessionStorage.removeItem("hasReloaded");
    });
  
    // Listen for tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const hasReloaded = sessionStorage.getItem("hasReloaded");
        if (!hasReloaded) {
          sessionStorage.setItem("hasReloaded", "true");
          window.location.reload();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  // Inline styles to replace external CSS and add responsive scrolling
  const styles = `
    .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
      margin-bottom: 0em;
    }

    .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events {
      min-height: 0em;
    }

    .fc, .fc *, .fc :after, .fc :before {
      box-sizing: border-box;
      color: black;
    }

    .custom-calendar {
      border-top: 2px solid #000;
      position: relative;
    }

    .fc .fc-toolbar {
      border: none !important;
    }

    .fc .fc-daygrid-day-frame,
    .fc .fc-daygrid-day-top,
    .fc .fc-daygrid-day-number {
      border: none !important;
      background: #F6F6F6;
    }

    .fc .fc-scrollgrid {
      border: none;
    }

    .fc-theme-standard td, .fc-theme-standard th {
      border: none;
    }

    .fc-scrollgrid-sync-table {
      border-collapse: separate;
      border-spacing: 2px 0;
    }

    .fc-daygrid-day-top {
      background: #F6F6F6;
    }

    @media (max-width: 600px) {
      .fc-scrollgrid {
        overflow-x: auto;
        display: block;
        width: 100%;
      }

      .fc-scrollgrid-sync-table {
        min-width: 800px; /* Ensure content is wider than screen */
      }

      .fc-day.fc-day-mon.fc-day-past.fc-day-other.fc-daygrid-day {
        width: 220px; /* Added mobile-specific width */
      }

      .fc-day.fc-day-tue.fc-day-past.fc-day-other.fc-daygrid-day {
        width: 220px; /* Added mobile-specific width */
      }

      .fc-day.fc-day-wed.fc-day-past.fc-day-other.fc-daygrid-day {
        width: 220px; /* Added mobile-specific width */
      }

      .fc-day.fc-day-thu.fc-day-past.fc-day-other.fc-daygrid-day {
        width: 220px; /* Added mobile-specific width */
      }

      .fc-day.fc-day-fri.fc-day-past.fc-day-other.fc-daygrid-day {
        width: 220px; /* Added mobile-specific width */
      }
      
      .fc-day.fc-day-sat.fc-day-past.fc-day-other.fc-daygrid-day {
        width: 220px; /* Added mobile-specific width */
      }
      
      .fc-day.fc-day-sun.fc-day-past.fc-day-other.fc-daygrid-day {
        width: 220px; /* Added mobile-specific width */
      }

      .fc-col-header-cell.fc-day.fc-day-sun {
      width: 220px;
      }

       .fc-col-header-cell.fc-day.fc-day-mon {
      width: 220px;
      }

       .fc-col-header-cell.fc-day.fc-day-tue {
      width: 220px;
      }

       .fc-col-header-cell.fc-day.fc-day-wed {
      width: 220px;
      }

       .fc-col-header-cell.fc-day.fc-day-thu {
      width: 220px;
      }

       .fc-col-header-cell.fc-day.fc-day-fri {
      width: 220px;
      }

       .fc-col-header-cell.fc-day.fc-day-sat {
      width: 220px;
      }

    }
  `;

  async function eventttt(){
    const events = await schedullingServices.getUserSchedulednd(user.id)
    setData1(events.data);
    setData2(events.data2);
  }

  useEffect(()=>{  
    eventttt()
  },[])

  let obj3 = []
 
  for (var i = 0, len1 = data1.length; i < len1; i++) {
    let id = data1[i].resourceID;
    for (var j = 0, len2 = data2.length; j < len2; j++) {
      let id1 = data2[j][0] ? data2[j][0].id : -1;
      if (id === id1) {
        obj3[i] = { ...data1[i], ...data2[j][0] };
      }
    }
  }

  let eventt = obj3
  .filter(value => value.schedules && value.schedules.status === 'published')
  .map(value => {
    const title = value.startTime && value.endTime
      ? `${value.startTime} - ${value.endTime}`
      : `${moment(value.shifts.start_time, "h:mm A").format('HH:mm')} - ${moment(value.shifts.end_time, "h:mm A").format('HH:mm')}`;

    return {
      end: value.end_date,
      start: value.start_date,
      title: title,
      department: `${value.schedules.departments?.name || 'Unknown Department'}`,
      hospital: `${value.schedules.departments.hospitals?.name || 'Unknown Hospital'}`,
      scheduleName: `${value.schedules?.name || 'Unknown Hospital'}`,
    };
  });

  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCurrentDate(calendarApi.getDate());
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCurrentDate(calendarApi.getDate());
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setCurrentDate(calendarApi.getDate());
  };
  

  const handleOpenMobileDialog = (event) => {
    if (isMobile) {
      setOpenDialogEvent(event);
    }
  };

  const handleCloseMobileDialog = () => {
    setOpenDialogEvent(null);
  };
  

  return (
    <>
      {/* Inject the styles */}
      <style>{styles}</style>
      
      <Box 
        p={2} 
        sx={{ 
          border: '1px solid #DFDFDF', 
          marginTop: '10px',
          overflowX: isMobile ? 'auto' : 'visible'
        }}
      >
        <Grid 
          container 
          justifyContent="center" 
          alignItems="center" 
          sx={{ 
            marginBottom:'10px', 
            paddingBottom:'20px', 
            borderBottom:'1px solid #DFDFDF',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '10px' : '0'
          }}
        >
          <Typography 
            style={{ 
              fontWeight: '600', 
              fontSize: '20px', 
              letterSpacing: '0.03em', 
              marginRight: '10px', 
              color: '#3A3A3A',
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: isMobile ? 'center' : 'flex-start',
              width: isMobile ? '100%' : 'auto'
            }}
          >
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
                  color: '#FFFFFF',
                }
              }}
            >
              Today
            </Button>
          </Box>
        </Grid>
        <Box 
          sx={{ 
            overflowX: isMobile ? 'auto' : 'visible',
            width: '100%'
          }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            fixedWeekCount={false}
            headerToolbar={false}
            aspectRatio={isMobile ? 0.5 : 1.35}
            showNonCurrentDates={true}
            firstDay={0}
            dayHeaderFormat={{ weekday: 'short'}}
            dayCellContent={(args) => {
              const eventsForDay = eventt.filter(event =>
                moment(args.date).isSame(moment(event.start), 'day')
              );
            
              const dayNumber = args.dayNumberText.padStart(2, '0');
            
              return (
                <Box
                  sx={{
                    height: '100%',
                    p: 1,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        paddingRight: '14px',
                      }}
                    >
                      {eventsForDay.length > 0 &&
                        eventsForDay.map((event, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#000000',
                                fontSize: '12px',
                                letterSpacing: '0.03em',
                                fontWeight: '500',
                                background: '#E0EFFF',
                                padding: '4px 6px',
                                wordBreak: 'break-word',
                                width: '100%',
                              }}
                            >
                              {event.title}
                            </Typography>
                            
                            {!isMobile ? (
                              <Tooltip
                                title={
                                  <>
                                    Department name: {event.department || 'Unknown Department'}
                                    <br />
                                    Hospital Name: {event.hospital || 'No additional info'}
                                    <br/>
                                    Schedule Name: {event.scheduleName || 'No additional info'}
                                  </>
                                }
                                arrow
                              >
                                <img src='/icons/InfoIcon.svg' style={{ cursor: 'pointer', marginLeft: '6px' , width:'20px'}} />
                              </Tooltip>
                            ) : (
                              <img 
                                src='/icons/InfoIcon.svg' 
                                style={{ cursor: 'pointer', marginLeft: '6px' , width:'20px'}} 
                                onClick={() => handleOpenMobileDialog(event)}
                              />
                            )}
                          </Box>
                        ))}
                    </Box>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Poppins',
                        fontSize: '20px',
                        fontWeight: 400,
                        lineHeight: '30px',
                        letterSpacing: '0.03em',
                        color: '#3A3A3A',
                        textAlign: 'right',
                        alignSelf: 'flex-start',
                        flexShrink: 0,
                      }}
                    >
                      {dayNumber}
                    </Typography>
                  </Box>
                </Box>
              );
            }}
            dayCellDidMount={(args) => {
              args.el.style.border = '10px solid #ffffff';
              args.el.style.margin = '2px';
            }}
            height="auto"
            contentHeight="auto"
            className='custom-calendar'
          />
        </Box>
      </Box>

      <Dialog
        open={openDialogEvent !== null}
        onClose={handleCloseMobileDialog}
        aria-labelledby="event-details-dialog"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Event Details
          <IconButton
            aria-label="close"
            onClick={handleCloseMobileDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" gutterBottom>
              <strong>Time:</strong> {openDialogEvent?.title || 'N/A'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Department:</strong> {openDialogEvent?.department || 'Unknown Department'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Hospital:</strong> {openDialogEvent?.hospital || 'No additional info'}
            </Typography>
            <Typography variant="body1">
              <strong>Schedule Name:</strong> {openDialogEvent?.scheduleName || 'No additional info'}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMobileDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Calendar;