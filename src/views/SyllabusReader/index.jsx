import React from 'react';
import { Box } from '@mui/material';
import Page from '../../components/Page';
import Header from './Header';
import { useParams } from 'react-router';
import SyllabusReader from './SyllabusReader';

function SyllabusReaderView() {
  const { syllabusName } = useParams();
  localStorage.removeItem('syllabusName');

  return (
    <Page title="Syllabus">
      <Header syllabusName={syllabusName} />
      <Box my={2}>
        <SyllabusReader syllabusName={syllabusName} />
      </Box>
    </Page>
  )
}

export default SyllabusReaderView;
