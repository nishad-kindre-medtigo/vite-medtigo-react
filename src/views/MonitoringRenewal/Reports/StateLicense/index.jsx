import React, { useContext, useState } from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import { getLicenseStatusImage, formatDate, RenewalCycle, calculateStatus } from 'src/views/AdminView/utils';
import licenseReportServices from 'src/services/licenseReportServices';
import { AccordionBox, AccordionTable, PageContainer, PlaceHolder, DefaultPlaceHolder } from 'src/components/CMECompliance';
import { useSelector } from 'react-redux';
import { allCertificates } from 'src/appConstants';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { StatusFilter } from 'src/views/AdminView/ClinicalCertificate/UserView';
import { ReportBackLink } from '../../ui';

const SingleLicenseData = ({ licenseItem }) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const handleStatusFilterChange = event => {
    if (event.target.value.includes('Expiration')) {
      setStatusFilter('At Risk');
    }
    setStatusFilter(event.target.value);
  };

  const filteredLicenses = licenseItem?.certificates.filter(row => {
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
                <TableCell width={400}>License Type</TableCell>
                <TableCell width={200} style={{ textAlign: 'left' }}>
                  State
                </TableCell>
                <TableCell width={300} style={{ textAlign: 'left' }}>
                  <StatusFilter
                    statusFilter={statusFilter}
                    handleStatusFilterChange={handleStatusFilterChange}
                  />
                </TableCell>
                <TableCell width={200}>Expiration Date</TableCell>
                <TableCell>Renewal Cycle</TableCell>
              </TableRow>
            </TableHead>
            {filteredLicenses.length > 0 ? (
              <TableBody>
                {filteredLicenses.map((license, index) => {
                  let RenewalPeriod = RenewalCycle(
                    license.State,
                    allCertificates.find(
                      it => it.name == license.Certificate_Name
                    )?.id
                  ).years;
                  if (RenewalPeriod == 1)
                    RenewalPeriod = RenewalPeriod + ' year';
                  else if (RenewalPeriod > 1)
                    RenewalPeriod = RenewalPeriod + ' years';
                  else RenewalPeriod = '-';

                  const status = calculateStatus(license.Expiry_Date);

                  return (
                    <TableRow key={index}>
                      <TableCell>{license.Certificate_Name}</TableCell>
                      <TableCell style={{ textAlign: 'left' }}>
                        {license.State}
                      </TableCell>
                      <TableCell style={{ textAlign: 'left' }}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={getLicenseStatusImage(status)}
                            alt={'expired'}
                            style={{
                              width: '20px',
                              height: '20px',
                              marginRight: '10px'
                            }}
                          />
                          {status}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(license.Expiry_Date)}</TableCell>
                      <TableCell>{RenewalPeriod}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No Data Available</TableCell>
              </TableRow>
            )}
          </AccordionTable>
        </TableContainer>
      </AccordionBox>
  );
};

const StateLicenseUserView = () => {
  const user = useSelector(state => state.account.user);
  const [licenseData, setLicenseData] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedStates } = useContext(ReportFilterContext);

  const fetchData = async () => {
    try {
      const states = selectedStates.map(it => it.id);
      let payload = {
        userIDs: [user.id],
        statesFilter: states
      };
      const resp = await licenseReportServices.getLicenseStatusDetailedReport(
        payload
      );
      setLicenseData(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
     fetchData();
  }, []);

  return (
    <PageContainer sx={{ pt: 0 }}>
      <ReportBackLink title={'State License Report'} tab="state-license" />
      {isLoading ? (
        <PlaceHolder sx={{ m: 0 }} loading={isLoading} />
      ) : licenseData.length > 0 ? (
        licenseData.map(licenseItem => {
          return (
            <SingleLicenseData
              key={licenseItem.email}
              licenseItem={licenseItem}
            />
          );
        })
      ) : (
        <DefaultPlaceHolder sx={{ m: 0 }} />
      )}
    </PageContainer>
  );
};

export default StateLicenseUserView;
