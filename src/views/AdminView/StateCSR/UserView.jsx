import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import adminService from 'src/services/adminService';
import BackButtonWithTitle from '../../../components/Reports';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from '../../../components/CMECompliance';
import { SingleUserData } from '../ClinicalCertificate/UserView';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { getMonthName } from '../utils';

const StateCSRUserView = () => {
  const currentMonthSelected = sessionStorage.getItem('month_State_CSR/CSC');
  const { deptID, userID } = useParams(); // Get the dept ID & user ID from the URL
  const { selectedDepartments, selectedStates } = useContext(ReportFilterContext);
  const [userStateCSR, setUserStateCSR] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const monthName = currentMonthSelected ? getMonthName(currentMonthSelected) : null;

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        const departmentIds = selectedDepartments.map(dept => dept.id);
        const userIds = userID.split(',').map(Number);
        const stateIds = selectedStates.map(user => user.id.toString());
        let month = null;
        if(sessionStorage.getItem('month_State_CSR/CSC')){
          month = [sessionStorage.getItem('month_State_CSR/CSC')];
        }
        const { data } = await adminService.getUserStateCSR([parseInt(deptID)], userIds, stateIds, month);
        setUserStateCSR(data);
      } catch (error) {
        console.error('Error fetching User State CSR:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCertificates();
  }, []);

  return (
    <PageContainer>
      <BackButtonWithTitle 
        title={monthName ? `State CSR/CSC Report Generated for ${monthName}` : 'State CSR/CSC Report'} 
      />
      {isLoading ? (
        <PlaceHolder loading={isLoading} />
      ) : userStateCSR.length > 0 ? (
        userStateCSR?.map(data => {
          return <SingleUserData key={data.email} userData={data} type='csr' currentMonthSelected={currentMonthSelected} />;
        })
      ) : (
        <DefaultPlaceHolder />
      )}
    </PageContainer>
  );
};

export default StateCSRUserView;
