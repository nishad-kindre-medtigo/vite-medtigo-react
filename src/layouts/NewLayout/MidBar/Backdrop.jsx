import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Loader } from 'src/ui/Progress';

export default function SimpleBackdrop({ page, open }) {
  return (
    <Backdrop
      open={open}
      style={{
        zIndex: 1300,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Loader />
      <div style={{ marginTop: '10px', fontSize: '20px' }}>
        Redirecting to {page}
      </div>
    </Backdrop>
  );
}
