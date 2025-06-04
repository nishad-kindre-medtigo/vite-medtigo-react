import React, { useState, useContext, useEffect } from 'react';
import { Typography } from '@mui/material';
import { DetailBox } from 'src/views/dashboard/components';
import GroupFilter from '../components/Filters/GroupFilter';
import MonthFilter from '../components/Filters/MonthFilter';
import { BarChartTitleBox, FiltersBox } from '../components';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import RegulatoryChart from '../components/Chart/RegulatoryChart';
import adminService from 'src/services/adminService';
import moment from 'moment';
import { generateMonthRange } from '../utils';

const RegulatoryBarChartCard = () => {
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
      const monthRanges = generateMonthRange(startMonth, newEndMonth);
      const response = await adminService.getRegulatoryBarChartData(
        selectedDepartments,
        monthRanges || []
      );
      setChartData(response?.data?.totalCounts);
    } catch (error) {
      console.error('Error fetching Regulatory Bar Chart Data:', error);
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
          Upcoming Regulatory Certificate Renewals
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
      <RegulatoryChart data={chartData}selectedDepartments={selectedDepartments} />
    </DetailBox>
  );
};

export default RegulatoryBarChartCard;
