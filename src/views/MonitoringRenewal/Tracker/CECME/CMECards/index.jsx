import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CertificateActions } from '../../../../MonitoringRenewal/components/CertificateActions';
import { getCertificateExpiryDetails } from '../../../../../utils/getCertificateExpiryDetails';
import useBreakpoints from 'src/hooks/useBreakpoints';
import { StyledCard, CertificateContent, PrimaryText, SecondaryText, AddedByYou, MenuIcon, ProgressIcon, ActionContainer } from '../../../../MonitoringRenewal/ui';
import CardActions from '../../../../MonitoringRenewal/components/CardActions';
import { creditTypes } from 'src/appConstants';

const CMECard = props => {
  const { isMobile } = useBreakpoints();
  const { data, completed } = props;
  const isUserAdded = data['entered_from_frontend'] == 1;

  // Memoize the expiration details based on specific dependencies
  const { expiryImage } = useMemo(
    () => getCertificateExpiryDetails(data['expiry_date'], true),
    [data['expiry_date'], data.certificate_name]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [expandCard, setExpandCard] = useState(false);

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

  return (
    <StyledCard id={data.id} highlight={highlight}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ProgressIcon src={`/icons/certificates/${expiryImage}`} />
        <CertificateContent>
          <PrimaryText title={fullText} onClick={() => setExpandCard(!expandCard)}>
            {expandCard ? fullText : truncatedText}
          </PrimaryText>
          <PrimaryText>
            {parseFloat(data['No_of_Credit_Hours']).toFixed(2)} Credits
          </PrimaryText>
          <SecondaryText>
            Completed Date:{' '}
            {moment(data['Date_of_Completion'], 'MM-DD-YYYY').format(
              'MMM D, YYYY'
            )}
          </SecondaryText>
          <SecondaryText>
            Type of Credit: {creditTypes.find(credit => credit.id === data['Types_of_Credit']['ID'])?.name}
          </SecondaryText>
        </CertificateContent>
      </Box>

      {/* ACTIONS IN MENU FOR MOBILE VIEW */}
      {isMobile && (
        <MenuIcon>
          <MoreVertIcon onClick={handleClickMenu} />
          <CertificateActions
            page='CE/CME'
            anchorEl={anchorEl}
            handleCloseMenu={handleCloseMenu}
            isMobile={true}
            certificateData={data}
          />
        </MenuIcon>
      )}

      <ActionContainer>
        {isUserAdded && <AddedByYou />}

        {/* CME CARD VIEW, EDIT, DELETE & SEND MAIL ICON */}
        {!isMobile && <CardActions page='CE/CME' data={data} />}
      </ActionContainer>
    </StyledCard>
  );
};

export default CMECard;
