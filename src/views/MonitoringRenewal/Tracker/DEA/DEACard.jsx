import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CertificateActions } from '../../../MonitoringRenewal/components/CertificateActions';
import { getCertificateExpiryDetails } from '../../../../utils/getCertificateExpiryDetails';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { StyledCard, CertificateContent, PrimaryText, SecondaryText, AddedByYou, MenuIcon, ProgressIcon, ActionContainer } from '../../../MonitoringRenewal/ui';
import CardActions from '../../../MonitoringRenewal/components/CardActions';

const CertificateCard = props => {
  const { isMobile } = useBreakpoints();
  const { data, highlightedCertID, page } = props;
  const isUserAdded = data['entered_from_frontend'] == 1;
  const highlight = highlightedCertID == data['id'];

  // Memoize the expiration details based on specific dependencies
  const { expiryDays, expiryImage, expiryColor, daysDifference } = useMemo(
    () => getCertificateExpiryDetails(data['expiry_date'], false),
    [data['expiry_date'], data.certificate_name]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [expandCard, setExpandCard] = useState(false);
  const certificateName = data['certificate_name'] == 'ASLS' ? 'ASC CE' : data['certificate_name'];

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
            {daysDifference <= 0 && data['validity'] !== 'Lifetime' && <span style={{ color: expiryColor }}>Expired</span>}
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
            page={page}
            anchorEl={anchorEl}
            handleCloseMenu={handleCloseMenu}
            isMobile={true}
            certificateData={data}
          />
        </MenuIcon>
      )}

      {/* DEA & STATE CSR CARD VIEW, EDIT, DELETE & SEND MAIL ICON - ONLY FOR BIG SCREEN */}
      <ActionContainer>
        {isUserAdded && <AddedByYou />}
        
        {!isMobile && <CardActions page={page} data={data} />}
      </ActionContainer>
    </StyledCard>
  );
};

export default CertificateCard;
