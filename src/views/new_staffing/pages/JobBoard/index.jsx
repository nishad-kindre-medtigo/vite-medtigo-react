import React, { useState, useContext } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ContentBox } from '../../components';
import { StaffingContext } from 'src/context/StaffingContext';
import { useSelector } from 'react-redux';
import { specialityOptions } from '../../../../appConstants';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { JobCardSkeleton, JobFilterPanel, JobSearchbar, JobSpecialtyFilter, JobCard, JobsContainer } from './components';
import { PlaceHolder } from './ui';

const JobBoardPage = () => {
  const { isTablet } = useBreakpoints();
  const { designation_name: Designation } = useSelector(state => state.account.user);
  const [searchJobTitle, setSearchJobTitle] = useState('');
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [currentJobs, setCurrentJobs] = useState({ all: true, saved: false, applied: false });
  const { isLoading, jobsData, userAppliedJobs, userSavedJobs } = useContext(StaffingContext);

  // Filters to store multiple values for some parameters & single  for others
  const [filters, setFilters] = useState({
    jobType: [],
    profession: [],
    state: [],
    status: [],
    jobTitle: '',
    specialty: ''
  });

  // Common Function to Update filter object
  const updateFilter = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value
    }));
  };

  // Function to handle state changes for different job views
  const showAllJobs = () => {
    setCurrentJobs({ all: true, saved: false, applied: false });
  };

  const showSavedJobs = () => {
    setCurrentJobs({ all: false, saved: true, applied: false });
  };

  const showAppliedJobs = () => {
    setCurrentJobs({ all: false, saved: false, applied: true });
  };

  const isSelectedInOptions = (options, selected) => {
    return selected.some(item => options.includes(item));
  };

  const abbreviation = Designation.split(' ').map(word => word[0]).join('');

  // Create sets for quick lookup
  const savedJobIds = new Set(userSavedJobs.map(item => item.jobID));
  const appliedJobIds = new Set(userAppliedJobs.map(item => item.jobID));

  let allJobs = [];
  let savedJobs = [];
  let appliedJobs = [];

  if (jobsData) {

    // All jobs displayed based on filters applied
    allJobs = jobsData
      .filter(job => job.Country === 'USA' && job.Job_Status !== 'Closed')
      .filter(job => !searchJobTitle || job.Job_Title.toLowerCase().includes(searchJobTitle.toLowerCase()))
      .filter(job => !filters.specialty || job.Specialty.includes(filters.specialty))
      .filter(job => !filters.jobType.length || filters.jobType.includes(job.Job_Type))
      .filter(job => !filters.state.length || filters.state.includes(job.State))
      .filter(job => !filters.status.length || filters.status.includes(job.Job_Status))
      .filter(job => !filters.profession.length || isSelectedInOptions(filters.profession, job.Provider_Profession));
  
    savedJobs = jobsData.filter(item => savedJobIds.has(item.Id));

    appliedJobs = jobsData.filter(item => appliedJobIds.has(item.Id));
  }

  return (
    <Box sx={{ background: '#F8F9FA', py: 2, mb: 2 }}>
      <ContentBox>
        {currentJobs.applied && (
          <Box>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography component='span' onClick={showAllJobs} style={{ fontSize: '20px', fontWeight: 600, cursor: 'pointer' }}>
                  {'< Applied Jobs'}
                </Typography>
              </Grid>
              <Grid size={12} container spacing={2}>
                {appliedJobs.length === 0 ? (
                  <PlaceHolder text="No Applied Jobs Found" />
                ) : (
                  appliedJobs.map((job, key) => (
                    <Grid size={12} key={key}>
                      <JobCard data={job} userSavedJobs={userSavedJobs} />
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Box>
        )}
        {currentJobs.saved && (
          <Box>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography component='span' onClick={showAllJobs} style={{ fontSize: '20px', fontWeight: 600, cursor: 'pointer' }}>
                  {'< Saved Jobs'}
                </Typography>
              </Grid>
              <Grid size={12} container spacing={2}>
                {savedJobs.length === 0 ? (
                  <PlaceHolder text="No Saved Jobs Found" />
                ) : (
                  savedJobs.map((job, key) => (
                    <Grid size={{ xs: 12, sm: 9 }} key={key}>
                      <JobCard data={job} userSavedJobs={userSavedJobs} />
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Box>
        )}
        {currentJobs.all && (
          <>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                <JobSearchbar searchJobTitle={searchJobTitle} setSearchJobTitle={setSearchJobTitle} updateFilter={updateFilter}/>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <JobSpecialtyFilter specialityOptions={specialityOptions} updateFilter={updateFilter}/>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#2872C1',
                    display: 'flex',
                    justifyContent: { xs: 'space-between', md: 'flex-end' },
                    gap: 2
                  }}
                >
                  <span onClick={showSavedJobs} style={{ display: 'flex', alignItems: 'center' }}>
                    <BookmarkOutlinedIcon style={{ color: '#2872C1' }} />
                    Saved Jobs
                  </span>
                  <span onClick={showAppliedJobs} style={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon style={{ color: '#2872C1' }} />
                    Applied Jobs
                  </span>
                </Box>
              </Grid>
              {isTablet && (
                <Grid size={{ xs: 12, md: 2 }}>
                  <Box
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#2872C1',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}
                  >
                    <span onClick={() => setOpenFilterDrawer(prev => !prev)} style={{ display: 'flex', alignItems: 'center' }}>
                      <FilterListRoundedIcon style={{ color: '#2872C1' }} />
                      Filter
                    </span>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Box my={2}>
              <Grid container spacing={2}>
                <Grid size={{ sm: 0, md: 3 }} display={isTablet && 'none'}>
                  <JobFilterPanel
                    showAppliedJobs={showAppliedJobs}
                    appliedJobs={appliedJobs}
                    updateFilter={updateFilter}
                    setAllFilters={setFilters}
                    openFilterDrawer={openFilterDrawer}
                    setOpenFilterDrawer={setOpenFilterDrawer}
                  />
                </Grid>
                <Grid size={{ sm: 12, md: 9 }}>
                  {isLoading ? (
                    <JobCardSkeleton />
                  ) : (
                    <JobsContainer allJobs={allJobs} userSavedJobs={userSavedJobs} />
                  )}
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </ContentBox>
    </Box>
  );
};

export default JobBoardPage;
