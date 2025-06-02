import * as moment from 'moment';
import { states, certCategories } from '../../../../appConstants';

// FILTER OUT HEALTH, CERTIFICATE COURSES, MALPRACTICE, AND TRANSCRIPTS AND SCORES
export const LICENSE_STATES = states.filter(
  state =>
    state.id !== '3993767000000075003' &&
    state.id !== '3993767000000047787' &&
    state.id !== '3993767000000078035' &&
    state.id !== '3993767000000078039'
);

export const getCertificateNameFromPage = page => {
  return page == 'DEA'
    ? {
        name: 'DEA',
        id: '3993767000000019023',
        validity: 'Expires'
      }
    : {
        name: 'License-CSR',
        id: '3993767000000047099',
        validity: 'Expires'
      };
};

export const getCertificateTypeFromPage = () =>
  window.location.pathname.includes('certificate')
    ? [
        {
          name: 'Certificate Courses',
          id: '3993767000000047787',
          description: 'e.g ACLS, BLS, PALS'
        },
        {
          name: 'Health',
          id: '3993767000000075003',
          description: 'e.g Influenza/COVID-19 Vaccine'
        },
        {
          name: 'Malpractice',
          id: '3993767000000078035'
        },
        {
          name: 'Transcripts and Scores',
          id: '3993767000000078039'
        }
      ]
    : window.location.pathname.includes('ce-cme')
    ? [
        {
          name: 'CME/CE',
          id: 'cme',
          description: 'e.g Pain Management, Opioid Best Practices'
        }
      ]
    : [
        {
          name: 'Regulatory',
          id: 'stateLicense',
          description: 'e.g State Licenses'
        }
      ];

export const formatActiveData = activeData => {
  let category = {};
  const isCME = activeData['type'] === 'CME';
  if (isCME) {
    category = certCategories.find(cert => cert.id === 'cme');
  } else {
    category =
      certCategories.find(state => state.id.includes(activeData['state_id'])) ||
      certCategories.find(cert => cert.id === 'stateLicense');
  }
  let obj;
  if (isCME) {
    obj = {
      Category: category['id'],
      CME_Certificate_Name: activeData['certificate_name'],
      Date_of_Completion: activeData['Date_of_Completion'],
      No_of_Credit_Hours: parseFloat(activeData['No_of_Credit_Hours']),
      Specific_Designation: activeData['Specific_Designation']['ID'],
      Types_of_Credit: activeData['Types_of_Credit']['ID'],
      Date_of_Commencement: moment().format('MM-DD-YYYY')
    };
  } else {
    obj = {
      Certificate_Name: activeData['certificate_name_id'],
      Expiry_Date: activeData['expiry_date'],
      Category: category['id']
    };
    if (category.id === 'stateLicense') {
      const state = states.filter(state => state.name === activeData['state']);
      obj.State = state.length ? state[0].id : null;
    }
  }
  return obj;
};

// Find the element using its ID and scroll to
export const scrollToCertificate = certificateID => {
  const certificate = document.getElementById(certificateID); // Use the data.id  as the ID
  if (certificate) {
    window.scrollTo({
      top:
        certificate.offsetTop -
        window.innerHeight / 2 +
        certificate.offsetHeight / 2,
      behavior: 'smooth' // Smooth scroll
    });
  }
};
