import isPrintable from '../../../utils/isPrintable';
import { SERVER_URL } from '../../../settings';
import printJS from 'print-js'; // Import print-js

export const printCertificate = filePath => {
  const isPrintableCertificate = isPrintable(filePath);

  // Use print-js to print the certificate directly
  printJS({
    printable: SERVER_URL + filePath,
    type: isPrintableCertificate.type, // Specify that the file is a PDF
    showModal: true, // Show a loading modal while fetching the file
    modalMessage: 'Preparing your document...', // Custom message in the modal
    onError: error => {
      console.error('Error while printing:', error);
      alert('An error occurred while fetching the document. Please try again.');
    }
  });
};

export const isDateAfterToday = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the start of the day
  return date && new Date(date) > today;
};