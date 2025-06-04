import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Typography, Box, Container, IconButton, Tooltip } from "@mui/material";
import { MenuItem, FormControl, InputLabel, Select as MuiSelect } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import { TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, DialogContentText } from "@mui/material";
import invoiceService from "src/services/expenseService";
import moment from "moment";
import InfoIcon from '@mui/icons-material/Info';
// Status component for color coding
const StatusCell = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#2e7d32'; // green
      case 'Initiated':
        return '#ed6c02'; // orange
      case 'Cancelled':
        return '#d32f2f'; // red
      default:
        return 'inherit';
    }
  };

  return (
    <TableCell style={{ borderBottom: "none", paddingRight: "0px", paddingLeft: "0px" }}>
      <Typography
        sx={{
          color: getStatusColor(status),
          fontWeight: 400
        }}
      >
        {status}
      </Typography>
    </TableCell>
  );
};

// Comment component to handle truncation and dialog
const CommentCell = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const maxLength = 50;
  
  if (!comment) return <TableCell>-</TableCell>;
  
  const isLong = comment.length > maxLength;
  const truncatedText = isLong ? `${comment.slice(0, maxLength)}...` : comment;

  return (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 200 }}>
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {truncatedText}
        </Typography>
        {isLong && (
          <>
            <Typography
              component="span"
              sx={{
                ml: 1,
                color: 'primary.main',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={() => setOpen(true)}
            >
              View More
            </Typography>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle sx={{ m: 0, p: 2 }}>
                Comment Details
              </DialogTitle>
              <DialogContent>
                <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                  {comment}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </TableCell>
  );
};

const ExpensePage = () => {
  const [expenseType, setExpenseType] = useState("meal");
  const [expenses, setExpenses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const handleOpenCancelDialog = (reason) => {
    setSelectedCancelReason(reason || "No cancellation reason provided.");
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        let response;
        if (expenseType === "site") {
          response = await invoiceService.getSiteExpenses(rowsPerPage, page + 1);
        } else if (expenseType === "travel") {
          response = await invoiceService.getTravelExpenses(rowsPerPage, page + 1);
        } else if (expenseType === "meal") {
          response = await invoiceService.getMealExpenses(rowsPerPage, page + 1);
        }
        setExpenses(response.data);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [expenseType, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card sx={{ width: "100%", marginTop: "10px", marginBottom: "10px"}} elevation={0}>
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
        <FormControl variant="outlined" sx={{ width: 200, my: 2 }}>
          <InputLabel id="expense-type-label">Expense Type</InputLabel>
          <MuiSelect
            labelId="expense-type-label"
            value={expenseType}
            label="Expense Type"
            onChange={(e) => setExpenseType(e.target.value)}
          >
            <MenuItem value="meal">Meal</MenuItem>
            <MenuItem value="travel">Travel</MenuItem>
            <MenuItem value="site">Site</MenuItem>
          </MuiSelect>
        </FormControl>
      </Box>
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expense ID</TableCell>
                <TableCell>Reimbursement Request</TableCell>
                <TableCell>Requested Date</TableCell>
                <TableCell>Expected Date</TableCell>
                <TableCell>Paid Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ height: 200 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>{expense.Expenseid}</TableCell>
                    <TableCell>
                      {expenseType === "site" ? expense.Total_Expected_Payment : expense.Total_Reimburesement_Request}
                    </TableCell>
                    <TableCell>{moment(new Date(expense.createdAt)).format("MMM DD, YYYY")}</TableCell>
                    <TableCell>{expense.ExpectedDate ? moment(new Date(expense.ExpectedDate)).format("MMM DD, YYYY") : "N/A"}</TableCell>
                    <TableCell>{expense.PaidDate ? moment(new Date(expense.PaidDate)).format("MMM DD, YYYY") : "N/A"}</TableCell>
                    <TableCell>
                      <div style={{display: 'flex', alignItems: 'center', borderBottom: "none"}}>
                      <StatusCell status={expense.Status} />
                      {expense.Status === 'Cancelled' && expense.CancelledReason && (
                        <Tooltip title="View Cancellation Reason" placement="top">
                        <IconButton 
                        size="small" 
                        onClick={() => handleOpenCancelDialog(expense.CancelledReason)}
                        >
                          <InfoIcon 
                            color="grey" 
                            size={17} 
                            style={{ cursor: 'pointer' }} 
                            />
                        </IconButton>
                        </Tooltip>
                      )}
                      </div>
                    </TableCell>
                    <CommentCell comment={expense.Comments} />
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-reason-dialog-title"
        aria-describedby="cancel-reason-dialog-description"
      >
        <DialogTitle id="cancel-reason-dialog-title">
          Cancellation Reason
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-reason-dialog-description">
            {selectedCancelReason}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ExpensePage;
