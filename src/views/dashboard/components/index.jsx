import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { Box, Grid, Button, IconButton, List, ListItem, ListItemIcon, Skeleton, Tooltip, Typography } from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useNavigate } from 'react-router-dom';
import { CourseProgress } from 'src/views/Acquisition/MyLearning/ui';
import { StyledLink } from 'src/views/Acquisition/StateLicense/ui';

export const DetailBox = ({ children, sx }) => {
  return (
    <Box p={2} sx={{ border: '1px solid #E0E0E0', boxShadow: '0px 1px 9.5px 3px #0000000D', borderRadius: '4px', height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
      {children}
    </Box>
  );
};

export const CardTitle = ({ title, description, link }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // State to control tooltip visibility

  const handleIconClick = (event) => {
    event.stopPropagation(); // Prevent the tooltip from closing immediately
    setOpen((prevOpen) => !prevOpen); // Toggle tooltip visibility
  };

  const handleTooltipClose = () => {
    setOpen(false); // Close the tooltip when the user clicks outside
  };

  return (
    <Box mb={1} display="flex" alignItems="center">
      <StyledLink onClick={() => navigate(link)} style={{ fontSize: '20px', fontWeight: 500 }}>
        {title}
      </StyledLink>
      {description && (
        <Tooltip
          arrow
          title={description}
          open={open} // Control tooltip open state
          onClose={handleTooltipClose} // Close tooltip handler
          onOpen={() => setOpen(true)} // Open tooltip handler
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: '#4C4B4B',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500
              },
            },
          }}
        >
          <IconButton onClick={handleIconClick}>
            <InfoRoundedIcon fontSize='small' style={{ color: '#5E5E5E' }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export const ClickText = ({ link }) => {
  const navigate = useNavigate();

  return (
    <StyledLink mt={2} onClick={() => navigate(link)} sx={{ fontWeight: 500, textAlign: 'right' }}>
      Click here for more info
    </StyledLink>
  );
};

export const TitleDescription = ({ title, description, sx }) => {
  return (
    <Box sx={{ ...sx }} style={{ fontSize: '14px', fontWeight: 400, color: '#606060' }}>
      <span style={{ fontWeight: 500, color: '#000' }}>{title} : </span>
      {description}
    </Box>
  );
};

export const DashboardSkeleton = () => {
  return (
    <Grid container spacing={3} mb={2} justifyContent="center">
      {["State License", "Course Details", "Certificates"].map((title, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
          <DetailBox>
            <CardTitle title={title} description="Loading..." />
            <Skeleton variant="rounded" animation="wave" width="100%" height={283} sx={{ background: '#F8F8F8' }} />
          </DetailBox>
        </Grid>
      ))}
    </Grid>
  );
};

export const DonutChart = ({ dataOne, dataTwo, dataThree, labelOne, labelTwo, labelThree }) => {
  const totalCount = dataOne + dataTwo + dataThree;

  const taskData = {
    series: totalCount === 0 ? [100] : [dataOne, dataTwo, dataThree],
    options: {
      chart: {
        type: 'donut'
      },
      colors: totalCount === 0 ? ['#D3D3D3'] : ['#077FCA', '#C04149', '#008000'],
      labels: totalCount === 0 ? [''] : [labelOne, labelTwo, labelThree],
      legend: {
        show: false
      },
      tooltip: {
        enabled: totalCount !== 0 // Disable tooltip if no data
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: totalCount !== 0, // Disable label if no data
              name: {
                show: true,
                formatter: () => 'Total' // Shows 'Total' in the center
              },
              value: {
                show: true,
                formatter: () => totalCount.toString(), // Display only the total count in the center
                offsetY: 2,
                style: {
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#000'
                }
              },
              total: {
                show: true // Ensures the total count is always displayed in the center
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false // Disables the percentage labels around the chart
      }
    }
  };

  const ChartListItem = ({ label, count, color }) => {
    return (
      <ListItem sx={{ p: 0, mb: 2, display: 'flex', gap: 0.5, justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <ListItemIcon sx={{ minWidth: '24px' }}>
            <Box
              sx={{
                width: '12px',
                height: '12px',
                backgroundColor: color,
                borderRadius: '50%'
              }}
            />
          </ListItemIcon>
          <Typography style={{ fontSize: '14px', fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
        <Typography style={{ fontSize: '14px', fontWeight: 500 }}>
          {count}
        </Typography>
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 0.5, flexDirection: { xs: 'column', sm: 'column', md: 'row'}}}>
      {/* Legend */}
      <List sx={{ flexGrow: 1, width: '100%' }}>
        <ChartListItem label={labelOne} count={dataOne} color="#077FCA" />
        <ChartListItem label={labelTwo} count={dataTwo} color="#C04149" />
        <ChartListItem label={labelThree} count={dataThree} color="#008000" />
      </List>
      {/* Donut Chart */}
      <Chart
        options={taskData.options}
        series={taskData.series}
        type="donut"
        width="150"
        height="150"
      />
    </Box>
  );
};

export const GreyBox = ({ children, sx }) => {
  return (
    <Box p={2.5} sx={{...sx}} style={{ backgroundColor: '#F8F8F8', borderRadius: '4px' }}>
      {children}
    </Box>
  )
}

export const Arrow = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: '#b0d6ff' }}>
      {/* Line part of the arrow */}
      <Box sx={{  flexGrow: 1,  height: '4px',  backgroundColor: 'currentColor' }}/>

      {/* Arrowhead part of the arrow */}
      <Box
        sx={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: '8px solid currentColor',
        }}
      />
    </Box>
  );
};

export const CourseName = ({ title }) => (
  <Typography style={{ fontSize: "14px", fontWeight: 500, width: "54px" }}>
    {title}
  </Typography>
);

export const CoursePercentage = ({ percent }) => (
  <Tooltip arrow followCursor title={`${percent}% Completed`}>
    <Box sx={{ flexGrow: 1, cursor: "pointer" }}>
      <CourseProgress percent={percent} />
    </Box>
  </Tooltip>
);

const capitalizeWords = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const ActionButton = ({ buttonText, disabled, onClick, ...props }) => (
  <Typography
    variant="body2"
    color={disabled ? "textDisabled" : "primary"}
    onClick={disabled ? null : onClick}
    sx={{
      textDecoration: "underline",
      p: 0,
      width: "100px",
      cursor: disabled ? 'not-allowed' : "pointer",
    }}
    {...props}
  >
    {capitalizeWords(buttonText)}
  </Typography>
);

export const ListItemSkeleton = ({title}) => (
  <ListItem sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, '&:last-child': {mb: 0}}}>
    <CourseName title={title} />
    <CoursePercentage percent={0} />
    <ActionButton buttonText="..." />
  </ListItem>
);
