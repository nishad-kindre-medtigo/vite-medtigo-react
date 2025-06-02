import React, { useState, useEffect } from 'react';
import { Grid, Pagination, Typography, Box } from '@mui/material';
import JobCard from './JobCard';
import { PlaceHolder } from '../ui';

const JobsContainer = ({ allJobs, userSavedJobs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 7; // Number of jobs to display per page

  // Calculate the total number of pages
  const totalPages = Math.ceil(allJobs?.length / jobsPerPage);

  // Function to handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Set the page number first
  };

  // Determine the jobs to display on the current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Calculate the job range for display (e.g., "Showing 1-7 of 100 jobs")
  const startJobIndex = indexOfFirstJob + 1;
  const endJobIndex = Math.min(indexOfLastJob, allJobs.length);

  // Scroll to top when currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Reset the page to 1 when the allJobs prop changes (due to filtering)
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [allJobs]);

  return (
    <div>
      {/* Text showing job range (e.g., "Showing 1-7 of 100 jobs") */}
      {currentJobs.length > 0 && (
        <Box mb={1}>
          <Typography variant="body2" color="#4C4B4B">
            {`Showing ${startJobIndex}-${endJobIndex} of ${allJobs.length} jobs`}
          </Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        {currentJobs.length === 0 ? (
          <PlaceHolder />
        ) : (
          <>
            {currentJobs.map((job, key) => (
              <Grid item xs={12} key={key}>
                <JobCard data={job} userSavedJobs={userSavedJobs} />
              </Grid>
            ))}
          </>
        )}
      </Grid>

      {/* Pagination Component */}
      {currentJobs.length > 0 && totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          sx={{ mt: 2, justifyContent: 'center', display: 'flex' }} // Center the pagination
        />
      )}
    </div>
  );
};

export default JobsContainer;
