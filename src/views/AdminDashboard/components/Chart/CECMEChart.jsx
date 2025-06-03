import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { designations } from '../../../../appConstants';

const CECMEChart = ({ data, selectedDepartments }) => {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoints();
  const [click, setClick] = useState(0)
  const { handleDepartmentChange, handleStateChange, departmentList, handleProfessionChange } = useContext(ReportFilterContext);

  // console.log("data for CE/CME Bar Chart: ", data)
  useEffect(() => {
    const filteredDepartments = departmentList.filter(department =>
      selectedDepartments.includes(department.id)
    );
    handleDepartmentChange(null, filteredDepartments);
  }, [click])

  // Preprocess the data to create chart categories and series
  const categories = data?.map(item => `${item.name}`);
  const notCompliantData = data?.map(item => item.notCompliantCount);
  const compliantData = data?.map(item => item.compliantCount);
  const totalCertificates = data?.map(item => item.totalCertificates);
  const states = data?.map(item => item.states);
  const maxCount = Math.max(...compliantData, ...notCompliantData,...totalCertificates);

  const chartSeries = [
    {
      name: 'At Risk Licenses',
      data: totalCertificates
    },
    {
      name: 'Not Compliant',
      data: notCompliantData
    },
    {
      name: 'Compliant',
      data: compliantData
    }
  ];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 500,
      // stacked: true,
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          setClick(prev => prev + 1);
          console.log('config: ', config);
          // Get the series name and data point index
          const dataIndex = config.seriesIndex;
          const dataIndex2 = config.dataPointIndex;
          sessionStorage.setItem('month_cme', (data[dataIndex2].year + " " + data[dataIndex2].month));
          let report_type = dataIndex == 1 ? "not_compliant" : dataIndex == 2 ? "compliant" : null;
          sessionStorage.setItem('report_type', report_type);
          let states = dataIndex == 1 ? data[dataIndex2].notCompliantStates : dataIndex == 2 ? data[dataIndex2].compliantStates : [...data[dataIndex2].notCompliantStates, ...data[dataIndex2].compliantStates];
          if (selectedDepartments) handleDepartmentChange(null, selectedDepartments)
          handleStateChange(null, states)
          if (dataIndex == 0) {
            handleProfessionChange(null,[designations.find(it => it.id == '3993767000000111003')]) // doctor
            navigate('/admin/reports/license');
          } else navigate('/admin/reports/ce_cme');
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isMobile ? '80%' : '40%',
        endingShape: 'rounded'
      }
    },
    stroke: {
      width: 4,
      colors: ['transparent']
    },
    colors: ['#E0B17A', '#D24F4CAD','#2872C1A6'],
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.5
        }
      }
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
        text: 'Number of Renewals'
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

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={500}
    />
  );
};

CECMEChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      year: PropTypes.number,
      certificates: PropTypes.arrayOf(PropTypes.string),
      notCompliantCount: PropTypes.number,
      compliantCount: PropTypes.number,
      totalCertificates: PropTypes.number
    })
  )
};

export default CECMEChart;
