import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Box, Switch, Tab, Tabs, Collapse, IconButton, Typography, Tooltip, styled, RadioGroup, FormControlLabel, Radio, Grid, ToggleButtonGroup, ToggleButton, Select, MenuItem } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Link } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { cme_colors } from '../../../../components/CMECompliance/style_guides';
import TuneIcon from '@mui/icons-material/Tune';
// Styles for Accordion Details Table
export const styles = {
  tableCell: {
    fontWeight: '600',
    fontSize: '16px'
  },
  tab: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '16px'
  },
  tableFooter: {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    color: '#0077EE',
    textDecoration: 'underline'
  }
};

// multiple combination flex styles
export const flexStyles = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  columnCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  columnSpaceBetween: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowSpaceAround: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  rowSpaceEvenly: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  wrap: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  wrapCenter: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

// Person - Wise Report Switch
export const IOSSwitch = styled(props => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 24, // Adjusted height for better alignment
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSwitch-switchBase': {
    padding: 2, // Adjusted padding for better thumb alignment
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(18px)', // Adjusted for better thumb positioning
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466', // Green for checked state
        opacity: 1,
        border: 0
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff' // Slightly bold focus outline
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[400]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5 // Dimmed track for disabled state
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    boxShadow: 'none', // Removed shadow for a clean look
    width: 19, // Slightly larger for better aesthetics
    height: 19
  },
  '& .MuiSwitch-track': {
    borderRadius: 12, // Adjusted to make the track fully rounded
    backgroundColor: '#9A9A9A', // Gray for unchecked state
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}));

// Custom Tooltip for State Button
export const CustomTooltip = ({ children, title }) => {
  return (
    <Tooltip
      arrow
      title={title}
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            backgroundColor: '#4C4B4B',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 500
          }
        }
      }}
    >
      {children}
    </Tooltip>
  );
};

// Custom button with error & success styles
const CustomButton = styled(Button)(({ variant }) => {
  const successStyles = {
    backgroundColor: cme_colors.compliantLight,
    color: cme_colors.dark, // Light green for text
    '&:hover': {
      backgroundColor: cme_colors.compliantLight, // Dark red
    }
  };

  const errorStyles = {
    backgroundColor: cme_colors.nonCompliantLight,
    color: cme_colors.dark, // Dark red for text
    '&:hover': {
      backgroundColor: cme_colors.nonCompliantLight, // Dark red
    }
  };

  return variant === 'success' ? successStyles : errorStyles;
});

// Custom Component to show compliant & non-compliant states button
export const StatesButton = ({ variant, children, title, ...props }) => {
  return (
    <CustomTooltip title={title}>
      <CustomButton
        disableRipple
        size="small"
        variant={variant} // Pass 'success' or 'error'
        sx={{
          py: 0,
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 400,
          textTransform: 'none',
          cursor:'default',
          width:'fit-content',
          padding:'5px 10px'
        }}
        {...props}
      >
        {children}
      </CustomButton>
    </CustomTooltip>
  );
};

// Accordion Placeholder
export const PlaceHolder = ({loading, title}) => {
  React.useEffect(()=>{},[title])
  return (
    <Box
      px={2}
      mt={1}
      style={{
        background: '#F6F6F6',
        borderRadius:'8px',
        fontSize: '16px',
        width: '100%',
        height: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'20px'
      }}
    >
      {
        loading ?
          <ReportLoader />
          : <Typography >{title}</Typography>?
          <Typography >{title}</Typography>
          :
          <Typography >Please apply filter to generate report</Typography>
      }
    </Box>
  );
};

const Loader = () => {
  const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '10vh', // Full viewport height
    backgroundColor: 'transparent', // Light background color
  };

  const spinnerStyle = {
    border: '6px solid #f3f3f3', // Light grey background
    borderTop: '6px solid #3498db', // Blue spinner
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 0.5s linear infinite', // Animation
  };

  return (
    <div style={loaderStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
};

const ReportLoader = () => {
  return (
    <div>
      <Loader />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
   Generating report...
    </div>
  );
};

// Wrapper Component for Accordion
export const AccordionBox = ({ children, sx={}, selected=false }) => {
  return (
    <Box
      sx={{
        mb: 2,
        width: '100%',
        background: '#FAFAFA',
        border: selected ? '2px solid #2872c1' : '1px solid #DFDFDF',
        boxShadow: selected ? '0px 8px 12px -2px #0000004f' : 'none',
        borderRadius: '4px',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Accordion Summary Component - Title, tabs & expand icon
export const AccordionHead = ({ children, isExpanded }) => {
  return (
    <Box
      sx={{
        background: '#F3F3F3',
        borderBottom: isExpanded && '1px solid #DFDFDF',
        padding: '0px 16px'
      }}
    >
      {children}
    </Box>
  );
};

// Compliant & Not-Compliant Tabs
export const AccordionTabs = ({
  tableHeadData,
  isExpanded,
  activeTab,
  handleTabChange,
  isMobile
}) => {
  React.useEffect(()=>{},[tableHeadData])
  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      TabIndicatorProps={{
        style: {
          height: '3px',
          backgroundColor: activeTab === 0 ? '#9B1C1C' : '#008000',
          display: !isExpanded && 'none'
        }
      }}
    >
      <Tab
        label={`Not Compliant${isMobile ? ` ${tableHeadData.nonCompliantUsers}` : ` User ${tableHeadData.nonCompliantUsers}`}`}
        sx={{
          ...styles.tab,
          cursor:'default',
          px: 0,
          mr: 3,
          color: cme_colors.dark,
          lineHeight: '28px',
          '&.Mui-selected': {
            color: '#C3000C'
          }
        }}
        disableRipple
      />
      <Tab
        label={`Compliant${isMobile ? ` ${tableHeadData.compliantUsers}` : ` User ${tableHeadData.compliantUsers}`}`}
        sx={{
          ...styles.tab,
          cursor:'default',
          px: 0,
          mr: 1,
          color: cme_colors.dark,
          lineHeight: '28px',
          '&.Mui-selected': {
            color: '#008000'
          }
        }}
        disableRipple
      />
    </Tabs>
  );
};

// Compliant & Not-Compliant Tabs
export const DepartmentAccordionData = ({
  tableHeadData,
  isMobile
}) => {
  React.useEffect(()=>{},[tableHeadData])
  return (
   <Typography></Typography>
  );
};

// Compliant & Not-Compliant Tabs
export const UserAccordionTabs = ({
  tableHeadData,
  isMobile
}) => {
  React.useEffect(()=>{},[tableHeadData])
  return (
    <Tabs>
      <Tab
        label={`Not Compliant${isMobile ? ` ${tableHeadData.nonCompliantStates.count}` : ` States ${tableHeadData.nonCompliantStates.count}`}`}
        sx={{
          ...styles.tab,
          cursor:'default',
          px: 0,
          mr: 3,
          color: cme_colors.dark,
          lineHeight: '28px'
        }}
        disableRipple
      />
      <Tab
        label={`Compliant${isMobile ? ` ${tableHeadData.compliantStates.count}` : ` States ${tableHeadData.compliantStates.count}`}`}
        sx={{
          ...styles.tab,
          cursor:'default',
          px: 0,
          mr: 1,
          color: cme_colors.dark,
          lineHeight: '28px'
        }}
        disableRipple
      />
       </Tabs>
  );
};

// Accordion Expand Icon
export const AccordionExpandIcon = ({ isExpanded }) => {
  return (
    <ExpandMoreRoundedIcon
      fontSize="large"
      sx={{
        color: '#525252',
        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease'
      }}
    />
  );
};

// Accordion for Chart
export const ChartAccordion = ({ sx, title, ChartComponent }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const handleExpandClick = () => setIsExpanded(prev => !prev);

  return (
    <AccordionBox sx={sx}>
      <AccordionHead isExpanded={isExpanded}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={handleExpandClick}>
          <Typography style={{ flexGrow: 1, fontSize: '20px', fontWeight: '500' }}>
            {title}
          </Typography>
          <IconButton>
            <AccordionExpandIcon />
          </IconButton>
        </Box>
      </AccordionHead>
      <Collapse in={isExpanded} classes={{ root: 'customRootStyle' }}>
        <Box pt={1} px={{ xs: 0, sm: 3 }} pr={{xs: 1, sm: 3 }} >{ChartComponent}</Box>
      </Collapse>
    </AccordionBox>
  );
};

 // Reusable Button Component for Chart and Report
const TabButton = ({ isActive, handleToggle, label, icon }) => (
  <Button
    variant={isActive ? 'contained' : 'outlined'}
    color="success"
    startIcon={icon}
    onClick={handleToggle}
    sx={{
      textTransform: 'none',
      fontSize: '16px',
      px: 3,
    }}
  >
    {label}
  </Button>
);

// Main Component
export const ReportTabs = ({ view, setView, sx }) => {
  return (
    <Box sx={{ ...sx, textAlign: 'center', mb: 2 }}>
      {/* Button Group */}
      <ButtonGroup>
      <TabButton
          isActive={view === 'table'}
          handleToggle={() => {setView('table')
            sessionStorage.setItem('view','table');
          }}
          icon={<TableChartIcon />}
        />
        <TabButton
          isActive={view === 'graph'}
          handleToggle={() => {setView('graph');
            sessionStorage.setItem('view','graph');
          }}
          icon={<BarChartIcon />}
        />
        
      </ButtonGroup>
    </Box>
  );
};

export const ComplianceTag = ({ title, variant }) => {

  const errorStyles = {
    background: cme_colors.nonCompliantLight,
    color: cme_colors.dark,
  }

  const successStyles = {
    background: cme_colors.compliantLight,
    color: cme_colors.dark,
  }

  const standardStyles = {
    background: cme_colors.darkLight,
    color: cme_colors.dark,
  }

  return (<Box
    sx={{
      width: '300px',
      padding: '10px 20px',
      textAlign: 'center',
      ...(variant=='success'? successStyles:variant=='standard'?standardStyles:errorStyles)
    }
  }
  >
    <Typography
      style={{
        fontWeight: '600',
        fontSize: '20px'
      }}
    >
      {title}
    </Typography>
  </Box>)

}

export const ComplianceTagSmall = ({ title, variant }) => {

  const errorStyles = {
    background: '#FFF0F0',
    color: '#C04149',
  }

  const successStyles = {
    background: '#DFF7DF',
    color: '#008000',
  }

  return (<Box
    sx={{
      width: 'fitContent',
      padding: '5px 10px',
      textAlign: 'center',
      borderRadius:'5px',
      ...(variant=='success'? successStyles:errorStyles)
    }
  }
  >
    <Typography
      style={{
        fontWeight: '600',
        fontSize: '16px'
      }}
    >
      {title}
    </Typography>
  </Box>)

}

export const PageNav = ({ Title, backTo }) => {
  return (
    <Box sx={{ marginBottom: '10px' }} display={'flex'} flexDirection={'row'} alignContent={'center'} alignItems={'center'}>
      <Link
        style={{ padding: '0' }}
        to={{
          pathname: backTo|| `/admin/reports/ce_cme` ,
        }}
      >
        <IconButton
          disableRipple
          sx={{
            padding: '0',
            marginRight: '5px',
            marginLeft: '-5px',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ color: '#000' }} />
        </IconButton>

      </Link>
      <Typography variant='h5' style={{ fontWeight: '700', fontSize:'24px', }}> {Title}</Typography>
    </Box>)
}

export const ReportViewCom = ({ View, setView, comp, note, fromChart }) => {
  const title = `CME Compliance Report`;

  const handleChange = (event) => {
    setView(event.target.value);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ width: 'fitContent' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '24px' }} >
          {title}
          {fromChart? ' for '+fromChart:null}
          {comp ? comp : null}
        </Typography>
        {note &&
          <Typography sx={{ fontWeight: 400, fontSize: '12px', color:'red' }} >
            {note}
          </Typography>
        }
      </Box>

    </Box>
  );
};


// Styled Switch to mimic Ant Design Switch
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 36, // Reduce width for smaller switch
  height: 20, // Reduce height for smaller switch
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 16, // Smaller thumb when active
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(15px)', // Adjust thumb position for smaller switch
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(15px)', // Adjust checked thumb position
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    width: 16, // Smaller thumb size
    height: 16, // Smaller thumb size
    borderRadius: 8, // Make thumb rounder for smaller version
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16,
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#39393D' : 'gray',
    boxSizing: 'border-box',
  },
}));