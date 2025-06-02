import React from 'react';
import Chart from 'react-apexcharts';
import { Box } from '@mui/material';
import { ChartAccordion } from '.';

const ComplianceChart = ({ stateStats, userStats, setSelectedState, setView, setChartUserID, handleSwitch, userOptions, handleEmailChange, setUserInputValue, setReportView }) => {
  const stateChartHeight = stateStats.length * 50 + 200;
  const userChartHeight = userStats.length * 50 + 200;
  const showStateChart = userStats.length > 1;

  // Prepare chart data for State Compliance
  const seriesStateCompliance = [
    {
      name: 'Compliant Users',
      data: stateStats?.map(stat => stat.compliantUsers)
    },
    {
      name: 'Not-Compliant Users',
      data: stateStats?.map(stat => stat.nonCompliantUsers)
    }
  ];

  const optionsStateCompliance = {
    chart: {
      type: 'bar',
      events: {
        click: (event, chartContext, { dataPointIndex }) => {
          if (dataPointIndex !== -1) {
            const state = stateStats[dataPointIndex]?.state_id; // Safely access the clicked state
            if (state) {
              setSelectedState(state); // Update the selected state
              setView('table');
              setReportView('by-state')
            }
          }
        }
      },
      toolbar: {
        show: false // Disable the menu bar
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        endingShape: 'rounded'
      }
    },
    colors: ['#3daa5c', '#c53a3a'], // Colors for the bars
    states: {
      hover: {
        filter: {
          type: 'darken', // Darkens the bar on hover
          value: 0.5 // Adjust the intensity of the darkening effect
        }
      }
    },
    xaxis: {
      title: {
        text: 'Number of Users' // Label for X-axis
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        },
        formatter: (val) => Math.round(val) // Ensure only integers are displayed
      },
      min: 0, // Set minimum value
      max: Math.max(...stateStats.map(state => state.compliantUsers), ...stateStats.map(state => state.nonCompliantUsers)), // Number of Points on Axis controlled by the max number of compliant / non compliant users in stateStats
      tickAmount: Math.max(...stateStats.map(state => state.compliantUsers), ...stateStats.map(state => state.nonCompliantUsers)), // Number of Points on Axis controlled by the max number of compliant / non compliant users in stateStats
      categories: stateStats?.map(stat => stat.state), // Map states to X-axis categories
      tickPlacement: 'on' // Ensure proper label placement
    },
    yaxis: {
      title: {
        text: 'States' // X-axis title
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
      // Removed tickAmount to allow auto-calculation
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Users` // Customize tooltip format
      }
    }
  };
  

  // Chart Series for User Compliance
  const seriesUserCompliance = [
    {
      name: 'Compliant States',
      data: userStats?.map(user => user.compliantStates.count)
    },
    {
      name: 'Not-Compliant States',
      data: userStats?.map(user => user.nonCompliantStates.count)
    }
  ];

  const optionsUserCompliance = {
    chart: {
      type: 'bar',
      events: {
        click: (event, chartContext, { dataPointIndex }) => {
          if (dataPointIndex !== -1) {
            const userID = userStats[dataPointIndex]?.user; // Safely access the clicked user
            if (userID) {
              const userData = userOptions.find(user => user.id == userID);
              if (userData) {
                setView('table');
                setReportView('by-person')
                setUserInputValue(userData);
                // handleEmailChange(userData.email);
                // setChartUserID(userID);
                // handleSwitch();
              }
            }
          }
        }
      },
      toolbar: {
        show: false // Disable the menu bar
      }
    },
    plotOptions: {
      bar: {
        horizontal: true, // Ensure horizontal orientation
        barHeight: '50%',
        endingShape: 'rounded'
      }
    },
    colors: ['#3daa5c', '#c53a3a'], // Default colors for compliant and non-compliant
    states: {
      hover: {
        filter: {
          type: 'darken', // Darkens the bar on hover
          value: 0.5 // Adjust the intensity of the darkening effect
        }
      }
    },
    xaxis: {
      title: {
        text: 'Number of States' // X-axis title
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        },
        formatter: (val) => Math.round(val) // Ensure integer labels
      },
      min: 0, // Set minimum value
      max: Math.max(...userStats.map(user => user.compliantStates.count), ...userStats.map(user => user.nonCompliantStates.count)), // Maximum value on X axis - Total States Count
      tickAmount: Math.max(...userStats.map(user => user.compliantStates.count), ...userStats.map(user => user.nonCompliantStates.count)), // Number of Points on Axis controlled by the max number compliant/non-compliant state for any user
      categories: userStats?.map(user => user.userName), // Map user names to categories
    },
    yaxis: {
      title: {
        text: 'Users' // X-axis title
      },
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex, dataPointIndex }) => {
          const user = userStats[dataPointIndex];
          const stateList =
            seriesIndex === 0
              ? user.compliantStates.stateNames
              : user.nonCompliantStates.stateNames;
          if(stateList.length > 0){
            return `${val} ${stateList.length > 1 ? 'States' : 'State'}: ${stateList.join(', ')}`;
          } else {
            return val
          }
        }
      }
    }
  };
  
  return (
    <Box mb={2}>
      {/* State Compliance Chart */}
      {showStateChart && (
        <ChartAccordion
          sx={{ mt: 0 }}
          title="State Compliance Graph"
          ChartComponent={
            <Chart
              options={optionsStateCompliance}
              series={seriesStateCompliance}
              type="bar"
              height={stateChartHeight}
            />
          }
        />
      )}

      {/* User Compliance Chart */}
      <ChartAccordion
        sx={{ mt: showStateChart ? 2 : 0 }}
        title="User Compliance Graph"
        ChartComponent={
          <Chart
            options={optionsUserCompliance}
            series={seriesUserCompliance}
            type="bar"
            height={userChartHeight}
          />
        }
      />
    </Box>
  );
};

export default ComplianceChart;
