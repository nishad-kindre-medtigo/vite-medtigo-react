import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { states, certCategories } from 'src/appConstants';
import { Grid } from '@mui/material';
import certificatesService from 'src/services/certificatesService';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { LICENSE_STATES, formatActiveData, scrollToCertificate, getCertificateNameFromPage } from '../utils';
import { ActionButton, CustomDatePicker, SelectField, FileUploadField, ErrorMessage } from '../components';

// FOR STATE LICENSE, DEA & STATE CSR/CSC PAGES
const RegulatoryForm = ({ type, page, handleClose, CERTIFICATE_TYPES }) => {
  const openSnackbar = useOpenSnackbar();
  const { activeCertificateData, METHODS, isEdit, highlightedCertID, setHighlightedCertID } = useCertificatesContext();
  const activeData = Object.keys(activeCertificateData).length
    ? formatActiveData(activeCertificateData)
    : {};

  const [inputs, setInputs] = useState(activeData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCertificates, setActiveCertificates] = useState([]); // CERTIFICATE NAME
  const [fileUploadProgress, setFileUploadProgress] = useState(null);

  const expiryDate = inputs['Expiry_Date']
    ? new Date(inputs['Expiry_Date'])
    : null;

  const autoFillCertificateName = page == 'DEA' || page === 'STATE CSR/CSC';

  const fileUploadAction = {
    onUploadProgress: function(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setFileUploadProgress(percentCompleted);
    }
  };

  // COMMON HANDLER FOR ALL INPUTS
  const handleInputChange = (e, fieldName, fieldValue) => {
    const name = fieldName ? fieldName : e?.target?.name;
    const value = fieldValue ? fieldValue : e?.target?.value;

    if (name) {
      setInputs(prevInputs => {
        const updatedInputs = { ...prevInputs, [name]: value };
        return updatedInputs;
      });
    }
  };

  // SAVE DATE AS EXPIRY DATE IN INPUTS
  const handleDateChange = date => {
    if (date) {
      handleInputChange(null, 'Expiry_Date', date);
    }
  };

  // CHANGE THE OPTIONS FOR CERTIFICATE NAME FIELD FOR STATE LICENSE PAGE ACCORDING TO STATE SELECTED
  useEffect(() => {
    if (inputs?.State) {
      const activeCertificates = JSON.parse(
        states.find(state => state.id === inputs?.State)?.certificates
      )
        .filter(item => item.name.includes('License'))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Add the new object to the array
      activeCertificates.push({
        name: 'License-LPN',
        id: '3993767000000047098',
        validity: 'Expires'
      });

      // Set the active certificates
      setActiveCertificates(activeCertificates);
    }
  }, [inputs]);

  const submitForm = async () => {
    setIsSubmitted(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      const data = {
        Certificate_Name: inputs['Certificate_Name'],
        entered_from_frontend: true,
        State: inputs['State'],
        Expiry_Date: inputs['Expiry_Date'],
        Category: inputs['Category']
      };
      if (!inputs['Expiry_Date']) {
        delete data['Expiry_Date'];
      }
      for (let key in data) {
        let appendValue = data[key];
        if (key === 'Expiry_Date') {
          appendValue = appendValue
            ? moment(appendValue).format('MM-DD-YYYY')
            : null;
        }
        appendValue && formData.append(key, appendValue);
      }
      formData.append('Nature_of_Certificate', 'Mandatory');
      if (!isEdit && inputs['Expiry_Date']) {
        formData.append('Validity', 'Granted/Active');
      } else if (!isEdit && !inputs['Expiry_Date']) {
        formData.append('Validity', 'Lifetime');
      }
      setSaving(true);
      formData.append('file', inputs['file']);
      const certificateResp = isEdit
        ? await certificatesService.editUserCertificate(
            formData,
            activeCertificateData['id'],
            fileUploadAction
          )
        : await certificatesService.addUserCertificates(
            formData,
            fileUploadAction
          );

      // Highlight & Scroll to current certificate
      if (certificateResp) {
        const refreshPageData = METHODS[page];
        await refreshPageData();
        let certID = null;

        if (isEdit) {
          certID = certificateResp['data']['ID'];
        } else {
          certID = certificateResp['data']['certificate_id'];
        }
        
        // Store the current certificate id to highlight
        setHighlightedCertID(certID);

        // Scroll to current added/ edited certificate
        scrollToCertificate(certID);
      }

      handleClose();
      openSnackbar(
        isEdit
          ? `${type} Updated Successfully!`
          : `${type} Added in Tracker Successfully!`
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(error.error);
    } finally {
      setIsSubmitted(false);
    }
  };

  // AUTOFILL TYPE TEXTFIELD
  useEffect(() => {
    handleInputChange(null, 'Category', 'stateLicense');
  }, []);

  // AUTOFILL CERTIFICATE NAME TEXTFIELD & DISABLE
  useEffect(() => {
    if (page === 'DEA') {
      handleInputChange(null, 'Certificate_Name', '3993767000000019023');
    } else if (page === 'STATE CSR/CSC') {
      handleInputChange(null, 'Certificate_Name', '3993767000000047099');
    } else {
      return;
    }
  }, []);

  const handleFormSubmit = e => {
    e.preventDefault();
    try {
      setIsSubmitted(true);

      if (isEdit) {
        submitForm(inputs);
      } else {
        // SUBMIT FORM ONLY IF FILE IS SELECTED
        inputs['file'] && expiryDate && submitForm(inputs);
      }
    } catch (error) {
      console.error('Error occurred during submission:', error);
      openSnackbar(errorMessage, 'error');
    }
  };

  const datePickerProps = {
    label: "Expiration Date *",
    disabled: !inputs?.Category || !inputs?.State,
    selectedDate: expiryDate,
    handleDateChange,
  };

  const fileInputProps = {
    inputs,
    setInputs,
    setErrorMessage,
    handleInputChange,
    setIsSubmitted,
    activeCertificateData,
    isEdit
  };

  return (
    <Grid container direction="column">
      <form onSubmit={handleFormSubmit}>

        {/* DEFAULT REGULATORY TYPE SELECTED */}
        <SelectField
          id="category"
          label="Type"
          disabled={true}
          options={CERTIFICATE_TYPES}
          value={
            inputs['Category']
              ? certCategories.find(cat => cat.id === inputs['Category'])
              : null
          }
        />

        {/* CERTIFICATE NAME - DEFAULT LICENSE-DEA OR LICENSE-CSR BASED ON CURRENT PAGE */}
        {autoFillCertificateName && (
          <SelectField
            id="certificate"
            label="Certificate Name"
            disabled={true}
            options={activeCertificates}
            value={getCertificateNameFromPage(page)}
          />
        )}

        {/* USA STATES - ALABAMA, CALIFORNIA, TEXAS ... */}
        <SelectField
          id="state"
          label="State"
          options={LICENSE_STATES}
          value={
            inputs['State']
              ? states.filter(state => state.id === inputs['State'])[0]
              : null
          }
          onChange={(e, value) =>
            handleInputChange(e, 'State', value ? value.id : '')
          }
        />

        {/* CERTIFICATE NAME OPTIONS - LICENSES */}
        {!autoFillCertificateName && (
          <SelectField
            id="certificate"
            label="Certificate Name"
            disabled={!inputs?.Category || !inputs?.State}
            options={activeCertificates}
            value={
              inputs['Certificate_Name'] && activeCertificates
                ? activeCertificates.filter(
                    cert => cert.id === inputs['Certificate_Name']
                  )[0] || null
                : null
            }
            onChange={(e, value) =>
              handleInputChange(e, 'Certificate_Name', value.id)
            }
          />
        )}

        {/* EXPIRY DATE FIELD  */}
        {/* NOT APPLICABLE FOR HEALTH CERTIFICATE TYPE */}
        <CustomDatePicker {...datePickerProps} />

        {/* EXPIRY DATE MANDATORY MESSAGE */}
        {!isEdit && isSubmitted && !expiryDate && (
          <ErrorMessage errorMessage="Please select expiration date to continue." />
        )}

        {/* ADD CERTIFICATE FILE FIELD */}
        <FileUploadField {...fileInputProps} />

        {/* FILE MANDATORY MESSAGE */}
        {!isEdit && isSubmitted && !inputs['file'] && (
          <ErrorMessage errorMessage="Please upload a certificate file to continue." />
        )}

        {/* API ERROR MESSAGE */}
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        <ActionButton saving={saving} isEdit={isEdit} />
      </form>
    </Grid>
  );
};

export default RegulatoryForm;
