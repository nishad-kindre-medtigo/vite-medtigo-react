import React, { useEffect, useState } from 'react';
import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AccordionBox, AccordionTable, PlaceHolder, DefaultPlaceHolder, PageContainer } from '../../../../components/CMECompliance';
import { useSelector } from 'react-redux';
import { getLicenseStatusImage, calculateStatus } from '../../../AdminView/utils';
import adminService from 'src/services/adminService';
import moment from 'moment';
import { CertificateTypeOptions } from 'src/context/ReportFilterContext';
import { StatusFilter } from '../../../AdminView/ClinicalCertificate/UserView';
import { ReportBackLink } from '../../ui';

export const SingleUserData = ({ userData, type = '' }) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const handleStatusFilterChange = event => {
    if (event.target.value.includes('Expiration')) {
      setStatusFilter('At Risk');
    }
    setStatusFilter(event.target.value);
  };

  const filteredCertificates = userData?.certificates.filter(row => {
    let status = calculateStatus(row.Expiry_Date);
    if (status.includes('Expiration')) {
      status = 'At Risk';
    }
    return statusFilter === 'All' || status.includes(statusFilter);
  });

  return (
      <AccordionBox>
        <TableContainer>
          <AccordionTable>
            <TableHead sx={{ '& .MuiTableCell-head': { background: '#F3F3F3' } }}>
              <TableRow>
                <TableCell width={400}>{(type === 'csr' || type === 'dea') ? 'License' : 'Course Name'}</TableCell>
                {(type === 'csr' || type === 'dea') && (
                  <TableCell style={{ textAlign: 'left' }}>State</TableCell>
                )}
                <TableCell style={{ textAlign: 'left' }}>
                  <StatusFilter
                    statusFilter={statusFilter}
                    handleStatusFilterChange={handleStatusFilterChange}
                  />
                </TableCell>
                <TableCell width={300}>Expiry Date</TableCell>
                {type === 'clinical' && <TableCell>Validity</TableCell>}
              </TableRow>
            </TableHead>
            {filteredCertificates.length > 0 ? (
              <TableBody>
                {filteredCertificates.map((row, index) => {
                  const status = calculateStatus(row.Expiry_Date);
                  const certName = row.Certificate_Name == 'ASLS' ? 'ASC CE' : row.Certificate_Name

                  return (
                    <TableRow hover key={index}>
                      <TableCell>{certName}</TableCell>
                      {(type === 'csr' || type === 'dea') && (
                        <TableCell style={{ textAlign: 'left' }}>
                          {row.State}
                        </TableCell>
                      )}
                      <TableCell style={{ textAlign: 'left' }}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={getLicenseStatusImage(status)}
                            alt={status}
                            style={{
                              width: '20px',
                              height: '20px',
                              marginRight: '10px'
                            }}
                          />
                          {status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {moment(row.Expiry_Date).format('MMM D, YYYY')}
                      </TableCell>
                      {type === 'clinical' && (
                        <TableCell>{row.validity_years}</TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No Data Available</TableCell>
              </TableRow>
            )}
          </AccordionTable>
        </TableContainer>
      </AccordionBox>
  );
};

const ClinicalUserView = () => {
  const user = useSelector(state => state.account.user);
  const [userClinicalCertificate, setUserClinicalCertificate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        const certificateIds = CertificateTypeOptions.map(cert => cert.id);
        const month = null;
        const { data } = await adminService.getUserClinicalCertificate(
          [user.id],
          certificateIds,
          month
        );
        setUserClinicalCertificate(data);
      } catch (error) {
        console.error('Error fetching User Clinical Certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCertificates();
  }, []);

  return (
    <PageContainer sx={{ pt: 0 }}>
      <ReportBackLink title="Clinical Certificate Report" tab="clinical-certificate" />
      {isLoading ? (
        <PlaceHolder sx={{ m: 0 }} loading={isLoading} />
      ) : userClinicalCertificate.length > 0 ? (
        userClinicalCertificate?.map(data => {
          return (
            <SingleUserData
              key={data.email}
              userData={data}
              type="clinical"
            />
          );
        })
      ) : (
        <DefaultPlaceHolder sx={{ m: 0 }} />
      )}
    </PageContainer>
  );
};

export default ClinicalUserView;
