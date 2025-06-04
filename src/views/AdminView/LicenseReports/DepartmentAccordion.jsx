import React, { useState } from 'react';
import { Typography, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { AccordionExpandIcon, AccordionBox, AccordionHead, AccordionTable, UserClick } from 'src/components/CMECompliance';
import { ConfirmationDialog } from 'src/components/Reports/confirmationDilog';
import MailIconWithDialog from 'src/components/Reports/IconWithPopup';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

const DepartmentAccordion = ({ department, onViewAll, onViewSingle }) => {
  const [expanded, setExpanded] = useState(true);
  const [dialog, setDialog] = useState(false);
  const openSnackbar = useOpenSnackbar();

  const handleSendEmail = email => {
    openSnackbar(`Sent Mail to ${email}`);
  };

  React.useEffect(()=>{
    setExpanded(!(department.licenseData.length==0))
  },[department])

  const handleExpandClick = () => setExpanded(prev => !prev);
  return (
    <AccordionBox>
      <AccordionHead isExpanded={expanded}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
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
            <Typography
              component="span"
              style={{ fontSize: '20px', fontWeight: '500' }}
            >
              {department.name}
            </Typography>
            {expanded && department.licenseData.length>0 && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MailIcon sx={{ color: '#2872C1' }} />
              <Typography
                component="span"
                onClick={onViewAll}
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#2872C1',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                View All
              </Typography>
            </Box>}
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
              Total Individuals {department.licenseData.length}
            </Typography>
            <IconButton onClick={handleExpandClick}>
              <AccordionExpandIcon isExpanded={expanded} />
            </IconButton>
          </Box>
        </Box>
      </AccordionHead>
      <Collapse in={expanded} classes={{ root: 'customRootStyle' }}>
      {department.licenseData.length>0?
        <TableContainer>
          <AccordionTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={500}>Name</TableCell>
                  <TableCell style={{ textAlign: 'left' }}>
                    Profession
                  </TableCell>
                  <TableCell>Risk Free</TableCell>
                  <TableCell>At Risk</TableCell>
                  <TableCell>Expired</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {department.licenseData.map((license, idx) => (
                  <TableRow hover key={idx}>
                    <TableCell>
                      <UserClick name={license.userName} onClick={() => onViewSingle([license.userId])} />
                    </TableCell>
                    <TableCell style={{ textAlign: 'left' }}>
                      {license.profession}
                    </TableCell>
                    <TableCell>{license.riskFree}</TableCell>
                    <TableCell>{license.atRisk}</TableCell>
                    <TableCell>{license.expired}</TableCell>
                    <TableCell>
                      <MailIconWithDialog
                        email={license.userEmail}
                        handleSendEmail={handleSendEmail}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionTable>
          </TableContainer> :
          <Box py={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Typography>No Data Available</Typography>
        </Box>
      }
      </Collapse>
      <ConfirmationDialog
        // ViewAll={() => handleViewReport(licenseReport.map(it=>it.userID))}
        msg={'Send email reminder?'}
        open={dialog}
        onCancel={() => setDialog(false)}
      />
    </AccordionBox>
  );
};

export default DepartmentAccordion;
