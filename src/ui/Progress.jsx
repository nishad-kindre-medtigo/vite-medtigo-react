import React from 'react';
import { CircularProgress } from '@mui/material';

export function GradientCircularProgress() {
  return (
    <CircularProgress />
  );
}

export function Loader({ color="white", strokeWidth="5", time="0.75", width="50", visible=true }) {
  return (
    <CircularProgress/>
  );
}
