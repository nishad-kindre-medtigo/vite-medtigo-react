import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography, IconButton, Button, Grid, Tooltip } from '@mui/material';
import './style.css';
import schedullingServices from '../../../services/schedullingServices';
import { useSelector } from 'react-redux';
import moment from 'moment';

const MySchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const calendarRef = React.createRef();
  const { user } = useSelector(state => state.account);

  async function eventttt(){
    const events= await  schedullingServices.getUserSchedulednd(user.id)
    setData1(events.data);
    setData2(events.data2);
    }

  useEffect(()=>{  
    eventttt()
  },[])

  let obj3=[]
 
  for(var i=0,len=data1.length; i<len;i++){
    let id=data1[i].resourceID
    for(var j=0,leng=data2.length; j<leng;j++){
      let id1= data2[j][0] ? data2[j][0].id : -1
      if(id==id1){
         obj3[i] = {...data1[i], ...data2[j][0]}
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

  return (
    <>
      <Box className='my-schedule-page' p={2} style={{ border: '1px solid #DFDFDF', marginTop: '10px' }}>
        <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom:'10px' , paddingBottom:'20px', borderBottom:'1px solid #DFDFDF'}}>
          <Typography style={{ fontWeight: '600', fontSize: '20px', letterSpacing: '0.03em', marginRight: '10px', color: '#3A3A3A' }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
          <div style={{ display: 'flex', gap: '10px' }}>
            <IconButton onClick={handlePrev} style={{ border: '1px solid #2872C1', borderRadius: '2px', padding: '3px' }}>
              <ChevronLeftIcon style={{ color: '#2872C1' }} />
            </IconButton>
            <IconButton onClick={handleNext} style={{ border: '1px solid #2872C1', borderRadius: '2px', padding: '3px' }}>
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
                color: '#FFFFFF',
              }
            }}
          >
            Today
          </Button>
        </Grid>
        <FullCalendar
  ref={calendarRef}
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  fixedWeekCount={false}
  headerToolbar={false}
  aspectRatio={1.35}
  showNonCurrentDates={true}
  firstDay={0}
  dayHeaderFormat={{ weekday: 'short'}}
  dayCellContent={(args) => {
    const eventsForDay = eventt.filter(event =>
      moment(args.date).isSame(moment(event.start), 'day')
    );
  
    // Format the day number with two digits (e.g., 01, 02, etc.)
    const dayNumber = args.dayNumberText.padStart(2, '0');
  
    return (
      <Box
        sx={{
          height: '100%',
              p: 1,
              backgroundColor: '#f5f5f5',
        }}
      >
        {/* Event Title and Day Number in Row Layout */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Align items on opposite sides
            alignItems: 'flex-start', // Align titles to the top
            marginBottom: '4px',
            // backgroundColor: eventsForDay.length > 0 ? '#F6F6F6' : 'transparent',
            // padding: eventsForDay.length > 0 ? '4px' : '0',
          }}
        >
          {/* Event Titles Stack Vertically */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1, // Allow this box to take available space
              paddingRight: '16px', // Add padding to create space from the right element
            }}
          >
        {eventsForDay.length > 0 &&
  eventsForDay.map((event, index) => (
    <Box
      key={index}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Align the text and icon horizontally
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
          wordBreak: 'break-word', // Ensures text wraps if long
          width: '100%', // Ensure it takes up the full available width
        }}
      >
        {event.title}
      </Typography>
      
      {/* Tooltip wrapping InfoIcon */}
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
    </Box>
  ))}

          </Box>
          {/* Day Number Display */}
         
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
              flexShrink: 0, // Prevent this element from shrinking
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
    </>
  );
};

export default MySchedulePage;
