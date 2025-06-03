import React, { useEffect, useState, useRef } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Autocomplete, Box, Button, Card, Grid, IconButton, TextField, Typography } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PlaceHolder } from '../../MonitoringRenewal/ui';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import hospitalsService from '../../../services/hospitalsService';
import departmentsService from '../../../services/departmentsService';
import schedullingServices from '../../../services/schedullingServices';
import useBreakpoints from 'src/hooks/useBreakpoints';
import moment from 'moment';
import '../GroupSchedule/style.css';

const transformSchedulesToEvents = schedules => {
  return schedules.map(schedule => ({
    id: schedule.id,
    title: schedule.name,
    start: `${schedule.start_date}T${schedule.shift_details.start_time}`,
    end: schedule.end_date
      ? `${schedule.end_date}T${schedule.shift_details.end_time}`
      : `${schedule.start_date}T${schedule.shift_details.end_time}`,
    resourceId: schedule.resourceID,
    notes: schedule.notes
  }));
};

const ScheduleAccordion = props => {
  const scheduleName = props.name || 'No Schedule Name';
  const startDate = props.start_date || new Date();
  const endDate = props.end_date || new Date();
  // const calendarEvents = props.dndSchedules || [];

  const calendarEvents = transformSchedulesToEvents(props.dndSchedules);

  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(startDate);

  const { isMobile } = useBreakpoints();

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

  return (
    <Accordion
      elevation={0}
      sx={{
        my: 2,
        border: '1px solid #DFDFDF'
      }}
    >
      <AccordionSummary
        expandIcon={
          <ArrowDropDownRoundedIcon
            sx={{ fontSize: { xs: '30px', md: '40px' }, color: '#2872C1' }}
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
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {calendarEvents.length > 0 ? (
          <>
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
                  color: '#3A3A3A',
                  textTransform: 'uppercase'
                }}
              >
                {moment(currentDate).format('MMMM YYYY')}
              </Typography>
              <div
                style={{ display: 'flex', gap: '12px', marginInline: '12px' }}
              >
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
            <Box
              sx={{
                width: '100%',
                overflowX: 'auto', // Enables horizontal scrolling
                display: 'block',
                paddingBottom: '10px' // Prevents scrollbar overlap
              }}
            >
              <Box sx={{ minWidth: '1000px' }}>
                <FullCalendar
                  ref={calendarRef}
                  plugins={[
                    resourceTimelinePlugin,
                    dayGridPlugin,
                    interactionPlugin
                  ]}
                  initialView="dayGridMonth"
                  schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                  editable={false}
                  aspectRatio={1.5}
                  contentHeight="auto"
                  resourceAreaWidth="210px"
                  events={calendarEvents}
                  key={scheduleName}
                  initialDate={currentDate}
                  resources={[]}
                  showNonCurrentDates={false}
                  eventContent={eventInfo => {
                    const { event } = eventInfo;
                    return (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '5px',
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%',
                          fontSize: '12px',
                          fontWeight: 600,
                          margin: '8px',
                          border: '2px solid #DFEEFF'
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            color: '#333',
                            padding: '5px'
                          }}
                        >
                          {event.start.toLocaleString('default', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}{' '}
                          -{' '}
                          {event.end.toLocaleString('default', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div
                          style={{
                            width: '100%',
                            backgroundColor: '#DFEEFF',
                            color: '#333',
                            padding: '5px'
                          }}
                        >
                          {event.title}
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
              </Box>
            </Box>
          </>
        ) : (
          <PlaceHolder text="No Schedule Data Available" />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const DraftSchedule = () => {
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [draftSchedule, setDraftSchedule] = useState(null);

  const placeholderText = `Please select ${selectedHospital ? 'Department' : 'Hospital'} to view draft schedule`;

  const fetchHospitals = async () => {
    try {
      const data = await hospitalsService.getHospitals();
      setHospitals(data);
    } catch (error) {
      setHospitals([]);
      console.error('Error fetching hospitals:', error);
    }
  };

  const fetchDepartments = async hospitalId => {
    try {
      setDepartments([]); // Reset departments before fetching
      setSelectedDepartment(null); // Reset selected department
      setDraftSchedule(null); // Reset draft schedule
      const data = await departmentsService.getDepartments(hospitalId);
      setDepartments(data);
    } catch (error) {
      setDepartments([]);
      console.error('Error fetching departments:', error);
    }
  };

  const fetchDraftSchedule = async departmentId => {
    try {
      const data = await schedullingServices.getDraftSchedule(departmentId);
      setDraftSchedule(data);
    } catch (error) {
      setDraftSchedule(null);
      console.error('Error fetching draft schedule:', error);
    }
  };

  // Fetch hospitals on mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Fetch departments when hospital changes
  useEffect(() => {
    if (selectedHospital?.id) {
      fetchDepartments(selectedHospital.id);
    }
  }, [selectedHospital]);

  // Fetch draft schedule when department changes
  useEffect(() => {
    if (selectedDepartment?.id) {
      fetchDraftSchedule(selectedDepartment.id);
    }
  }, [selectedDepartment]);

  return (
    <Box sx={{ py: 2, minHeight: '50vh' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Autocomplete
            options={hospitals}
            getOptionLabel={option => option.name}
            value={selectedHospital}
            onChange={(_, value) => setSelectedHospital(value)}
            renderOption={(props, option) => (
              <li {...props}>
                <div>
                  <span>{option.name}</span>
                  <br />
                  {(option.country || option.state) && (
                  <small style={{ color: '#555' }}>
                    ({option.country ? `${option.country},` : ''} {option.state})
                  </small>
                  )}
                </div>
              </li>
            )}
            renderInput={params => (
              <TextField {...params} label="Select Hospital" />
            )}
            disableClearable
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Autocomplete
            options={departments}
            getOptionLabel={option => option.name}
            value={selectedDepartment}
            onChange={(_, value) => setSelectedDepartment(value)}
            renderInput={params => (
              <TextField {...params} label="Select Department" />
            )}
            disabled={!selectedHospital}
            disableClearable
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              backgroundColor: '#F8F8F8',
              color: '#3A3A3A',
              fontSize: '12px',
              px: 2,
              py: { xs: 2, md: 0 },
              alignContent: 'center',
              minHeight: '100%'
            }}
          >
            <span style={{ fontWeight: 600 }}>Info:</span>{' '}
            {
              'You can view the draft schedule for a department by selecting a hospital and then a department. And you can also view the schedule by clicking on the schedule name in the accordion below.'
            }
          </Card>
        </Grid>
        <Grid size={12}>
          {draftSchedule ? (
            draftSchedule.length > 0 ? (
              draftSchedule.map(schedule => (
                <ScheduleAccordion key={schedule.id} {...schedule} />
              ))
            ) : (
              <PlaceHolder text="No Data Available" />
            )
          ) : (
            <PlaceHolder text={placeholderText} />
          )}
        </Grid>
      </Grid>
      {/* Example: Show draft schedule data */}
    </Box>
  );
};

export default DraftSchedule;
