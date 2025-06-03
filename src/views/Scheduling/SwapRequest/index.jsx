import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Page from '../../../components/Page';
import Header from './components/Header';
import Results from './components/Results';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { useSelector } from 'react-redux';
import schedullingServices from '../../../services/schedullingServices';
import TableSkeleton from '../PaymentRequest/components/TableSkeleton';

function SwapRequestPage() {
  const openSnackbar = useOpenSnackbar();
  const { user } = useSelector(state => state.account);
  const [tab, setTab] = useState('');
  const [data, setData] = useState([]);
  const [actionChange, setActionChange] = useState(false);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    setData([]);
    try {
      const response =
        tab === 'Sent'
          ? await schedullingServices.getSentRequest(user.id)
          : await schedullingServices.getSwapRequest(user.id);
      setData(response);
      setLoading(false);
    } catch (error) {
      openSnackbar('Failed to fetch data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab, actionChange]);

  const handleAction = async (id, actionType) => {
    try {
      const response =
        actionType === 'accept'
          ? await schedullingServices.acceptRequest(
              id,
              `${user.first_name} ${user.last_name}`
            )
          : await schedullingServices.rejectRequest(
              id,
              `${user.first_name} ${user.last_name}`
            );

      openSnackbar(
        `Request ${
          actionType === 'accept' ? 'Accepted' : 'Rejected'
        } Successfully`
      );

      setActionChange(prev => !prev);
    } catch (error) {
      openSnackbar(`Failed to ${actionType} request`, 'error');
    }
  };

  const acceptRequest = id => handleAction(id, 'accept');
  const rejectRequest = id => handleAction(id, 'reject');

  return (
    <Page title="Shift Requests">
      <Box my={4} sx={{ border: '1px solid #DFDFDF', borderRadius: '2px' }}>
        <Header tabs={['Received', 'Sent']} setTab={setTab} />
        {loading ? (
          <TableSkeleton columns={7} />
        ) : (
          <Results tab={tab} data={data} setData={setData} rejectRequest={rejectRequest} acceptRequest={acceptRequest} openSnackbar={openSnackbar} />
        )}
      </Box>
    </Page>
  );
}

export default SwapRequestPage;
