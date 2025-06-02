import React from 'react';
import Chart from 'react-apexcharts';
import { Box, List, ListItem, ListItemIcon, Skeleton, Typography } from '@mui/material';
import { DetailBox, GreyBox } from '../../../views/dashboard/components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AdminDonutChart = ({
  title,
  dataOne = 0,
  dataTwo = 0,
  dataThree = 0,
  labelOne = '',
  labelTwo = '',
  labelThree = '',
  showPercentage = false,
  isCME = false,
  options = 0,
  link = '/',
  handleClick = () => {}
}) => {
  const navigate = useNavigate();

  const totalCount = dataOne + dataTwo + dataThree;
  const { role } = useSelector((state) => state.account.user);

  // Calculate percentages
  const getPercentage = (value) => (totalCount === 0 ? 0 : Math.floor((value / totalCount) * 100));

  const data = isCME ? [
    { value: dataOne, label: labelOne, color: '#D24F4CAD' },
    { value: dataTwo, label: labelTwo, color: '#2872C1A6' },
  ] : [
    { value: dataOne, label: labelOne, color: '#D24F4CAD' },
    { value: dataTwo, label: labelTwo, color: '#D69649A6' },
    { value: dataThree, label: labelThree, color: '#2872C1A6' },
  ];

  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.label);
  const colors = data.map((item) => item.color);

  const taskData = {
    series: totalCount === 0 ? [100] : series,
    options: {
      chart: {
        type: 'donut',
        events: {
        dataPointSelection: () => {
          handleClick();
          navigate(link);
        },
      },
      },
      colors: totalCount === 0 ? ['#D3D3D3'] : colors,
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.5
          }
        }
      },
      labels: totalCount === 0 ? [''] : labels,
      legend: {
        show: false,
      },
      tooltip: {
        enabled: totalCount !== 0, // Disable tooltip if no data
        y: {
          formatter: (val) => val,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: totalCount !== 0, // Disable label if no data
              name: {
                show: true,
                formatter: () => 'Total', // Shows 'Total' in the center
              },
              value: {
                show: true,
                formatter: () => totalCount.toString(), // Display only the total count in the center
                offsetY: 2,
                style: {
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#000',
                },
              },
              total: {
                show: true, // Ensures the total count is always displayed in the center
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false, // Disables the percentage labels around the chart
      },
    },
  };

  const ChartListItem = ({ label, count, color, percentage }) => (
    <ListItem sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box display="flex" alignItems="center">
        <ListItemIcon sx={{ minWidth: '24px' }}>
          <Box
            sx={{
              width: '12px',
              height: '12px',
              backgroundColor: color,
              borderRadius: '50%',
            }}
          />
        </ListItemIcon>
        <Typography style={{ fontSize: '14px', fontWeight: 500 }}>{label}</Typography>
      </Box>
      <Typography style={{ fontSize: '14px', fontWeight: 500 }}>
        {count} {showPercentage && `(${getPercentage(count)}%)`}
      </Typography>
    </ListItem>
  );

  // if(!totalCount){
  //   return (
  //     <Box
  //       sx={{
  //         height: '164px',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         color: '#808080',
  //         fontSize: '20px',
  //         fontWeight: 500
  //       }}
  //     >
  //       {options < 1 ? 'Please Apply Filter' : 'Loading...'}
  //     </Box>
  //   )
  // }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
      }}
    >
      {/* Legend */}
      <List sx={{ flexGrow: 1, width: '100%', minWidth: '200px' }}>
        {(role === "hospital_admin" || role === "admin") && (
          <Typography mb={2} style={{ fontSize: '14px', fontWeight: 600 }}>
            {title}
          </Typography>
        )}
        {data.map((item, index) => (
          <ChartListItem
            key={index}
            label={item.label}
            count={item.value}
            color={item.color}
            percentage={getPercentage(item.value)}
          />
        ))}
      </List>
      {/* Donut Chart */}
      <Chart
        options={taskData.options}
        series={taskData.series}
        type="donut"
        height="170"
        width="170"
      />
    </Box>
  );
};

export const ClickHere = ({ link, handleClick }) => {
  const navigate = useNavigate();

  return (
    <Typography
      mt={2}
      onClick={() => {
        handleClick();
        navigate(link);
      }
      }
      style={{
        color: '#2872C1',
        textDecoration: 'underline',
        fontSize: '16px',
        fontWeight: 500,
        textAlign: 'right',
        cursor: 'pointer'
      }}
    >
      Click here for more info
    </Typography>
  );
};

export const DonutCardSkeleton = () => {
  return (
    <DetailBox>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Skeleton variant="text" width={80} height={30} />
        <Skeleton variant="rectangular" width={60} height={20} />
      </Box>

      {/* Chart and Legend */}
      <GreyBox sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton
              variant="circular"
              width={10}
              height={10}
              sx={{ marginRight: 1 }}
            />
            <Skeleton variant="text" width={100} height={20} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton
              variant="circular"
              width={10}
              height={10}
              sx={{ marginRight: 1 }}
            />
            <Skeleton variant="text" width={100} height={20} />
          </Box>
        </Box>

        <Skeleton variant="circular" width={100} height={100} />
      </GreyBox>

      {/* Link */}
      <Box mt={2}>
        <Skeleton variant="text" width={150} height={20} />
      </Box>
    </DetailBox>
  );
};

export const BarChartTitleBox = ({ children }) => {
  return (
    <Box
      sx={{
        p: 1,
        display: 'flex',
        gap: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' }
      }}
    >
      {children}
    </Box>
  );
};

export const FiltersBox = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexGrow: 1,
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}
    >
      {children}
    </Box>
  );
};

export const DashboardSkeleton = () => {
  return (
    <DetailBox>
      <Skeleton variant="text" animation="wave" height={32} width={100} sx={{ background: '#E9F2FC' }} />
      <Skeleton variant="rounded" animation="wave" width="100%" height={225} sx={{ my: 2, background: '#E9F2FC' }} />
      <Box display="flex" justifyContent="flex-end">
        <Skeleton variant="text" animation="wave" height={32} width={200} sx={{ background: '#E9F2FC' }} />
      </Box>
    </DetailBox>
  );
};