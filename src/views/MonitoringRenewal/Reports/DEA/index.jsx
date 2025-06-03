import React, { useEffect, useState, useContext } from 'react';
import adminService from 'src/services/adminService';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from '../../../../components/CMECompliance';
import { useSelector } from 'react-redux';
import { SingleUserData } from '../ClinicalCertificate';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { ReportBackLink } from '../../ui';

const DEAUserView = () => {
  const user = useSelector(state => state.account.user);
  const { selectedStates } = useContext(ReportFilterContext);
  const [userDEA, setUserDEA] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        const stateIds = selectedStates.map(user => user.id.toString());
        const month = null;
        const { data } = await adminService.getUserDEA(
          [],
          [user.id],
          stateIds,
          month
        );
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
    <PageContainer sx={{ pt: 0 }}>
      <ReportBackLink title="DEA Report" tab="dea" />
      {isLoading ? (
        <PlaceHolder sx={{ m: 0 }} loading={isLoading} />
      ) : userDEA.length > 0 ? (
        userDEA?.map(data => {
          return (
            <SingleUserData
              key={data.email}
              userData={data}
              type="dea"
            />
          );
        })
      ) : (
        <DefaultPlaceHolder sx={{ m: 0 }} />
      )}
    </PageContainer>
  );
};

export default DEAUserView;
