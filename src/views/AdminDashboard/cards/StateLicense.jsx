import React, { useEffect, useState, useContext } from 'react';
import { Box } from '@mui/material';
import { AdminDonutChart } from '../components';
import { CardTitle, DetailBox, GreyBox } from 'src/views/dashboard/components';
import GroupFilter from '../components/Filters/GroupFilter';
import adminService from 'src/services/adminService';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { ClickHere } from '../components';

const StateLicense = () => {
  const [totalCounts, setTotalCounts] = useState({ riskFree: 0, expired: 0, atRisk: 0 });
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { departmentList, handleDepartmentChange: changeGlobalDept } = useContext(ReportFilterContext);
  const isAllSelected = selectedDepartments.length === departmentList.length;
  const donutTitle = isAllSelected ? 'All Groups' : `Selected Groups: ${selectedDepartments.length}`

  const handleDepartmentChange = newSelectedOptions => {
    setSelectedDepartments(newSelectedOptions);
  };

  const filteredDepartments = departmentList.filter(department =>
    selectedDepartments.includes(department.id)
  );

  // console.log("filteredDepartments for StateLicense: ", filteredDepartments)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depts = selectedDepartments.length > 0 ? selectedDepartments : [-1]
        const response = await adminService.getStateLicenseDonutChartData(depts);
        setTotalCounts(response.data.totalCounts);
      } catch (error) {
        console.error('Error fetching CME Donut Chart Data:', error);
        setTotalCounts({  riskFree: 0, expired: 0, atRisk: 0 });
      }
    };

    fetchData();
  }, [selectedDepartments]);

  return (
    <DetailBox>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <CardTitle title="State License" />
        <GroupFilter
          options={departmentList}
          selectedOptions={selectedDepartments}
          handleOptionChange={handleDepartmentChange}
        />
      </Box>

      <GreyBox sx={{ flexGrow: 1 }}>
        {/* Chart and Legend */}
        <AdminDonutChart
          title={donutTitle}
          dataOne={totalCounts.expired}
          dataTwo={totalCounts.atRisk}
          dataThree={totalCounts.riskFree}
          labelOne="Expired"
          labelTwo="At Risk"
          labelThree="Risk free"
          showPercentage={true}
          options={selectedDepartments.length}
          link="/admin/reports/license"
          handleClick={() => changeGlobalDept(null, filteredDepartments)}
        />
      </GreyBox>
      <ClickHere link="/admin/reports/license" handleClick={() => changeGlobalDept(null, filteredDepartments)} />
    </DetailBox>
  );
};

export default StateLicense;
