import * as React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Button, Grid, Typography, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import axios from 'src/utils/axios';
import Label from 'src/components/Label';
import { Transition } from 'src/ui/Transition';

export const dialogStyles = {
  dialogTitle: {
    fontSize: '24px',
    color: '#3A3A3A',
    fontWeight: 600,
    lineHeight: '36px',
  },
  dialogContent: {
    color: '#3A3A3A',
    fontSize: '16px',
    border: 'none',
  },
  gridItem: {
    backgroundColor: '#F8F8F8',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '2px',
  },
  label: {
    fontSize: '16px',
  },
  value: {
    color: '#3A3A3A',
    fontSize: '16px',
    fontWeight: 600,
  },
  cancelButton: {
    backgroundColor: '#fff',
    color: '#2872C1',
    fontSize: '14px',
    height: '40px',
    border: '1px solid #2872C1',
    '&:hover': {
      backgroundColor: '#eee',
    },
  },
  sendButton: {
    backgroundColor: '#2872C1',
    fontSize: '14px',
    color: '#fff',
    height: '40px',
    '&:hover': {
      backgroundColor: '#0B6BC8',
    },
  },
  commentField: {
    marginTop: '16px',
    '& .MuiTextField-root *:not(.MuiFormHelperText-root)': {
      color: '#8E8E8E',
      fontSize: '16px',
      borderColor: '#C1C1C1',
    },
    '& .MuiInputBase-root': {
      borderBottom: 'none',
    },
    '& .MuiFormHelperText-root': {
      color: 'red',
      fontSize: '12px',
    },
  },
  // Media queries for responsiveness
  '@media (max-width: 768px)': {
    dialogTitle: {
      fontSize: '20px',
      lineHeight: '30px',
    },
    dialogContent: {
      fontSize: '14px',
    },
    cancelButton: {
      fontSize: '12px',
      height: '36px',
    },
    sendButton: {
      fontSize: '12px',
      height: '36px',
    },
    commentField: {
      marginTop: '12px',
      '& .MuiTextField-root *:not(.MuiFormHelperText-root)': {
        fontSize: '14px',
      },
    },
  },
};


const RequestPaymentPopup = ({ open, setOpen, startDate, endDate, shiftsData, id}) => {
  const classes = dialogStyles;
  const openSnackbar = useOpenSnackbar();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      disableEnforceFocus
      PaperProps={{
        style: {
          width: '550px',
          backgroundColor: '#fff',
          color: '#000'
        }
      }}
    >
      <DialogTitle>
        <Typography sx={classes.dialogTitle}>
          Request Payment
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ comment: '' }}
          validationSchema={Yup.object({
            comment: Yup.string().max(255, 'Max 255 character limit reached')
          })}
          onSubmit={async values => {
            try {
              await axios.post('/schedule/requestPayment', {
                startDate,
                endDate,
                userID: id,
                create: true,
                providerComment: values.comment
              });
              openSnackbar('Payment Request Sent Successfully!');
              setOpen(false);
              setTimeout(() => window.location.href = '/schedule/payment-history', 2000)
            } catch (error) {
              openSnackbar(
                error.data.message || 'Failed to send request. Please Try Again.', 'error'
              );
            }
          }}
        >
          {({ errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={classes.gridItem}>
                      <Typography sx={classes.label}>
                        Start Date:{' '}
                        <Box component="span" sx={classes.value}>
                          {moment(startDate).format('DD-MMM-YYYY')}
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={classes.gridItem}>
                      <Typography sx={classes.label}>
                        End Date:{' '}
                        <Box component="span" sx={classes.value}>
                          {moment(endDate).format('DD-MMM-YYYY')}
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={classes.gridItem}>
                      <Typography sx={classes.label}>
                        Total Hours:{' '}
                        <Box component="span" sx={classes.value}>
                          {shiftsData.totalWorkingHours ? (
                            `${shiftsData.totalWorkingHours} hrs`
                          ) : (
                            <Label color="error">N/A</Label>
                          )}
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={classes.gridItem}>
                      <Typography sx={classes.label}>
                        Total Payment:{' '}sx
                        <Box component="span" sx={classes.value}>
                          {shiftsData.totalShiftRate ? (
                            `$${shiftsData.totalShiftRate}`
                          ) : (
                            <Label color="error">N/A</Label>
                          )}
                        </Box>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid sx={classes.commentField}>
                  <TextField
                    name="comment"
                    disableElevation
                    fullWidth
                    label="Enter Comment"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    multiline
                    minRows={3}
                    maxRows={5}
                    error={Boolean(touched.comment && errors.comment)}
                    helperText={touched.comment && errors.comment}
                  />
                </Grid>
                <Box pt={2} display="flex" gap={2} justifyContent="flex-end">
                  <Button disableElevation variant="outlined" onClick={() => setOpen(false)} sx={classes.cancelButton}>
                    CANCEL
                  </Button>
                  <Button disableElevation type="submit" variant="contained" sx={classes.sendButton}>
                    SEND REQUEST
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default RequestPaymentPopup