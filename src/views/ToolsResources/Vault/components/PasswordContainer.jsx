import React from 'react';
import { Grid } from '@mui/material';
import PasswordCard from './PasswordCard';
import PlatformDetailsDialog from './PlatformDetailsDialog';
import { PlaceHolder } from '../../../MonitoringRenewal/ui';
import { PasswordCardSkeleton } from '.';

const PasswordContainer = ({loading, passwords, open, onClose, setRefresh}) => {
  return (
    <>
      <Grid container spacing={3} mb={3}>
        {loading ? (
          [...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <PasswordCardSkeleton />
            </Grid>
          ))
        ) : passwords.length === 0 ? (
          <Grid item xs={12}>
            <PlaceHolder>
              No passwords available. Please add a new platform.
            </PlaceHolder>
          </Grid>
        ) : (
          passwords.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <PasswordCard data={item} setRefresh={setRefresh} />
            </Grid>
          ))
        )}
      </Grid>
      <PlatformDetailsDialog
        mode="add"
        open={open}
        onClose={onClose}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default PasswordContainer;
