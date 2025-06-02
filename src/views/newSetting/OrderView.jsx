import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Transition } from '../../ui/Transition';
import useBreakpoints from '../../hooks/useBreakpoints';
import moment from 'moment';
import NewLabel from '../../components/Label';

const OrderViewDialog = React.memo(({ open, handleClose, currentOrder, getStatusColor }) => {
  const { isMobile } = useBreakpoints();
  const { order_id, products, total_price, currency, order_date, payment_method, order_status } = currentOrder;

  const orderProducts = products &&  Object.values(products).map((item, index) => (
    <div key={index}>{item.name}</div>
  ));

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} disableEnforceFocus maxWidth='md' fullWidth fullScreen={isMobile}>
      <DialogTitle py={1} style={{ fontSize: '32px' }}>
        Order View
        <CloseRoundedIcon fontSize="large" style={{ float: 'right', color: '#2872C1', cursor: 'pointer' }} onClick={handleClose}/>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Order <strong>#{order_id}</strong> was placed on{' '}
          <strong>{moment(order_date).format('MMM DD, YYYY')}</strong> and is
          currently <NewLabel color={getStatusColor(order_status)}>{order_status}</NewLabel>
        </Typography>
        <Box my={2}>
          <TableContainer sx={{ border: '1px solid rgba(224, 224, 224, 1)', borderRadius: '4px', color: '#4C4B4B' }}>
            <Table sx={tableSx}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ color: '#2872C1' }}>
                    {orderProducts}
                  </TableCell>
                  <TableCell>
                    {/* {orderAmounts} */}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Subtotal:</TableCell>
                  <TableCell>{total_price + ' ' + currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax:</TableCell>
                  <TableCell>0 {currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Method:</TableCell>
                  <TableCell style={{fontSize: '14px'}}>{payment_method || 'Pay with UPI / Wallet / Credit Card / Debit Card (Razorpay)'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total:</TableCell>
                  <TableCell>{total_price + ' ' + currency}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

const tableSx = {
  '& .MuiTableCell-root': {
    fontWeight: 400,
    fontSize: '16px',
    color: '#4C4B4B'
  },
  '& .MuiTableCell-root:first-child': {
    fontWeight: 600
  },
  '& .MuiTableCell-root:second-child': {
    textAlign: 'left'
  },
  '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
    borderBottom: 'none'
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    fontSize: '16px'
  }
};

export default OrderViewDialog;
