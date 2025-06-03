import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import { getLicenseStatusImage, formatDate, getLicenseStatus, RenewalCycle, calculateStatus } from '../utils';
import licenseReportServices from 'src/services/licenseReportServices';
import { AccordionBox, AccordionTable, PlaceHolder, PageContainer, DefaultPlaceHolder } from '../../../components/CMECompliance';
import { InfoDialog, InfoIconTooltip } from './Components';
import { allCertificates } from '../../../appConstants';
import BackButtonWithTitle from '../../../components/Reports';
import { ReportFilterContext } from 'src/context/ReportFilterContext';
import { StatusFilter } from '../ClinicalCertificate/UserView';

const SingleLicenseData = ({ licenseItem, handleOpen }) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const handleStatusFilterChange = (event) => {
    if(event.target.value.includes('Expiration')){
      setStatusFilter('At Risk');
    }
    setStatusFilter(event.target.value);
  };

  const filteredLicenses = licenseItem?.certificates.filter((row) => {
    let status = calculateStatus(row.Expiry_Date);
    if(status.includes('Expiration')){
      status = 'At Risk'
    }
    return statusFilter === 'All' || status.includes(statusFilter);
  });

  return (
    <>
      <Typography style={{ fontSize: '20px', fontWeight: 500 }} mb={2}>
        {`${licenseItem.first_name} ${licenseItem.last_name}`}
        <InfoIconTooltip
          title={'Info'}
          onClick={() => handleOpen({ email: licenseItem.email, prof: licenseItem.email })}
        />
      </Typography>
      <AccordionBox>
        <TableContainer>
          <AccordionTable>
            <TableHead sx={{ '& .MuiTableCell-head': { background: '#F3F3F3' } }}>
              <TableRow>
                <TableCell width={400}>License Type</TableCell>
                <TableCell width={200} style={{ textAlign: 'left' }}>State</TableCell>
                <TableCell width={400} style={{ textAlign: 'left' }}>
                  <StatusFilter statusFilter={statusFilter} handleStatusFilterChange={handleStatusFilterChange} />
                </TableCell>
                <TableCell>Expiration Date</TableCell>
                <TableCell>Renewal Cycle</TableCell>
              </TableRow>
            </TableHead>
            {filteredLicenses.length>0 ? (
              <TableBody>
                {filteredLicenses.map((license, index) => {
                let RenewalPeriod = RenewalCycle(
                  license.State,
                  allCertificates.find(
                    it => it.name == license.Certificate_Name
                  ).id
                ).years;
                if (RenewalPeriod == 1) RenewalPeriod = RenewalPeriod + ' year';
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
    </>
  );
};

const StateLicenseUserView = () => {
  const { userId } = useParams();
  const [licenseData, setLicenseData] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState([
    { label: 'Email', value: 'test@test.com' },
    { label: 'Profession', value: 'Tester' }
  ]);
  const { selectedStates } = useContext(ReportFilterContext);

  const handleOpen = user => {
    setOpen(true);
    setUserDetails([{ label: 'Email', value: user.email }]);
  };

  const handleClose = () => setOpen(false);

  const fetchData = async userId => {
    try {
      const states = selectedStates.map(it => it.id);
      let payload = {
        userIDs: userId.split(',').map(Number),
        statesFilter: states
      };
      const resp = await licenseReportServices.getLicenseStatusDetailedReport(
        payload
      );
      setLicenseData(resp);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (userId) fetchData(userId);
  }, [userId]);

  return (
    <PageContainer>
      <BackButtonWithTitle title={'State License Report'} />
      {licenseData.length>0?
      licenseData.map(licenseItem => {
        return (
          <SingleLicenseData
            key={licenseItem.email} 
            licenseItem={licenseItem}
            handleOpen={handleOpen}
          />
        );
      }) 
      :<DefaultPlaceHolder/>}
      <InfoDialog
        open={open}
        title="User Information"
        details={userDetails}
        onClose={handleClose}
      />
    </PageContainer>
  );
};

export default StateLicenseUserView;
