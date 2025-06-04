import React, { useState } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import { Box, Collapse, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { AccordionBox, AccordionHead, AccordionExpandIcon, AccordionTable, UserClick } from 'src/components/CMECompliance';
import { useNavigate } from 'react-router-dom';
import MailIconWithDialog from 'src/components/Reports/IconWithPopup';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

const DepartmentAccordion = ({ data, page, allUserIds, currentMonthSelected = null }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const handleExpandClick = () => setIsExpanded(prev => !prev);
  const openSnackbar = useOpenSnackbar();

  const handleSendEmail = email => {
    openSnackbar(`Sent Mail to ${email}`);
  };

  const handleViewPersonReport = (userIds) => {
    navigate(`/admin/reports/${page}/${data.id}/${userIds}`)
  }  

  React.useEffect(()=>{
    setIsExpanded(!(data.count==0))
  },[data])

  return (
    <AccordionBox>
      <AccordionHead isExpanded={isExpanded}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: { xs: 'space-between', sm: 'flex-start' },
              gap: 2,
              pl: { xs: 0, sm: 2 },
              pt: { xs: 2, sm: 0 },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Typography component="span" style={{ fontSize: '20px', fontWeight: '500' }}>
              {data.name}
            </Typography>
            {isExpanded ? (
              <>
                {data.count ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                    <MailIcon sx={{ color: '#2872C1' }} />
                      <Typography
                        component="span"
                        onClick={() => handleViewPersonReport(allUserIds)}
                        style={{ fontSize: '14px', fontWeight: '700', color: '#2872C1', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        View All
                      </Typography>
                  </Box>
                ) : <></>}
              </>
            ) : <></>}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'space-between', sm: 'flex-start' }
            }}
          >
            <Typography pr={2} style={{ fontSize: '16px', fontWeight: '700' }}>
              Total Individuals {data.count}
            </Typography>
            <IconButton onClick={handleExpandClick}>
              <AccordionExpandIcon isExpanded={isExpanded} />
            </IconButton>
          </Box>
        </Box>
      </AccordionHead>
      <Collapse in={isExpanded} classes={{ root: 'customRootStyle' }}>
        <TableContainer>
          <AccordionTable>
          {data.count ? (
            <>
              <TableHead>
                <TableRow>
                  <TableCell width={400}>Name</TableCell>
                  <TableCell width={300} style={{ textAlign: 'left' }}>Profession</TableCell>
                  {!currentMonthSelected && (
                    <TableCell>Risk Free</TableCell>
                  )}
                  <TableCell>{currentMonthSelected ? 'Expiration' : 'At Risk'}</TableCell>
                  {!currentMonthSelected && (
                    <TableCell>Expired</TableCell>
                  )}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.licenseData?.map((row) => (
                  <TableRow hover key={row.userId}>
                    <TableCell>
                      <UserClick name={row.userName} onClick={() => handleViewPersonReport(row.userId)} />
                    </TableCell>
                    <TableCell style={{ textAlign: 'left' }}>{row.profession}</TableCell>
                    {!currentMonthSelected && (
                      <TableCell>{row.riskFree}</TableCell>
                    )}
                    <TableCell>{currentMonthSelected ? row.expiringCount : row.atRisk}</TableCell>
                    {!currentMonthSelected && (
                      <TableCell>{row.expired}</TableCell>
                    )}
                    <TableCell>
                      <MailIconWithDialog
                        email={row.userEmail}
                        handleSendEmail={handleSendEmail}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No Data Available</TableCell>
            </TableRow>
          )}
          </AccordionTable>
        </TableContainer>
      </Collapse>
    </AccordionBox>
  );
};

export default DepartmentAccordion;
