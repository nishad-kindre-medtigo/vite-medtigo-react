import React, { useState, useEffect } from 'react';
import * as moment from 'moment';
import { states, certCategories } from '../../../../appConstants';
import { Grid } from '@mui/material';
import certificatesService from 'src/services/certificatesService';
import { useCertificatesContext } from 'src/context/CertificatesContext';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { formatActiveData, scrollToCertificate } from '../utils';
import { ActionButton, CustomDatePicker, SelectField, FileUploadField, ErrorMessage } from '../components';

// FOR CLINICAL CERTIFICATE PAGE
const CertificateForm = ({ type, page, handleClose, CERTIFICATE_TYPES }) => {
  const openSnackbar = useOpenSnackbar();
  const { activeCertificateData, isEdit, fetchClinicalCertificates, setHighlightedCertID } = useCertificatesContext();
  const activeData = Object.keys(activeCertificateData).length
    ? formatActiveData(activeCertificateData)
    : {};

  const [inputs, setInputs] = useState(activeData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeCertificates, setActiveCertificates] = useState([]);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);

  // Expiry Date not required for HEALTH Category Certificates
  const isExpiryDateRequired = inputs?.Category !== '3993767000000075003';

  const expiryDate = inputs['Expiry_Date']
    ? new Date(inputs['Expiry_Date'])
    : null;

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

        // Delete Expiry Date if Certificate Type is Health & previously selected for another category
        if (!isExpiryDateRequired && updatedInputs['Expiry_Date']) {
          delete updatedInputs['Expiry_Date'];
        }

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

  useEffect(() => {
    if (inputs?.Category) {
      setActiveCertificates(
        JSON.parse(
          states.find(state => state.id === inputs?.Category)?.certificates
        )
          .filter(item => item.name !== 'DEA')
          .sort((a, b) => a.name.localeCompare(b.name))
      );
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
      if (inputs?.Category) {
        formData.delete('State');
        formData.append('State', inputs['Category']);
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
        await fetchClinicalCertificates();
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

  const handleFormSubmit = e => {
    e.preventDefault();
    try {
      setIsSubmitted(true);

      if (isEdit) {
        submitForm(inputs);
      } else {
        // SUBMIT FORM ONLY IF FILE & EXPIRY DATE IS SELECTED 
        // NOT FOR HEALTH CATEGORY CERTIFICATES 
        if(isExpiryDateRequired){
          inputs['file'] && expiryDate && submitForm(inputs);
        } else {
          inputs['file'] && submitForm(inputs);
        }
      }
    } catch (error) {
      console.error('Error occurred during submission:', error);
      openSnackbar(errorMessage, 'error');
    }
  };

  const datePickerProps = {
    label:"Expiration Date *",
    required: isExpiryDateRequired,
    disabled: !inputs?.Category,
    selectedDate: expiryDate,
    handleDateChange
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
        {/* CERTIFICATE TYPES - CERTIFICATES COURSE, HEALTH, MALPRACTICE, TRANSCRIPTS */}
        <SelectField
          id="category"
          label="Type"
          options={CERTIFICATE_TYPES}
          value={
            inputs['Category']
              ? certCategories.find(cat => cat.id === inputs['Category'])
              : null
          }
          onChange={(e, value) =>
            handleInputChange(e, 'Category', value ? value.id : '')
          }
          showOptionDescription={true}
        />

        {/* CERTIFICATE NAME OPTIONS - CHANGES ACCORDING TO CERTIFICATE TYPE SELECTED */}
        <SelectField
          id="certificate"
          label="Certificate Name"
          disabled={!inputs?.Category}
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

        {/* EXPIRY DATE FIELD  */}
        {/* NOT APPLICABLE FOR HEALTH CERTIFICATE TYPE */}
        {isExpiryDateRequired && <CustomDatePicker {...datePickerProps} />}

        {/* EXPIRY DATE MANDATORY MESSAGE */}
        {!isEdit && isSubmitted && isExpiryDateRequired && !expiryDate && (
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

        {/* SAVE OR UPDATE BUTTON */}
        <ActionButton saving={saving} isEdit={isEdit} />
      </form>
    </Grid>
  );
};

export default CertificateForm;
