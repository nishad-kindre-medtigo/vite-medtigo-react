import React, { useState } from 'react';
import { Grid, Typography, IconButton, Button, Tooltip } from '@mui/material';
import Label from 'src/components/Label';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment';
import CommentModal from './CommentModal';

const Header = ({ status, userRequest, startDate, endDate }) => {
  const [openReasonDialog, setOpenReasonDialog] = useState(false);

  const PaymentRequestDetails = () => {
    return (
      <Grid container justifyContent="space-between" alignItems="flex-end">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body1" style={{ margin: '12px 0 10px', color: 'black' }}>
            Request Payment Details:&nbsp;
            {status === 'Initiated' &&  <Label color="primary">{status}</Label>}
            {status === 'Approved' && <Label color="success">Paid</Label>}
            {status === 'Approved With Edit' && <Label color="warning">Paid With Edit</Label>}
            {status === 'Declined' && <Label color="error">{status}</Label>}

            {/* Info Icon to show tooltip with reason for payment status */}
            {(status === 'Approved With Edit' || status === 'Declined') && (
              <Tooltip arrow title={`Reason: ${userRequest.reason || ''}`}>
                <IconButton size="small">
                  <InfoOutlinedIcon fontSize="small" style={{ color: 'darkgrey' }}/>
                </IconButton>
              </Tooltip>
            )}
          </Typography>
          <Typography variant="body2" style={{ margin: '12px 0 10px', color: 'black' }}>
            From { startDate && moment(startDate).format('MMMM DD, YYYY')} To { endDate && moment(endDate).format('MMMM DD, YYYY')}
          </Typography>
          {status === 'Approved With Edit' && (
            <Typography variant="body2" style={{ margin: '12px 0 10px', color: 'black' }}>
              Requested Amount:{' '}
              <Label color="warning">
                $ {userRequest.requestedTotalShiftRate || ''}
              </Label>
              &nbsp;&nbsp;&nbsp; Approved Amount:{' '}
              <Label color="success">
                $ {userRequest.approvedTotalShiftRate || ''}
              </Label>
            </Typography>
          )}
        </Grid>
        {userRequest.providerComment && (
          <Grid size={{ xs: 12, sm: 6 }} style={{textAlign: 'right'}}>
            <Button onClick={() => setOpenReasonDialog(true)} disableRipple
              style={{
                background: 'none',
                color: 'black',
                textDecoration: 'underline',
                ':hover': {
                  background: 'none'
                }
              }}
            >
              View Comment
            </Button>
          </Grid>
        )}
      </Grid>
    )
  }

  return (
    <>
      <PaymentRequestDetails/>
      <CommentModal open={openReasonDialog} setOpen={setOpenReasonDialog} comment={userRequest.providerComment}/>
    </>
  );
};

export default Header;
