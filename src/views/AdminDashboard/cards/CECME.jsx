import React, { useEffect, useState, useContext } from 'react';
import { Box } from '@mui/material';
import { AdminDonutChart } from '../components';
import { CardTitle, DetailBox, GreyBox } from 'src/views/dashboard/components';
import GroupFilter from '../components/Filters/GroupFilter';
import adminService from 'src/services/adminService';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { ClickHere } from '../components';

const CECME = () => {
  const [compliantCount, setCompliantCount] = useState(0);
  const [notCompliantCount, setNotCompliantCount] = useState(0);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { departmentList, handleDepartmentChange: changeGlobalDept, handleStateChange: changeGlobalStates } = useContext(ReportFilterContext);
  const isAllSelected = selectedDepartments.length === departmentList.length;
  const donutTitle = isAllSelected ? 'All Groups' : `Selected Groups: ${selectedDepartments.length}`

  const handleDepartmentChange = (newSelectedOptions) => {
    setSelectedDepartments(newSelectedOptions);
  };

  const filteredDepartments = departmentList.filter(department =>
    selectedDepartments.includes(department.id)
  );

  // console.log("filteredDepartments for ce/cme: ", filteredDepartments)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getCMEDonutChartData(selectedDepartments);
        setCompliantCount(response.data.compliant);
        setNotCompliantCount(response.data.nonCompliant);
        setStates(response.data.states);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching CME Donut Chart Data:', error);
        setCompliantCount(0);
        setNotCompliantCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDepartments]);

  // if(loading){
  //   return <DashboardSkeleton />
  // }

  return (
    <DetailBox>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <CardTitle title="CE/CME" />
        <GroupFilter options={departmentList} selectedOptions={selectedDepartments} handleOptionChange={handleDepartmentChange} />
      </Box>

      <GreyBox sx={{ flexGrow: 1 }}>
        {/* Chart and Legend */}
        <AdminDonutChart
          title={donutTitle}
          dataOne={notCompliantCount}
          dataTwo={compliantCount}
          labelOne="Not Compliant"
          labelTwo="Compliant"
          showPercentage={true}
          isCME={true}
          options={selectedDepartments.length}
          link="/admin/reports/ce_cme"
          handleClick={() => {changeGlobalDept(null, filteredDepartments); changeGlobalStates(null, states)}}
        />
      </GreyBox>
      <ClickHere link="/admin/reports/ce_cme" handleClick={() => {changeGlobalDept(null, filteredDepartments); changeGlobalStates(null, states)}} />
    </DetailBox>
  );
};

export default CECME;
