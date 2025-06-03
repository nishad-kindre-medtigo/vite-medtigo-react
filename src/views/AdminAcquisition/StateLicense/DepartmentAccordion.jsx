import React, { useState } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import { Box, Collapse, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { AccordionBox, AccordionHead, AccordionExpandIcon, AccordionTable, UserClick } from '../../../components/CMECompliance';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import MailIconWithDialog from '../../../components/Reports/IconWithPopup';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

const DepartmentAccordion = ({ data, allUserIds }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const handleExpandClick = () => setIsExpanded(prev => !prev);
  const openSnackbar = useOpenSnackbar();

  // Redirect to User Details Page for State License
  const handleViewPersonReport = userIds => {
    navigate(`/admin/acquisition/state-license/${data.id}/${userIds}`);
  };

  React.useEffect(()=>{
    setIsExpanded(!(data.count==0))
  },[data])
  
  const handleSendEmail = email => {
    openSnackbar(`Sent Mail to ${email}`);
  };

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
                    <TableCell width={300}>Name</TableCell>
                    <TableCell width={300} style={{ textAlign: 'left' }}>Profession</TableCell>
                    <TableCell>Total Acquisitions</TableCell>
                    <TableCell>
                      On Track
                      <Tooltip arrow title="Total number of acquisition which is getting completed according internal SLA">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" style={{ color: '#606060' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      At Risk
                      <Tooltip arrow title="Total number of acquisition which is not getting completed according internal SLA">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" style={{ color: '#606060' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      Critical Tasks
                      <Tooltip arrow title="Total number of tasks that essential to complete the acquisition prosses">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" style={{ color: '#606060' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.licenseData?.map(row => (
                    <TableRow hover key={row.userId}>
                      <TableCell>
                        <UserClick name={row.userName} onClick={() => handleViewPersonReport(row.userId)} />
                      </TableCell>
                      <TableCell style={{ textAlign: 'left' }}>{row.profession}</TableCell>
                      <TableCell>{row.total_count}</TableCell>
                      <TableCell>{row.total_count - row.at_risk_count}</TableCell>
                      <TableCell>{row.at_risk_count}</TableCell>
                      <TableCell style={{ color: '#D35037'}}>{row.overdue_7days_tasks_count}</TableCell>
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
                <TableCell colSpan={7}>No Data Available</TableCell>
              </TableRow>
            )}
          </AccordionTable>
        </TableContainer>
      </Collapse>
    </AccordionBox>
  );
};

export default DepartmentAccordion;
