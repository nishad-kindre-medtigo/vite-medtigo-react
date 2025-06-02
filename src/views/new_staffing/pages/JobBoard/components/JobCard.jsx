import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, IconButton, Collapse, Divider } from '@mui/material';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StaffingContext } from '../../../../../context/StaffingContext';
import staffingServices from '../../../../../services/staffingServices';
import ApplyForJobPopup from './ApplyForJobPopup';
import { ApplyButton } from '../../../components';

const JobCard = props => {
  const { data, userSavedJobs } = props;
  const { refreshJobs, userAppliedJobs } = useContext(StaffingContext);
  const [expanded, setExpanded] = useState(false);
  const [openApplyPopup, setOpenApplyPopup] = useState(false);
  const [applyButtonClick, setApplyButtonClick] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApplyJobPopup = () => {
    setOpenApplyPopup(true);
  };

  const handleSaveJob = async data => {
    setIsBookmarked(!isBookmarked);
    await staffingServices.saveJob(data.Id);
    refreshJobs();
  };

  const handleShowJobDetail = async data => {
    setExpanded(true);
  };

  const replaceNewLinesWithBR = text => {
    return text.replace(/(?<!\d)\.\s*/g, '.<br>');
  };

  // Reset the expanded state when the job data changes
  useEffect(() => {
    setExpanded(false); // Collapse the job when component re-renders or data changes
  }, [data.Id]);

  useEffect(() => {
    const isJobBookmarked = userSavedJobs.some(job => job.jobID === data.Id);
    setIsBookmarked(isJobBookmarked);
  }, [userSavedJobs, data.Id]);

  useEffect(() => {
    const isJobApplied = userAppliedJobs.some(job => job.jobID === data.Id);
    setApplyButtonClick(isJobApplied);
  }, [userAppliedJobs, data.Id]);

  return (
    <Box
      sx={{
        p: 2,
        border: '1px solid #DADADA',
        borderRadius: '4px',
        boxShadow: '0px 8px 24px 0px #959DA533',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 8px 24px 0px #444a5033',
          transition: 'box-shadow 0.2s ease 0.2s'
        }
      }}
    >
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Grid item xs={12} md={10}>
          <Typography mb={1} style={{ color: '#121224', fontWeight: 600, fontSize: '18px' }}>
            {data.Job_Title}
          </Typography>
          <Box
            mb={2}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              color: '#4C4B4B',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '21px'
            }}
          >
            <span>
              Profession:{' '}
              {data.Provider_Profession
                ? data.Provider_Profession.join(', ')
                : 'N/A'}
            </span>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <span>
              Specialty: {data.Specialty ? data.Specialty.join(', ') : 'N/A'}
            </span>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <span>Type: {data.Job_Type || 'N/A'}</span>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <span>Status: {data.Job_Status || 'N/A'}</span>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <span>State: {data.State || 'N/A'}</span>
          </Box>
        </Grid>
        <Grid item xs={12} md={2} container
          direction={{ sm: 'row', md: 'column' }} // Change stacking of grid items based on view
          justifyContent={{ xs: 'flex-end', md: 'center' }}
          alignItems="flex-end"
        >
          <Grid item>
            <IconButton onClick={() => handleSaveJob(data)}>
              {isBookmarked ? (
                <BookmarkOutlinedIcon style={{ color: '#2872C1' }} />
              ) : (
                <BookmarkBorderIcon style={{ color: '#2872C1' }} />
              )}
            </IconButton>
            <ApplyButton
              variant="contained"
              disabledbutton={applyButtonClick}
              onClick={() => {
                if (!applyButtonClick) {
                  handleApplyJobPopup();
                }
              }}
              disableElevation
            >
              {applyButtonClick ? 'Applied' : 'Apply'}
            </ApplyButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => (expanded ? setExpanded(false) : handleShowJobDetail(data))}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      <Collapse in={expanded}>
        <hr style={{ color: '#CDCDCD', marginBlock: '16px' }} />
        <Box>
          <Typography mb={1} style={{ fontWeight: 600, fontSize: '16px' }}>
            Job Description:{' '}
          </Typography>
          {data.Detail ? (
            <Typography
              dangerouslySetInnerHTML={{
                __html: replaceNewLinesWithBR(data.Detail)
              }}
              component="span"
              style={{ color: '#4C4B4B', fontWeight: 400, fontSize: '16px' }}
            />
          ) : (
            <Typography component="span" style={{ color: '#4C4B4B', fontWeight: 400, fontSize: '16px' }}>
              No Job Description Provided
            </Typography>
          )}
        </Box>
      </Collapse>

      <ApplyForJobPopup open={openApplyPopup} setOpen={setOpenApplyPopup} id={data.Id} title={data.Job_Title} owner={data.Job_Owner.email}/>
    </Box>
  );
};

export default JobCard;
