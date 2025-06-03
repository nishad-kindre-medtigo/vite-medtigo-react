import React, { useState, useEffect } from 'react';
import * as moment from 'moment';
import { certCategories, creditTypes, specificDesignations } from '../../../../appConstants';
import { Box, Grid, TextField } from '@mui/material';
import certificatesService from '../../../../services/certificatesService';
import { useCertificatesContext } from '../../../../context/CertificatesContext';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { formatActiveData, scrollToCertificate } from '../utils';
import { ActionButton, AddCategoryButton, CustomDatePicker, SelectField, CreditHoursField, FileUploadField, MultipleCategoryBox, ErrorMessage } from '../components';

// FOR STATE LICENSE PAGE
const CMEForm = ({ type, page, handleClose, CERTIFICATE_TYPES }) => {
  const openSnackbar = useOpenSnackbar();
  const { activeCertificateData, fetchCMECertificates, isEdit, setHighlightedCertID} = useCertificatesContext();
  const activeData = Object.keys(activeCertificateData).length
    ? formatActiveData(activeCertificateData)
    : {};

  const [inputs, setInputs] = useState(activeData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const CME_CATEGORIES = specificDesignations.slice(1);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [categoryFields, setCategoryFields] = useState([
    { category_name: '', credit_hour: '' }
  ]);

  const completedDate = inputs['Date_of_Completion']
    ? new Date(inputs['Date_of_Completion'])
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
        return updatedInputs;
      });
    }
  };

  // SAVE DATE AS DATE OF COMPLETION IN INPUTS
  const handleDateChange = date => {
    if (date) {
      handleInputChange(null, 'Date_of_Completion', date);
    }
  };

  // ADD & FILL THE MULTIPLE CATEGORY FIELDS IF USER IS EDITING A CERTIFICATE
  useEffect(() => {
    isEdit && setCategoryPartitionFields();
  }, [isEdit]);

  //   FILL CATEGORY PARTITION FIELDS FOR EDIT CERTIFICATE
  const setCategoryPartitionFields = () => {
    if (activeCertificateData.category_partition) {
      const catPart = JSON.parse(activeCertificateData.category_partition)
        .category_partition;
      const catCopy = catPart;
      // CONVERTING CATEGORY ID TO CATEGORY NAME AND SAVING IN STATE
      catCopy.forEach((item, index) => {
        if (index > 0) {
          const found = CME_CATEGORIES.find(
            sp => sp.id == item.category_name
          );
          catCopy[index].category_name = found.name;
        }
      });
      setCategoryFields(catCopy);
    } else {
      setCategoryFields([
        {
          category_name: activeCertificateData['Specific_Designation']['ID'],
          credit_hour: activeCertificateData['No_of_Credit_Hours']
        }
      ]);
    }
  };

  const submitForm = async () => {
    setIsSubmitted(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      // check if credit partition is less or equal to total credit hours
      let totalCredit = 0;

      for (const item of categoryFields) {
        if (item.credit_hour === '0') {
          setIsSubmitted(false);
          setErrorMessage('Please enter a positive value for credit hours');
          return; // Exit the loop and function early
        }

        totalCredit += Number(item.credit_hour);
      }

      if (inputs['No_of_Credit_Hours'] === '0') {
        setIsSubmitted(false);
        return setErrorMessage(
          'Please enter positive value for total credit hours'
        );
      }
      if (totalCredit > inputs['No_of_Credit_Hours']) {
        setIsSubmitted(false);
        return setErrorMessage(
          'Credit partition is exceeding total credit hours'
        );
      }
      let generalCredit = inputs['No_of_Credit_Hours'] - totalCredit;
      if (inputs['Specific_Designation'] == specificDesignations[0].id) {
        setIsSubmitted(false);
        return setErrorMessage('Please Select CME Category');
      }
      const data = {
        Certificate_Name: inputs['CME_Certificate_Name'],
        entered_from_frontend: true,
        No_of_Credit_Hours: inputs['No_of_Credit_Hours'],
        Date_of_Commencement: moment().format('MM-DD-YYYY'),
        Date_of_Completion: inputs['Date_of_Completion'],
        Specific_Designation:
          inputs['Specific_Designation'] || specificDesignations[0].id,
        Types_of_Credit: inputs['Types_of_Credit'],
        type: 'cme'
      };
      for (let key in data) {
        let appendValue = data[key];
        if (key === 'Date_of_Commencement' || key === 'Date_of_Completion') {
          appendValue = moment(appendValue).format('MM-DD-YYYY');
        }
        formData.append(key, appendValue);
      }
      if (!inputs['Date_of_Completion']) {
        formData.append('Date_of_Completion', moment().format('MM-DD-YYYY'));
      }

      const catCopy = categoryFields;
      // CONVERTING CATEGORY NAME TO CATEGORY ID AND SENDING IN PAYLOAD
      catCopy.forEach((item, index) => {
        if (index > 0) {
          const found = CME_CATEGORIES.find(
            sp => sp.name == item.category_name
          );
          catCopy[index].category_name = found.id;
        }
      });

      formData.append(
        'category_partition',
        JSON.stringify({
          category_partition: catCopy,
          generalCredit,
          totalCredit
        })
      ); // sending category partition in json to store in table
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
        await fetchCMECertificates();
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

  //   TO ADD MULTIPLE CATEGORIES FOR CME CATEGORY & CREDIT HOURS
  const addCategoryFields = () => {
    setCategoryFields([
      ...categoryFields,
      { category_name: '', credit_hour: '' }
    ]);
  };

  // REMOVE MULTIPLE CATEGORIES FOR CME CATEGORY & CREDIT HOURS
  const removeCategoryFields = index => {
    setCategoryFields([]);
    setIsSubmitted(true);
    let data = [...categoryFields];
    data.splice(index, 1);
    setCategoryFields(data);
    setIsSubmitted(false);
  };

  // UPDATE MULTIPLE CATEGORIES FOR CME CATEGORY & CREDIT HOURS
  const categoryFieldChange = (index, val, field) => {
    const updatedFields = [...categoryFields]; // Create a shallow copy of the array
    updatedFields[index] = { ...updatedFields[index], [field]: val }; // Update the specific field
    setCategoryFields(updatedFields); // Update the state
  };

  // AUTOFILL TYPE TEXTFIELD
  useEffect(() => {
    handleInputChange(null, 'Category', 'cme');
  }, []);

  const handleFormSubmit = e => {
    e.preventDefault();
    try {
      setIsSubmitted(true);

      if (isEdit) {
        submitForm(inputs);
      } else {
        // SUBMIT FORM ONLY IF FILE & DATE OF COMPLETION IS SELECTED
        inputs['file'] && completedDate && submitForm(inputs);
      }
    } catch (error) {
      console.error('Error occurred during submission:', error);
      openSnackbar(errorMessage, 'error');
    }
  };

  const datePickerProps = {
    label: "Date of Completion *",
    isCME: true,
    selectedDate: completedDate,
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

        {/* DEFAULT CME/CE TYPE SELECTED */}
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

        {/* CERTIFICATE NAME - USER TYPABLE */}
        <TextField
          required
          fullWidth
          id="CME_Certificate_Name"
          name="CME_Certificate_Name"
          label="CME Certificate Name (e.g. Pain Management)"
          onChange={(e, value) =>
            handleInputChange(e, 'CME_Certificate_Name', value)
          }
          value={inputs['CME_Certificate_Name'] || ''}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          {/* DATE OF COMPLETION FIELD */}
          <CustomDatePicker {...datePickerProps} />

          {/* TOTAL CREDIT HOURS - ACCEPTS DECIMALS */}
          <TextField
            required
            fullWidth
            id="No_of_Credit_Hours"
            label="Total Credit Hours"
            name="No_of_Credit_Hours"
            type="text" // Change type to text for better control
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 4 }}
            onChange={e => {
              const value = e.target.value;

              // Allow only valid numbers, including decimals
              if (value === '' || /^(\d+(\.\d*)?|\.\d+)$/.test(value)) {
                handleInputChange(e, 'No_of_Credit_Hours', value);
              }
            }}
            value={inputs['No_of_Credit_Hours'] || ''}
            error={inputs['No_of_Credit_Hours'] === '0'}
            helperText={
              inputs['No_of_Credit_Hours'] === '0'
                ? 'Please enter positive value'
                : ''
            }
          />
        </Box>

        {/* DATE OF COMPLETION MADATORY MESSAGE */}
        {!isEdit && isSubmitted && !completedDate && (
          <ErrorMessage errorMessage="Please select the Date of Completion to continue." />
        )}

        {/* TYPE OF CREDIT - AMA PRA 1, AMA PRA 2 */}
        <SelectField
          id="credit_type"
          label="Type of Credit"
          options={creditTypes}
          onChange={(e, value) =>
            handleInputChange(e, 'Types_of_Credit', value.id)
          }
          value={
            inputs['Types_of_Credit']
              ? creditTypes.find(
                  credit => credit.id === inputs['Types_of_Credit']
                )
              : null
          }
        />

        {/* CME CATEGORY - CHILD ABUSE, BIOTERRORISM, SEXUAL VIOLENCE .etc */}
        <SelectField
          id="Specific_Designation"
          label="CME Category"
          options={CME_CATEGORIES}
          onChange={(e, value) => {
            if (value) {
              handleInputChange(e, 'Specific_Designation', value.id);
              categoryFieldChange(0, value.id, 'category_name');
            }
          }}
          value={
            inputs['Specific_Designation']
              ? CME_CATEGORIES.find(
                  des => des.id === inputs['Specific_Designation']
                )
              : null
          }
        />

        {/* PRIMARY CREDIT HOURS - ACCEPTS DECIMALS */}
        <CreditHoursField
          value={categoryFields[0].credit_hour || ''}
          index={0}
          categoryFieldChange={categoryFieldChange}
          error={categoryFields[0].credit_hour === '0'}
        />

        {/* MULTI - CATEGORIES FOR CME CATEGORY & CREDIT HOURS */}
        {categoryFields.length > 0
          ? categoryFields.map((item, index) => {
              if (index > 0) {
                return (
                  <MultipleCategoryBox
                    key={index}
                    index={index}
                    remove={() => removeCategoryFields(index)}
                  >
                    <SelectField
                      id="cme-category"
                      label="CME Category"
                      options={CME_CATEGORIES}
                      value={
                        CME_CATEGORIES.find(
                          des => des.id === item.category_name || des.name === item.category_name
                        )
                      }
                      onChange={(event, newValue) => {
                        if (newValue) {
                          categoryFieldChange(
                            index,
                            newValue.name,
                            'category_name'
                          );
                        }
                      }}
                    />
                    <CreditHoursField
                      value={item.credit_hour}
                      index={index}
                      categoryFieldChange={categoryFieldChange}
                      error={item.credit_hour === '0'}
                    />
                  </MultipleCategoryBox>
                );
              }
            })
          : null}

        {/* ADD MULTIPLE CME CATEGORY BUTTON */}
        <AddCategoryButton onClick={addCategoryFields} />

        {/* UPLOAD CERTIFICATE INPUT FIELD */}
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

export default CMEForm;
