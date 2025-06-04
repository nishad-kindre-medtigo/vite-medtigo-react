import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CertificateActions } from 'src/views/MonitoringRenewal/components/CertificateActions';
import certificatesService from 'src/services/certificatesService';
import { useSelector } from 'react-redux';
import { getCertificateExpiryDetails } from 'src/utils/getCertificateExpiryDetails';
import RenewLicenseDialog from 'src/views/MonitoringRenewal/dialogs/RenewLicenseDialog';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { StyledCard, CertificateContent, PrimaryText, SecondaryText, AddedByYou, MenuIcon, ProgressIcon, ActionContainer, ActionButton } from 'src/views/MonitoringRenewal/ui';
import CardActions from 'src/views/MonitoringRenewal/components/CardActions';

const StateLicenseCard = props => {
  const { isMobile } = useBreakpoints();
  const { openSnackbar } = useOpenSnackbar();
  const { id: userID } = useSelector(state => state.account.user);
  const { data, completed } = props;

  // Memoize the expiration details based on specific dependencies
  const { expiryDays, expiryImage, expiryColor, daysDifference } = useMemo(
    () => getCertificateExpiryDetails(data['expiry_date'], false),
    [data['expiry_date'], data.certificate_name]
  );

  const [openMail, setOpenMail] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandCard, setExpandCard] = useState(false);

  const isUserAdded = data['entered_from_frontend'] == 1;
  const isGrantedActiveTask = data['validity'] === 'Granted/Active';

  const highlight = completed === data['id'];
  const certificateName = data['certificate_name'];

  // Set Certificate Name
  const stateAbbr = data['state_abbr'] ? ` - ${data['state_abbr']}` : '';
  const fullText = `${certificateName}${stateAbbr}`.trim();

  const truncatedText =
    fullText.length > (isMobile ? 25 : 35)
      ? fullText.slice(0, isMobile ? 25 : 35) + '...'
      : fullText;

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickOpenMail = () => {
    setOpenMail(true);
  };

  const handleCloseOpenMail = () => {
    setOpenMail(false);
  };

  // Renew License Button Click Logic
  const sendLicenseRenewalMail = async () => {
    try {
      const form = new FormData();
      form.set('Certificate_Name', data.certificate_name);
      form.set('Expiry_Date', data.expiry_date);
      form.set('Analyst_Id', data.analyst_id);
      form.set('Validity', 'Renew Initiated');
      form.set('State', data.state_id || '');
      form.set('Nature_of_Certificate', data.Nature_of_Certificate || '');
      const response = await certificatesService.editCertificate(data.id, form);
      if (response) {
        const formData = new FormData();
        formData.append('UserID', userID);
        formData.append('CertificateId', data.id);
        formData.append('Certificate_Name', data.certificate_name);
        formData.append('State_abbr', data.state);
        formData.append('Expiry_date', data.expiry_date);
        const sendMail = await certificatesService.sendCertificateRegenerateEmail(
          formData
        );
        if (sendMail) {
          setOpenMail(false);
          openSnackbar('License Renewal Initiated');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledCard id={data.id} highlight={highlight}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ProgressIcon src={`/icons/certificates/${expiryImage}`} />
        <CertificateContent>
          <PrimaryText title={fullText} onClick={() => setExpandCard(!expandCard)}>
            {expandCard ? fullText : truncatedText}
          </PrimaryText>
          <PrimaryText>
            {daysDifference > 0 && <span>Expiry in - <span style={{ color: expiryColor }}>{expiryDays}</span></span>}
            {data['validity'] === 'Lifetime' && <span style={{ color: expiryColor }}>Lifetime</span>}
            {daysDifference <= 0 && data['validity'] !== 'Lifetime' && <span style={{ color: expiryColor}}>Expired</span>}
          </PrimaryText>
          {data['expiry_date'] && (
            <SecondaryText>
              Expiration date: {moment(data['expiry_date'], 'MM-DD-YYYY').format('MMM DD, YYYY')}
            </SecondaryText>
          )}
        </CertificateContent>
      </Box>

      {/* ACTIONS IN MENU FOR MOBILE VIEW */}
      {isMobile && (
        <MenuIcon>
          <MoreVertIcon onClick={handleClickMenu} />
          <CertificateActions
            page='STATE LICENSE'
            anchorEl={anchorEl}
            handleCloseMenu={handleCloseMenu}
            isMobile={true}
            certificateData={data}
          />
        </MenuIcon>
      )}
      <ActionContainer>
        {isUserAdded && <AddedByYou />}
        
        {/* STATE LICENSE CARD VIEW, EDIT, DELETE & SEND MAIL ICON */}
        {!isMobile && <CardActions page='STATE LICENSE' data={data} />}

        {/* LICENSE RENEW BUTTON */}
        {isGrantedActiveTask && !isUserAdded && (
          <ActionButton onClick={handleClickOpenMail} disabled={isDisabled} buttonText="RENEW" />
        )}
      </ActionContainer>
      <RenewLicenseDialog
        open={openMail}
        onClose={handleCloseOpenMail}
        handleRenew={() => {
          sendLicenseRenewalMail();
          setDisabled(true);
        }}
      />
    </StyledCard>
  );
};

export default StateLicenseCard;
