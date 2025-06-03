import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CertificateActions } from '../../../MonitoringRenewal/components/CertificateActions';
import { useMyLearningContext } from '../../../../context/MyLearningContext';
import { getCertificateExpiryDetails } from '../../../../utils/getCertificateExpiryDetails';
import useBreakpoints from '../../../../hooks/useBreakpoints';
import { courses as courseContentData } from '../../../Acquisition/MyLearning/data';
import { StyledCard, CertificateContent, PrimaryText, SecondaryText, AddedByYou, OldCertificateText, MenuIcon, ProgressIcon, ActionContainer, ActionButton } from '../../../MonitoringRenewal/ui';
import CardActions from '../../../MonitoringRenewal/components/CardActions';

const Loader = () => (
  <></>
);

const CertificateCard = props => {
  const { isMobile } = useBreakpoints();
  const { handleButtonClick } = useMyLearningContext();
  const { data, courseCertData, setSelectedCourseID, setIsOrderTypeFullAccess, completed, hasRenewButton } = props;
  const isUserAdded = data['entered_from_frontend'] == 1;

  // Memoize the expiration details based on specific dependencies
  const { expiryDays, expiryImage, expiryColor, daysDifference } = useMemo(() => 
    getCertificateExpiryDetails(data['expiry_date'], true),
    [data['expiry_date'], data.certificate_name]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [expandCard, setExpandCard] = useState(false);
  const [cardContent, setCardContent] = useState({});
  
  const highlight = completed === data['id'];
  const certificateName = data['certificate_name'] == 'ASLS' ? 'ASC CE' : data['certificate_name'];

  // Set Certificate Name
  const fullText = certificateName.trim();

  const truncatedText =
    fullText.length > (isMobile ? 25 : 35)
      ? fullText.slice(0, isMobile ? 25 : 35) + '...'
      : fullText;

  // To set the CTA button text for system provider cards
  useEffect(() => {
    const currentImages = courseContentData.find(item => item.id == data['courseID']);
    if (!isUserAdded) {
      setCardContent(currentImages);
    }
  }, []);
    
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleClickMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  // Only For System generated provider card CTA button
  const handleCertificateButtonClick = () => {
    let currentPlan;
    if(courseCertData.order){
      currentPlan = courseCertData.order.plan;
      const isOrderTypeFullAccess = courseCertData.order.order_type == "Full_Access";
      setIsOrderTypeFullAccess(isOrderTypeFullAccess);
    }
    setSelectedCourseID(cardContent.id);
    handleButtonClick(courseCertData.buttonText, currentPlan, cardContent);
  }

  return (
    <StyledCard id={data.id} highlight={highlight}>
      {/* CERTIFICATE INFORMATION */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ProgressIcon src={`/icons/certificates/${expiryImage}`} />
        <CertificateContent>
          <PrimaryText title={fullText} onClick={() => setExpandCard(!expandCard)}>
            {expandCard ? fullText : truncatedText}
          </PrimaryText>
          <PrimaryText>
            {daysDifference > 0 && <span>Expiry in - <span style={{ color: expiryColor }}>{expiryDays}</span></span>}
            {data?.Category == '3993767000000075003' && !data['expiry_date'] && <span style={{ color: expiryColor }}>Lifetime</span>}
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

      {/* ACTIONS - EDIT, DELETE, VIEW, MAIL IN MENU POPUP FOR MOBILE VIEW */}
      {isMobile && (
        <MenuIcon>
          <MoreVertIcon onClick={handleClickMenu} />
          <CertificateActions
            page='CLINICAL CERTIFICATE'
            anchorEl={anchorEl}
            handleCloseMenu={handleCloseMenu}
            isMobile={true}
            certificateData={data}
          />
        </MenuIcon>
      )}
      <ActionContainer>
        {isUserAdded && <AddedByYou />}

        {!hasRenewButton && !isUserAdded && <OldCertificateText />}

        {/* PROVIDER CARD VIEW, EDIT, DELETE & SEND MAIL ICON */}
        {!isMobile && <CardActions page='CLINICAL CERTIFICATE' data={data} />}

        {/* RENEW BUTTON DISPLAYED ONLY FOR LATEST PROVIDER CARD FOR EACH COURSE*/}
        {hasRenewButton && (
          <ActionButton onClick={handleCertificateButtonClick} buttonText={courseCertData?.buttonText || ". . ."} />
        )}
      </ActionContainer>
    </StyledCard>
  );
};

export default CertificateCard;
