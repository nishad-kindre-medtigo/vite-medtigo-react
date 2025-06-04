import React, { useState } from 'react';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import certificatesService from 'src/services/certificatesService';
import { Button, Dialog, DialogActions, DialogTitle, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/BorderColorRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import { Loader } from 'src/ui/Progress';
import { Transition } from 'src/ui/Transition';
import { StyledMenu, StyledMenuItem } from 'src/layouts/NewLayout/MidBar/HeaderMenu';
import { CertificateIcon } from 'src/views/MonitoringRenewal/ui';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { SERVER_URL } from 'src/settings';
import isPrintable from 'src/utils/isPrintable';
import { printCertificate } from 'src/views/MonitoringRenewal/utils';

export const dialogStyles = {
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#e00000',
    lineHeight: '30px',
    '@media (max-width: 600px)': { // Equivalent to `theme.breakpoints.down('xs')`
      fontSize: '16px',
      lineHeight: '24px',
    },
  },
  subTitle: {
    fontSize: '14px',
    color: '#4B3A5A',
    lineHeight: '30px',
    '@media (max-width: 600px)': {
      fontSize: '12px',
      lineHeight: '24px',
    },
  },
};

export const CertificateActions = ({ page, certificateData, icon, isMobile, anchorEl, handleCloseMenu }) => {
  const { setDrawerStatus, setActiveCertificateData, METHODS, setIsEmailDialogOpen, setRecipientEmails, setSendACopy, setIsEdit } = useCertificatesContext();
  const classes = dialogStyles;
  const openSnackbar = useOpenSnackbar();
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false)
  const isCertificateUserAdded = certificateData.entered_from_frontend == 1;
  const isPrintableCertificate = certificateData['file'] ? isPrintable(certificateData['file']) : null;

  const deleteCertificateName = deleteTarget?.certificate_name;
  const certificateName = deleteCertificateName === "ASLS" ? "ASC CE" : deleteCertificateName

  const handleDelete = async () => {
    try {
      setLoading(true);
      await certificatesService.deleteUserCertificates(deleteTarget.id, deleteTarget.type);
      const refreshPageData = METHODS[page];
      refreshPageData();
      openSnackbar(`${deleteTarget.certificate_name} deleted successfully.`);
      setOpen(false);
    } catch (error) {
      console.error(error);
      openSnackbar(`An error occurred while deleting the certificate, please try again or contact support: ${error}`, 'error');
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setActiveCertificateData(certificateData);
    setIsEdit(true);
    setDrawerStatus(true);
    {isMobile && handleCloseMenu()}
  };

  const handleView = () => {
    window.open(SERVER_URL + certificateData['file'], '_blank');
    {isMobile && handleCloseMenu()}
  };

  const handlePrintCertificate = () => {
    printCertificate(certificateData['file']);
  };

  const handleSendMail = () => {
    setActiveCertificateData({ ...certificateData });
    setIsEmailDialogOpen(true);
    setRecipientEmails([]);
    setSendACopy({ shouldSend: false });
    {isMobile && handleCloseMenu()}
  };

  const handleOpenDialog = (e) => {
    e.preventDefault();
    setDeleteTarget(certificateData);
    setOpen(true);
    {isMobile && handleCloseMenu()}
  };

  const handleCloseDialog = () => setOpen(false);

  return (
    <>
      {icon === 'edit' && (
        <CertificateIcon icon={EditIcon} title="Edit" onClick={handleEdit} />
      )}
      {icon === 'delete' && 
        <CertificateIcon icon={DeleteIcon} title="Delete" onClick={handleOpenDialog} />
      }
      {isMobile && 
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          {certificateData['file'] && (
            <StyledMenuItem onClick={handleView}>VIEW</StyledMenuItem>
          )}

          {certificateData['file'] && isPrintableCertificate && (
            <StyledMenuItem onClick={handlePrintCertificate}>PRINT</StyledMenuItem>
          )}
          {certificateData['file'] && (
            <StyledMenuItem onClick={handleSendMail}>SEND MAIL</StyledMenuItem>
          )}
          {isCertificateUserAdded && <StyledMenuItem onClick={handleEdit}>EDIT</StyledMenuItem>}
          {isCertificateUserAdded && <StyledMenuItem onClick={handleOpenDialog}>DELETE</StyledMenuItem>}
        </StyledMenu>
      }
      <Dialog open={open} onClose={handleCloseDialog} TransitionComponent={Transition} disableEnforceFocus>
        <DialogTitle>
          <Grid container spacing={1}>
            <Grid size={isMobile ? 2 : undefined}>
              <img src="/icons/certificates/bin.svg" alt='Delete Icon' />
            </Grid>
            <Grid size={isMobile ? 10 : undefined}>
              <div style={classes.title}>
                Are you sure you want to delete this
              </div>
              <div style={classes.subTitle}>
                This action will permanently delete <b>{certificateName}</b>
              </div>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button disabled={loading} variant="contained" onClick={handleDelete}>
            {loading ? <Loader width="24" color="#444" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
