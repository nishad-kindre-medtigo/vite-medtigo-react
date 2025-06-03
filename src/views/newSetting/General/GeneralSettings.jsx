import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Autocomplete } from '@mui/material';
import { updateProfile } from '../../../actions/accountActions';
import { designations, countryList, showSpecialtyFor, showProgramFor, specialityOptions, studentProgramOptions, designationsObject } from '../../../appConstants';

function GeneralSettings({ user, setUser, open, handleClose }) {
  const dispatch = useDispatch();
  const openSnackbar = useOpenSnackbar();
  const [specialityType, setSpecialityType] = useState(false);
  const [specialityList, setSpecialityList] = useState([]);
  const [designationId, setDesignationId] = useState(user.designation_id);
  const [specialty, setSpeciality] = useState(user.specialty);
  const [showNPIField, setShowNPIField] = useState(false);
  const { formPicture } = useSelector(state => state.account);

  const checkNPIFieldVisibility = (country, designation) => {
    if (
      country === 'United States' &&
      [
        'Dentist',
        'Nurse Practitioner',
        'Physician Assistant',
        'Doctor',
        'Anesthesia Assistant'
      ].includes(designation)
    ) {
      setShowNPIField(true);
    } else {
      setShowNPIField(false);
    }
  };

  useEffect(() => {
    if (showSpecialtyFor.includes(user.designation_id)) {
      setSpecialityType(true);
      setSpecialityList(specialityOptions);
    } else if (showProgramFor.includes(user.designation_id)) {
      setSpecialityType(true);
      setSpecialityList(studentProgramOptions);
    }

    checkNPIFieldVisibility(user.country, user.designation_name);
  }, [user.country, user.designation_name, user.designation_id]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle
        sx={{
          borderBottom: '1px solid',
          borderColor: 'grey.400',
          gap: 1
        }}
      >
        <Typography variant="h5" fontWeight={500}>
          Edit Profile
        </Typography>
      </DialogTitle>
      <Formik
        enableReinitialize
        initialValues={{
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          designation_id: user.designation_id || '',
          country: user.country || '',
          specialty: user.specialty || '',
          npi_number: user.npi_number || ''
        }}
        validationSchema={Yup.object().shape({
          first_name: Yup.string()
          .matches(/^[A-Za-zÀ-ÿ-'. ]+$/, 'Only English Letters Allowed')
          .test('no-leading-trailing-space', 'Remove spaces from beginning and end', 
                value => {
                  // Only apply this validation if the field is not empty
                  if (!value) return true;
                  // Check if the value has leading or trailing spaces
                  return value === value.trim();
                })
          .min(3, 'Please enter valid first name')
          .max(25, 'First name cannot exceed 25 characters.')
          .required('First name is required'),
          last_name: Yup.string()
          .matches(/^[A-Za-zÀ-ÿ-'. ]+$/, 'Only English Letters Allowed')
          .test('no-leading-trailing-space', 'Remove spaces from beginning and end', 
          value => {
            // Only apply this validation if the field is not empty
            if (!value) return true;
            // Check if the value has leading or trailing spaces
            return value === value.trim();
          })
          .min(1, 'Please Enter valid last name')
            .max(25, 'Last name cannot exceed 25 characters.')
            .required('Last name is required'),    
          phoneNumber: Yup.string().matches(
            /^(?=.*\d)[+\d\s()-]{5,20}$/,
            'Invalid Phone number'
          ),
          npi_number: Yup.string().matches(/^[0-9]{10}$/, 'Invalid NPI Number')
        })}
        onSubmit={async (
          values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          try {
            values.designation_id = designationId;
            values.specialty = specialty;
            await dispatch(
              updateProfile(
                formPicture ? { ...values, file: formPicture } : values
              )
            );
            setUser(values);
            resetForm();
            setStatus({ success: true });
            openSnackbar('Profile updated successfully');
            handleClose();
          } catch (error) {
            setStatus({ success: false });
            setErrors({
              submit: error || 'Some error occurred, please try again.'
            });
          } finally {
            setSubmitting(false);
          }
          const filteredNames = Object.keys(values).filter(name =>
            /designation_id-[a-zA-Z 0-9]/.test(name)
          );
          if (filteredNames.length > 0) {
            values.designation_id =
              designationsObject[
                filteredNames[0].replace('designation_id-', '')
              ]['id'];
          } else if (!values.designation_id) {
            values.designation_id = '';
          }
          const filteredSpecialty = Object.keys(values).filter(name =>
            /specialty-option-[a-zA-Z 0-9]/.test(name)
          );
          if (filteredSpecialty.length > 0) {
            values.specialty = filteredSpecialty[0].replace(
              'specialty-option-',
              ''
            );
          } else if (!values.specialty) {
            values.specialty = '';
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="First Name*"
                    name="first_name"
                    value={values.first_name || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Last Name*"
                    name="last_name"
                    value={values.last_name || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Email ID*"
                    name="email"
                    value={values.email || ''}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Phone Number"
                    name="phoneNumber"
                    value={values.phoneNumber || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    getOptionLabel={option => option.name}
                    id="designation_id"
                    options={designations}
                    name={'designation_id'}
                    onChange={(event, newValue) => {
                      const text = newValue ? newValue.name : '';
                      const designation_id = newValue
                        ? designationsObject[text]['id']
                        : '';

                      handleChange('designation_id-' + designation_id)(event);
                      setDesignationId(designation_id);

                      // Update NPI visibility based on the current form values
                      checkNPIFieldVisibility(values.country, text);

                      if (showSpecialtyFor.indexOf(designation_id) > -1) {
                        setSpecialityList(specialityOptions);
                        setSpecialityType(true);
                      } else if (showProgramFor.indexOf(designation_id) > -1) {
                        setSpecialityList(studentProgramOptions);
                        setSpecialityType(true);
                      } else {
                        setSpecialityList([]);
                        setSpecialityType(false);
                        values.specialty = '';
                      }
                    }}
                    defaultValue={
                      user.designation_id
                        ? designations.filter(
                            des => des.id === user.designation_id
                          )[0]
                        : null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        name={'designation'}
                        variant="outlined"
                        label="Profession"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                {specialityType && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      getOptionLabel={option => option}
                      id="specialty"
                      options={specialityList}
                      name={'specialty'}
                      onChange={event => {
                        const text = event.target.innerText;
                        handleChange('specialty-option-' + text)(event);
                        setSpeciality(text);
                        values.specialty = text;
                      }}
                      defaultValue={user.specialty || ''}
                      renderInput={params => {
                        return (
                          <TextField
                            variant="outlined"
                            label="Specialty"
                            {...params}
                            margin="none"
                            name="specialty"
                            fullWidth
                            size="small"
                          />
                        );
                      }}
                    />
                  </Grid>
                )}
                {showNPIField && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="NPI Number"
                      name="npi_number"
                      value={values.npi_number || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.npi_number && Boolean(errors.npi_number)}
                      helperText={touched.npi_number && errors.npi_number}
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    getOptionLabel={option => option['name']}
                    defaultValue={
                      user.country &&
                      countryList.find(
                        countryObj => countryObj.name === user.country
                      )
                    }
                    options={countryList}
                    onChange={(e, option) => {
                      const countryName = option ? option.name : '';
                      setFieldValue('country', countryName);
                      checkNPIFieldVisibility(
                        countryName,
                        values.designation_name
                      );
                    }}
                    renderInput={params => {
                      return (
                        <TextField
                          variant="outlined"
                          label="Country"
                          {...params}
                          margin="none"
                          fullWidth
                          size="small"
                        />
                      );
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: 2, px: 3 }}>
              <Button variant="outlined" onClick={handleClose} disableElevation>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting} disableElevation>
                Save Changes
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}

GeneralSettings.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default GeneralSettings;
