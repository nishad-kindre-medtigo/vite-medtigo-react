import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, Checkbox, FormControlLabel, Collapse, IconButton, Drawer } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import useBreakpoints from '../../../../../hooks/useBreakpoints';

const filters = [
  {
    title: 'Job Type',
    label: 'jobType',
    options: ['Locums', 'Permanent Placement']
  },
  {
    title: 'Profession',
    label: 'profession',
    options: ['DO', 'MBBS', 'MD', 'NP', 'PA']
  },
  {
    title: 'State',
    label: 'state',
    options: ['California', 'Connecticut', 'Florida', 'Massachusetts', 'Michigan', 'New York', 'Texas']
  },
  {
    title: 'Status',
    label: 'status',
    options: ['Active', 'Immediate', 'On-Hold']
  }
];

const JobFilterPanel = ({ setAllFilters, openFilterDrawer, setOpenFilterDrawer }) => {
  // Initialize state for expanded filters and selected filters
  const [expanded, setExpanded] = useState(
    filters.reduce((acc, filter) => ({ ...acc, [filter.label]: true }), {})
  );

  const [selectedFilters, setSelectedFilters] = useState(
    filters.reduce((acc, filter) => ({ ...acc, [filter.label]: [] }), {})
  );
  const { isTablet } = useBreakpoints();

  const getNumberOfFilters = (filters) => {
    let number = 0;
    const keyValues = Object.values(filters);
    keyValues.forEach(item => {
      number = number + item.length
    })
    return number
  }

  const TotalFilters = getNumberOfFilters(selectedFilters);
  
  // Toggle expand/collapse of a filter section
  const toggleExpand = title => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // Handle selection of filter options
  const handleFilterChange = (filterTitle, option) => {
    setSelectedFilters(prev => {
      const currentOptions = prev[filterTitle];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter(opt => opt !== option) // Uncheck the option
        : [...currentOptions, option]; // Add the checked option
      return { ...prev, [filterTitle]: newOptions };
    });
  };
  
  const closeExpandFilters = () => {
    setExpanded(
      filters.reduce((acc, filter) => ({ ...acc, [filter.label]: true }), {})
    )
  }

  // Clear all selected filters
  const clearAllFilters = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    setSelectedFilters(
      filters.reduce((acc, filter) => ({ ...acc, [filter.label]: [] }), {})
    );
  };

  useEffect(() => {
    setAllFilters(prev => ({
      ...prev,
      ...selectedFilters
    }));
  }, [selectedFilters]);

  useEffect(() => closeExpandFilters(), [openFilterDrawer])

  const filterContent = (
    <Paper elevation={0} sx={{ padding: 2, border: '1px solid #EBEBEB', boxShadow: '0px 1px 3px 0px #00000005' }}>
      <Box pb={2} mb={1} borderBottom={1} borderColor="#DADADA" display="flex" justifyContent="space-between">
        <Typography style={{ fontSize: '18px', fontWeight: 600 }}>
          Advanced Filters
        </Typography>
        {TotalFilters > 0 && (
          <Typography style={{ color: '#2872C1', fontWeight: 600 }}>
            {`Applied(${TotalFilters})`}
          </Typography>
        )}
      </Box>

      {/* Render filters */}
      {filters.map((filter, index) => (
        <Box key={filter.label} pb={1} borderBottom={index !== 3 && expanded[filter.label] && 1} borderColor="#DADADA">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography style={{ fontWeight: 500, fontSize: '16px', color: '#121224' }}>
              {filter.title}
            </Typography>
            <IconButton onClick={() => toggleExpand(filter.label)}>
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          <Collapse in={expanded[filter.label]} timeout="auto" unmountOnExit>
            <Box>
              {filter.options.map(option => {
                const isSelected = selectedFilters[filter.label].includes(
                  option
                );
                return (
                  <FormControlLabel
                    key={option}
                    label={option}
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={() =>
                          handleFilterChange(filter.label, option)
                        }
                        sx={{
                          '&.Mui-checked': {
                            color: '#2872C1'
                          }
                        }}
                      />
                    }
                    style={{
                      width: '100%',
                      color: isSelected ? '#121224' : '#808080',
                      fontSize: '14px',
                      fontWeight: isSelected ? 500 : 400
                    }}
                  />
                );
              })}
            </Box>
          </Collapse>
        </Box>
      ))}

      {/* Remove Filters Button */}
      <Typography mt={1} onClick={clearAllFilters} style={{ fontWeight: 600, color: '#2872C1', cursor: 'pointer' }}>
        Remove Filters
      </Typography>
    </Paper>
  );

  return (
    <>
      {isTablet ? (
        <Drawer anchor="right" open={openFilterDrawer}>
          <Box sx={{ maxWidth: '430px', px: 2, py: 1, textAlign: 'right' }}>
            <IconButton onClick={() => setOpenFilterDrawer(false)}>
              <CloseRoundedIcon style={{ color: '#2872C1' }} />
            </IconButton>
            {filterContent}
          </Box>
        </Drawer>
      ) : (
        filterContent
      )}
    </>
  );
};

export default JobFilterPanel;
