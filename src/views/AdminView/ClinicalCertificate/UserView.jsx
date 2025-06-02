import React, { useEffect, useState, useContext } from 'react';
import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { AccordionBox, AccordionTable, PlaceHolder, DefaultPlaceHolder, PageContainer } from '../../../components/CMECompliance';
import { InfoDialog, InfoIconTooltip } from '../LicenseReports/Components';
import { useParams } from 'react-router';
import { getLicenseStatusImage, calculateStatus, getMonthName } from '../utils';
import { ReportFilterContext } from '../../../context/ReportFilterContext';
import adminService from '../../../services/adminService';
import BackButtonWithTitle from '../../../components/Reports';
import moment from 'moment';

export const StatusFilter = ({ statusFilter, handleStatusFilterChange }) => {
  return (
    <FormControl
      variant="standard"
      sx={{
        '& .MuiInput-underline:before': {
          borderBottom: 'none'
        },
        '& .MuiInput-underline:hover:before': {
          borderBottom: 'none'
        },
        '& .MuiInput-underline:after': {
          borderBottom: 'none'
        }
      }}
    >
      <Select
        value={statusFilter}
        onChange={handleStatusFilterChange}
        displayEmpty
        renderValue={selected => `License Status - ${selected}`}
        IconComponent={ArrowDropDownRoundedIcon}
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiSelect-icon': {
            color: '#334D6E',
          },
        }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Expired">Expired</MenuItem>
        <MenuItem value="At Risk">At Risk</MenuItem>
        <MenuItem value="Risk Free">Risk Free</MenuItem>
      </Select>
    </FormControl>
  );
};

export const SingleUserData = ({ userData, type = '', handleOpen, currentMonthSelected = null }) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const handleStatusFilterChange = (event) => {
    if(event.target.value.includes('Expiration')){
      setStatusFilter('At Risk');
    }
    setStatusFilter(event.target.value);
  };

  const filteredCertificates = userData?.certificates.filter((row) => {
    let status = calculateStatus(row.Expiry_Date);
    if(status.includes('Expiration')){
      status = 'At Risk'
    }
    return statusFilter === 'All' || status.includes(statusFilter);
  });

  useEffect(() => {
    if(currentMonthSelected){
      setStatusFilter("At Risk");
    }
  }, [])

  return (
    <>
      <Typography style={{ fontSize: '20px', fontWeight: 500 }} mb={2}>
        {userData?.first_name+' '+userData?.last_name}
        <InfoIconTooltip
          title={'Info'}
          onClick={() => handleOpen({ email: userData.email, prof: userData.email })}
        />
      </Typography>
      <AccordionBox>
        <TableContainer>
          <AccordionTable>
            <TableHead sx={{ '& .MuiTableCell-head': { background: '#F3F3F3' } }}>
              <TableRow>
                <TableCell width={400}>Course Name</TableCell>
                {(type === 'csr' || type === 'dea' ) && (
                  <TableCell style={{ textAlign: 'left' }}>State</TableCell>
                )}
                <TableCell style={{ textAlign: 'left' }}>
                  {currentMonthSelected ? 'License Status - Expiration' : (
                    <StatusFilter statusFilter={statusFilter} handleStatusFilterChange={handleStatusFilterChange} />
                  )}
                </TableCell>
                <TableCell>Expiry Date</TableCell>
                {type === 'clinical' && (
                  <TableCell>Validity</TableCell>
                )}
              </TableRow>
            </TableHead>
            {filteredCertificates.length > 0 ? (
            <TableBody>
              {filteredCertificates.map((row, index) => {
                const status = calculateStatus(row.Expiry_Date);

                return (
                  <TableRow hover key={index}>
                    <TableCell>{row.Certificate_Name}</TableCell>
                    {(type === 'csr' || type === 'dea' ) && (
                      <TableCell style={{ textAlign: 'left' }}>{row.State}</TableCell>
                    )}
                    <TableCell style={{ textAlign: 'left' }}>
                      <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={getLicenseStatusImage(status)}
                          alt={status}
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '10px',
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
    </>
  );
};

const ClinicalUserView = () => {
  const currentMonthSelected = sessionStorage.getItem('month_Clinical_Certificate');
  const { deptID, userID } = useParams(); // Get the deptID & user ID from the URL
  const [userClinicalCertificate, setUserClinicalCertificate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState([
    { label: 'Email', value: 'test@test.com' },
    { label: 'Profession', value: 'Tester' }
  ]);
  const [open, setOpen] = useState(false);
  const { selectedCertificateTypes } = useContext(ReportFilterContext);
  const monthName = currentMonthSelected ? getMonthName(currentMonthSelected) : null;

  const handleClose = () => setOpen(false);

  const handleOpen = user => {
    setOpen(true);
    setUserDetails([{ label: 'Email', value: user.email }, { label: 'Department Name', value: deptID}]);
  };

  useEffect(() => {
    const fetchUserCertificates = async () => {
      try {
        const certificateIds = selectedCertificateTypes.map(dept => dept.id);
        const userIds = userID.split(',').map(Number);
        let month = null;
        if(sessionStorage.getItem('month_Clinical_Certificate')){
          month = [sessionStorage.getItem('month_Clinical_Certificate')];
        }
        const { data } = await adminService.getUserClinicalCertificate( userIds, certificateIds, month);
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
    <PageContainer>
      <BackButtonWithTitle 
        title={monthName ? `Clinical Certificate Report Generated for ${monthName}` : 'Clinical Certificate Report'} 
      />
        {isLoading ? (
          <PlaceHolder loading={isLoading} />
        ) : userClinicalCertificate.length > 0 ? (
          userClinicalCertificate?.map((data, index) => {
            return <SingleUserData key={index} userData={data} type='clinical' handleOpen={handleOpen} currentMonthSelected={currentMonthSelected} />;
          })
        ) : (
          <DefaultPlaceHolder />
        )}
        <InfoDialog
          open={open}
          title="User Information"
          details={userDetails}
          onClose={handleClose}
        />
    </PageContainer>
  );
};

export default ClinicalUserView;
