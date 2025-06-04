import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import adminService from 'src/services/adminService';
import BackButtonWithTitle from 'src/components/Reports';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from 'src/components/CMECompliance';
import { SingleUserData } from '../ClinicalCertificate/UserView';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { getMonthName } from '../utils';

const DEAUserView = () => {
  const currentMonthSelected = sessionStorage.getItem('month_DEA');
  const { deptID, userID } = useParams(); // Get the dept ID & user ID from the URL
  const { selectedStates } = useContext(ReportFilterContext);
  const [userDEA, setUserDEA] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const monthName = currentMonthSelected ? getMonthName(currentMonthSelected) : null;

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        const userIds = userID.split(',').map(Number);
        const stateIds = selectedStates.map(user => user.id.toString());
        let month = null;
        if(sessionStorage.getItem('month_DEA')){
          month = [sessionStorage.getItem('month_DEA')];
        }
        const { data } = await adminService.getUserDEA([parseInt(deptID)], userIds, stateIds, month);
        setUserDEA(data);
      } catch (error) {
        console.error('Error fetching User DEA:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCertificates();
  }, []);

  return (
    <PageContainer>
      <BackButtonWithTitle 
        title={monthName ? `DEA Report Generated for ${monthName}` : 'DEA Report'} 
      />
      {isLoading ? (
        <PlaceHolder loading={isLoading} />
      ) : userDEA.length > 0 ? (
        userDEA?.map(data => {
          return <SingleUserData key={data.email} userData={data} type="dea" currentMonthSelected={currentMonthSelected} />;
        })
      ) : (
        <DefaultPlaceHolder />
      )}
    </PageContainer>
  );
};

export default DEAUserView;
