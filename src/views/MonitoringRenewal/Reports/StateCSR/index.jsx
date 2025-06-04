import React, { useEffect, useState, useContext } from 'react';
import adminService from 'src/services/adminService';
import { ReportBackLink } from '../../ui';
import { PlaceHolder, DefaultPlaceHolder, PageContainer } from 'src/components/CMECompliance';
import { useSelector } from 'react-redux';
import { SingleUserData } from '../ClinicalCertificate';
import { ReportFilterContext } from 'src/context/ReportFilterContext';

const StateCSRUserView = () => {
  const user = useSelector(state => state.account.user);
  const { selectedStates } = useContext(ReportFilterContext);
  const [userStateCSR, setUserStateCSR] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        const stateIds = selectedStates.map(user => user.id.toString());
        const month = null;
        const { data } = await adminService.getUserStateCSR(
          [],
          [user.id],
          stateIds,
          month
        );
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
    <PageContainer sx={{ pt: 0 }}>
      <ReportBackLink title="State CSR/CSC Report" tab="state-csr-csc" />
      {isLoading ? (
        <PlaceHolder sx={{ m: 0 }} loading={isLoading} />
      ) : userStateCSR.length > 0 ? (
        userStateCSR?.map(data => {
          return (
            <SingleUserData
              key={data.email}
              userData={data}
              type="csr"
            />
          );
        })
      ) : (
        <DefaultPlaceHolder sx={{ m: 0 }} />
      )}
    </PageContainer>
  );
};

export default StateCSRUserView;
