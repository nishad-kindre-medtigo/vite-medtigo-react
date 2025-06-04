import React from 'react';
import moment from 'moment';
import { Chip, Box } from '@mui/material';
import { specificDesignations } from 'src/appConstants';

const FilterChips = props => {
  const { filterData, setFilterData, filterCertificates } = props;

  const handleDeleteKey = key => {
    const updatedData = { ...filterData };
    delete updatedData[key];
    setFilterData(updatedData);
    filterCertificates(updatedData);
  };

  return (
    <Box
      sx={{
        marginTop: '15px',
        display: Object.keys(filterData).length > 0 ? 'block' : 'none'
      }}
    >
      {Object.keys(filterData).map(filter =>
        !moment.isMoment(filterData[filter]) ? (
          <Chip
            key={filter}
            label={
              filter === 'Specific_Designation'
                ? specificDesignations.find(
                    des => des.id === filterData[filter]
                  )?.name
                : filterData[filter]
            }
            onDelete={() => handleDeleteKey(filter)}
          />
        ) : null
      )}
      {filterData['from_date'] && !filterData['to_date'] && (
        <Chip
          label={filterData['from_date'].format('MMM DD, YYYY')}
          onDelete={() => handleDeleteKey('from_date')}
        />
      )}
      {filterData['to_date'] && !filterData['from_date'] && (
        <Chip
          label={filterData['to_date'].format('MMM DD, YYYY')}
          onDelete={() => handleDeleteKey('to_date')}
        />
      )}
      {filterData['to_date'] && filterData['from_date'] && (
        <Chip
          label={`${filterData['from_date'].format(
            'MMM DD, YYYY'
          )} — ${filterData['to_date'].format('MMM DD, YYYY')}`}
          onDelete={() => {
            handleDeleteKey('from_date');
            handleDeleteKey('to_date');
          }}
        />
      )}
    </Box>
  );
};

export default FilterChips;
