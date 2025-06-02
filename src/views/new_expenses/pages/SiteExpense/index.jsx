import React from 'react';
import { Box, Container } from '@mui/material';
import Page from '../../../../components/Page';
import Results from './Results';
import { pageStyles } from '../../components';

function SiteExpenseForm() {
  return (
    <Page style={pageStyles.root} title="Site Expense">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Results />
        </Box>
      </Container>
    </Page>
  );
}

export default SiteExpenseForm;
