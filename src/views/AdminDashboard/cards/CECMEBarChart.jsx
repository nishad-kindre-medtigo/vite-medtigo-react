import React, { useState, useContext, useEffect } from 'react';
import { Typography } from '@mui/material';
import { DetailBox } from '../../../views/dashboard/components';
import GroupFilter from '../components/Filters/GroupFilter';
import MonthFilter from '../components/Filters/MonthFilter';
import { BarChartTitleBox, FiltersBox } from '../components';
import { ReportFilterContext } from '../../../context/ReportFilterContext';
import CECMEChart from '../components/Chart/CECMEChart';
import adminService from '../../../services/adminService';
import moment from 'moment';

const CECMEBarChartCard = () => {
  const { departmentList } = useContext(ReportFilterContext);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [startMonth, setStartMonth] = useState(moment().toDate());
  const [endMonth, setEndMonth] = useState(moment(startMonth).add(5, 'months').toDate());
  const [chartData, setChartData] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => setRefresh(prev => prev + 1);

  const handleDepartmentChange = newSelectedOptions => {
    setSelectedDepartments(newSelectedOptions);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const newEndMonth = moment(startMonth).add(5, 'months').toDate()
    try {
      const response = await adminService.getCMEBarChartData(
        selectedDepartments,
        [],
        moment(startMonth).format('MM YYYY'),
        moment(newEndMonth).format('MM YYYY')
      );
        setChartData(response.data);
    } catch (error) {
      console.error('Error fetching CME Bar Chart Data:', error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDepartments, refresh]);

  return (
    <DetailBox sx={{ height: 'auto' }}>
      <BarChartTitleBox>
        <Typography style={{ fontSize: '28px', fontWeight: 400 }}>
          CE/CME Compliance for Upcoming State License Renewals
        </Typography>
        <FiltersBox>
          <GroupFilter
            options={departmentList}
            selectedOptions={selectedDepartments}
            handleOptionChange={handleDepartmentChange}
          />
          <MonthFilter
            startMonth={startMonth}
            setStartMonth={setStartMonth}
            endMonth={endMonth}
            setEndMonth={setEndMonth}
            handleRefresh={handleRefresh}
          />
        </FiltersBox>
      </BarChartTitleBox>
      <CECMEChart data={chartData} selectedDepartments={selectedDepartments} />
    </DetailBox>
  );
};

export default CECMEBarChartCard;
