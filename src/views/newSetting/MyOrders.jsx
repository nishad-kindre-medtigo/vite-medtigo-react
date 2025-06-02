import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Table, TableContainer, Paper, TableBody, TableFooter, TableCell, TableHead, TableRow, IconButton, TablePagination } from '@mui/material';
import NewLabel from '../../components/Label';
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from 'moment';
import { tableStyles } from '../Scheduling/PaymentRequest/pages/RequestPayment/ShiftsTable';
import orderServices from '../../services/orderServices';
import { useSelector } from 'react-redux';
import OrderViewDialog from './OrderView';
import TableSkeleton from '../Scheduling/PaymentRequest/components/TableSkeleton';

const MyOrders = () => {
  const classes = tableStyles;
  const [userOrderDetails, setUserOrderDetails] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user } = useSelector(state => state.account);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchAllOrders = useCallback(async () => {
    try {
      setPageLoading(true);
      const userOrderDetails = await orderServices.getOrderItemsDetailsForCourses(user.email);
  
      const groupedOrders = new Map();
  
      userOrderDetails.forEach(order => {
        if (!groupedOrders.has(order.order_number)) {
          groupedOrders.set(order.order_number, {
            ...order,
            products: [order.product],
            bills: [order.bill_amount],
            totalBill: order.bill_amount
          });
        } else {
          const existingOrder = groupedOrders.get(order.order_number);
          existingOrder.products.push(order.product);
          existingOrder.bills.push(order.bill_amount);
          existingOrder.totalBill += order.bill_amount;
        }
      });
  
      const finalOrderDetails = Array.from(groupedOrders.values()).reverse();
      setUserOrderDetails(finalOrderDetails);
  
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setPageLoading(false);
    }
  }, [user.email]);

  const fetchWordpressOrders = useCallback(async () => {
    try {
      setPageLoading(true);
      const response = await fetch(`https://staging2.medtigo.store/wp-json/medtigo_store/v1/order_list?email=${user.email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const finalOrderDetails = await response.json();
      setUserOrderDetails(finalOrderDetails);

    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setPageLoading(false);
    }
  }, [user.email]);  

  useEffect(() => {
    // fetchAllOrders();
    fetchWordpressOrders();
  }, []);

  const handleClick = row => {
    setCurrentOrder(row);
    handleOpen();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Processing':
        return 'primary';
      case 'Cancelled':
      case 'Failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  const truncateText = (text, handleClick) => {
    return (
      <>
        {text.length > 40 ? (
          <>
            <Typography component="span" style={{ color: 'black', fontSize: '14px' }}>
              {text.slice(0, 40)}
            </Typography>
            <Typography component="span" style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleClick}>
              {' ...'}
            </Typography>
          </>
        ) : (
          <Typography component="span" style={{ color: 'black', fontSize: '14px' }}>
            {text}
          </Typography>
        )}
      </>
    );
  };

  const OrderTable = () => {
    return (
      <>
        {userOrderDetails.length > 0 ? (
          <>
            <TableContainer component={Paper} elevation={0} sx={classes.scrollbar}
              style={{
                overflowX: 'auto',
                backgroundColor: 'transparent',
                border: '1px solid #DFDFDF',
                borderRadius: '4px',
                marginTop: '8px'
              }}
            >
              <Table sx={classes.table} style={{fontSize: '16px', minWidth: '900px', '& .MuiTableCell-root:not(:last-child)': {borderRight: 'none'}}}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ textAlign: 'left', paddingLeft: '24px' }}>Product Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userOrderDetails
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(row => (
                      <TableRow hover sx={{'&:hover': {background: '#F9F9F9'}}} key={row.order_id}>
                        <TableCell style={{ textAlign: 'left', paddingLeft: '24px' }}>
                          {row.order_type === 'Full_Access' ? 'medtigo Full Access Plan' : truncateText(Object.values(row.products).map(item => item.name).join(', '), () => handleClick(row))}
                        </TableCell>
                        <TableCell>
                          {moment(row.order_date).format('MMM DD, YYYY')}
                        </TableCell>
                        <TableCell>
                          <NewLabel color={getStatusColor(row.order_status)}>{row.order_status}</NewLabel>
                        </TableCell>
                        <TableCell>
                          {row.total_price + ' ' + row.currency}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleClick(row)}>
                            <VisibilityIcon style={{ color: '#4C4B4B' }}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      sx={classes.pagination}
                      rowsPerPageOptions={[5, 10, 25]}
                      count={userOrderDetails.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Box sx={{ ...classes.placeHolder, width: '100%'}}>No Orders Created Till Date</Box>
        )}
      </>
    );
  };

  return (
    <>
      {pageLoading ? <TableSkeleton columns={5} /> : <OrderTable />}
      <OrderViewDialog open={open} handleClose={handleClose} currentOrder={currentOrder} getStatusColor={getStatusColor} />
    </>
  );
};

export default MyOrders;
