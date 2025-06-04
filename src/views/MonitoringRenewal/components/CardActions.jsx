import React from 'react';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import { CertificateActions } from './CertificateActions';
import { CertificateIcon } from '../ui';
import { SERVER_URL } from 'src/settings';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'; // New icon
import isPrintable from 'src/utils/isPrintable';
import { printCertificate } from '../utils';

const CardActions = ({ page, data }) => {
  const { setActiveCertificateData, setIsEmailDialogOpen, setRecipientEmails, setSendACopy } = useCertificatesContext();
  const isUserAdded = data['entered_from_frontend'] == 1;
  const isPrintableCertificate = data['file'] ? isPrintable(data['file']) : null;

  const handleViewCertificate = () => {
    window.open(SERVER_URL + data['file'], '_blank');
  };

  const handlePrintCertificate = () => {
    printCertificate(data['file']);
  };

  const handleEmailIconClick = () => {
    setActiveCertificateData({ ...data });
    setIsEmailDialogOpen(true);
    setRecipientEmails([]);
    setSendACopy({ shouldSend: false });
  };

  return (
    <div>
      {isUserAdded && <CertificateActions page={page} icon="edit" certificateData={data} />}
      {isUserAdded && <CertificateActions page={page} icon="delete" certificateData={data} />}
      {data['file'] && (
        <CertificateIcon
          icon={VisibilityRoundedIcon}
          title="View & Download"
          onClick={handleViewCertificate}
        />
      )}
      {data['file'] && isPrintableCertificate.printable && (
        <CertificateIcon
          icon={PrintRoundedIcon}
          title="Print"
          onClick={handlePrintCertificate} // New action for printing
        />
      )}
      {data['file'] && (
        <CertificateIcon
          icon={EmailRoundedIcon}
          title="Send Mail"
          onClick={handleEmailIconClick}
        />
      )}
    </div>
  );
};

export default CardActions;
