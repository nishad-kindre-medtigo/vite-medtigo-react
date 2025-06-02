import React, { useContext, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import { ReportFilterContext } from '../../../../context/ReportFilterContext';
import useBreakpoints from '../../../../hooks/useBreakpoints';

const RegulatoryChart = ({ data, selectedDepartments }) => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoints();
  const [click, setClick] = useState(0)
  const { departmentList, handleDepartmentChange: changeGlobalDept } = useContext(ReportFilterContext);

  // console.log('data for Regulatory Bar Chart: ', data);

  useEffect(() => {
    const filteredDepartments = departmentList.filter(department =>
      selectedDepartments.includes(department.id)
    );
    changeGlobalDept(null, filteredDepartments);
  }, [click])

  // Preprocess the data to create chart categories and series
  const categories = data?.map(item => `${item.name}`);
  const deaData = data?.map(item => item.dea);
  const stateCSRData = data?.map(item => item.csr);
  const clinicalCertificateData = data?.map(item => item.clinicalCertificate);
  const maxCount = Math.max(...deaData, ...stateCSRData, ...clinicalCertificateData)

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 500,
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const dataIndex = config.seriesIndex;
          const selectedIndex = config.dataPointIndex; // Index of the selected bar
          const selectedSeries = config.w.config.series[config.seriesIndex]?.name; // Name of the selected series (e.g., "DEA", "State CSR/CSC")
          
          setClick(prev => prev + 1); // Set the selected depts in chart in Context

          // Retrieve the data for the selected category
          const selectedData = data[selectedIndex]; // Match index to data array
          if (selectedData) {
            const monthYear = `${selectedData.year}-${selectedData.month.padStart(2, '0')}`; // Format as "YYYY-MM"
          
            console.log('Selected Series:', selectedSeries);
            console.log('Selected Month-Year:', monthYear);
          
            // Store the month-year in sessionStorage with a key based on the series name
            if (selectedSeries && monthYear) {
              sessionStorage.setItem(`month_${selectedSeries.replace(/\s+/g, '_')}`, monthYear);
            }
          
            // Redirect based on the series index
            if (dataIndex === 0) {
              navigate('/admin/reports/dea');
            } else if (dataIndex === 1) {
              navigate('/admin/reports/state-csr-csc');
            } else if (dataIndex === 2) {
              navigate('/admin/reports/clinical-certificate');
            }
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isMobile ? '80%' : '60%',
        endingShape: 'rounded'
      }
    },
    stroke: {
      width: 8,
      colors: ['transparent']
    },
    colors: ['#E0B17A', '#ECDB81', '#F7C77E'],
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.5
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none', // Disables color change on click
        },
      },
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '16px',
          fontWeight: '400',
          colors: '#000'
        }
      },
      axisBorder: {
        show: true,
        color: '#D4D4D4',
        height: 6
      },
      axisTicks: {
        show: false,
      }
    },
    yaxis: {
      title: {
        text: 'Number of Expiration Certificates'
      },
      labels: {
        style: {
          fontSize: '16px',
          fontWeight: '400',
          colors: '#000'
        }
      },
      axisBorder: {
        show: true,
        color: '#D4D4D4',
        width: 2
      },
      min: 0,
      max: maxCount || 5,
      tickAmount: maxCount || 5,
      tickPlacement: 'on'
    },
    fill: {
      opacity: 1
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 5
    },
    legend: {
      fontSize: '16px',
      fontWeight: 'bold',
      itemMargin: {
        horizontal: 10,
        vertical: 10
      }
    }
  };

  const chartSeries = [
    {
      name: 'DEA',
      data: deaData
    },
    {
      name: 'State CSR/CSC',
      data: stateCSRData
    },
    {
      name: 'Clinical Certificate',
      data: clinicalCertificateData
    }
  ];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={500}
    />
  );
};

export default RegulatoryChart;
