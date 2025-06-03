import React from 'react';
import { Drawer, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseRounded';
import CertificateForm from './forms/CertificateForm';
import CMEForm from './forms/CMEForm';
import RegulatoryForm from './forms/RegulatoryForm';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { getCertificateTypeFromPage } from './utils';

const CertificateDrawer = props => {
  const { type = 'Certificate', page = 'Certificate' } = props;
  const { isMobile } = useBreakpoints();
  const { isEdit, drawerStatus, setDrawerStatus, setActiveCertificateData, setIsEdit } = useCertificatesContext();

  const title =
    page === 'DEA'
      ? 'License-DEA'
      : page === 'STATE CSR/CSC'
      ? 'License-CSR'
      : type;

  // CATEGORIES FOR FORM TYPE TEXTFIELD BASED ON PAGE
  const CERTIFICATE_TYPES = getCertificateTypeFromPage();

  const handleClose = () => {
    setActiveCertificateData({});
    setIsEdit(false);
    setDrawerStatus(false);
  };

  const formProps = {
    type,
    page,
    handleClose,
    CERTIFICATE_TYPES
  };

  return (
    <Drawer
      disableEnforceFocus
      anchor="right"
      open={drawerStatus}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : '500px',
          px: 3,
          py: 2
        }
      }}
    >
      <Typography color="primary" variant="h5" fontWeight={600} mb={3}>
        {isEdit ? 'Edit' : 'Add'} {title}
      </Typography>
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8, color: 'primary.main' }}
        onClick={handleClose}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      {type === 'CME Certificate' ? (
        <CMEForm {...formProps} />
      ) : type === 'License' ? (
        <RegulatoryForm {...formProps} />
      ) : (
        <CertificateForm {...formProps} />
      )}
    </Drawer>
  );
};

export default CertificateDrawer;
