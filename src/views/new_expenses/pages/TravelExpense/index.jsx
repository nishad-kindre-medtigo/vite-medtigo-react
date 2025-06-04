import React from 'react';
import { Box, Container } from '@mui/material';
import Page from 'src/components/Page';
import Results from './Results';
import { pageStyles } from '../../components';

function TravelExpenseForm() {
  return (
    <Page style={pageStyles.root} title="Travel Expense">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Results />
        </Box>
      </Container>
    </Page>
  );
}

export default TravelExpenseForm;
