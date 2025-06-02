import React from 'react';
import { Box, Table, TableContainer, Paper, TableBody, TableCell, TableHead, TableRow, Skeleton } from '@mui/material';
import { tableStyles } from '../pages/RequestPayment/ShiftsTable';

const TableSkeleton = ({columns}) => {
  const classes = tableStyles;

  return (
    <>
    <TableContainer component={Paper} elevation={0} mt={1} sx={{overflowX: 'auto', border: '1px solid #DFDFDF', borderRadius: '4px'}}>
      <Table sx={classes.table}>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width="100%" height={40} sx={{ background: '#E9F2FC' }} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, cellIndex) => (
                <TableCell key={cellIndex} p={1}>
                  <Skeleton variant="rounded" width="100%" height={20} sx={{ background: '#E9F2FC' }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default TableSkeleton;
