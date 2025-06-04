import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'src/actions/accountActions';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import UpdateProfileService from 'src/services/updateProfileServices';
import { designations, showSpecialtyFor, specialityOptions, showProgramFor, studentProgramOptions, designationsObject } from 'src/appConstants';
import * as Yup from 'yup';
import { Formik } from 'formik';

const UserDetailsPopup = () => {
  const { user } = useSelector(state => state.account);
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [profession, setProfession] = useState(false);
  const [specialityType, setSpecialityType] = useState(false);
  const [specialityList, setSpecialityList] = useState([]);
  const openSnackbar = useOpenSnackbar();
  const dispatch = useDispatch();

  // OPEN THE USER SETAILS POPUP IF FOLLOWING DETAILS ARE NOT FILLED WHILE REGISTRATION
  const handleOpenPopup = () => {
    if (
      user.first_name == null ||
      (user.first_name == '' && user.last_name == '') ||
      user.last_name == null ||
      user.designation_name == null ||
      user.designation_name == ''
    ) {
      setOpen(true);
    }
  };

  // CLOSE POPUP UPON DETAILS SUBMISSION
  const handleClosePopup = () => {
    setOpen(false);
  };

  // DISPLAY NPI NUMBER TEXTFIELD FOR USA DOCTORS
  // DISPLAY PROFESSION TEXTFIELD IF NOTE ENTERED WHILE REGISTRATION
  const evaluateUserEligibility = () => {
    if (
      user.country == 'United States' &&
      (user.designation_name == 'Dentist' ||
        user.designation_name == 'Nurse Practitioner' ||
        user.designation_name == 'Physician Assistant' ||
        user.designation_name == 'Doctor' ||
        user.designation_name == 'Anesthesia Assistant')
    ) {
      setShowResults(true);
    }
    if (user.designation_name == null || user.designation_name == '') {
      setProfession(true);
    }
  }

  // CONDITIONALLY DISPLAY THE POPUP UPON 3 SECONDS AFTER LOGIN
  useEffect(() => {
    let displayPopup = setTimeout(() => handleOpenPopup(), 3000);
    evaluateUserEligibility();

    return () => {
      clearTimeout(displayPopup);
    };
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle align="center" sx={{ fontSize: '24px' }}>
        Thanks for Registering
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 500,
              color: '#000'
            }}
          >
            <WarningRoundedIcon color="warning" />
            <p>It looks like your profile is incomplete though.</p>
          </div>
          <p style={{ fontSize: '14px' }}>
            Our platform provides a customized experience based on your
            profession. Take a moment to complete the required fields on this
            form to continue.
          </p>
        </DialogContentText>
        <Formik
          enableReinitialize
          initialValues={{
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            designation_id: user.designation_id || '',
            specialty: user.specialty || '',
            npi_number: user.npi_number || '',
            country: user.country || '',
          }}
          validationSchema={Yup.object().shape({
            first_name: Yup.string()
              .max(255)
              .matches(/^[A-Za-zÀ-ÿ-' ]+$/, 'Only English Letters Allowed')
              .required('Required*'),
            last_name: Yup.string()
              .max(255)
              .matches(/^[A-Za-zÀ-ÿ-' ]+$/, 'Only English Letters Allowed')
              .required('Required*'),
            npi_number: Yup.string()
              .max(10)
              .matches(/^\d{10}$/, 'NPI number must be exactly 10 digits')
              .nullable() // Allows null or undefined values, making the field optional
          })}
          onSubmit={async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const filteredNames = Object.keys(values).filter(name =>
                /designation_id-[a-zA-Z 0-9]/.test(name)
              );
              if (filteredNames.length > 0) {
                const lastValue = filteredNames[filteredNames.length - 1];
                values.designation_id =
                  designationsObject[lastValue.replace('designation_id-', '')][
                    'id'
                  ];
              } else if (!values.designation_id) {
                values.designation_id = '';
              }
              const filteredSpecialty = Object.keys(values).filter(name =>
                /specialty-option-[a-zA-Z 0-9]/.test(name)
              );
              if (filteredSpecialty.length > 0) {
                const lastValue =
                  filteredSpecialty[filteredSpecialty.length - 1];
                values.specialty = lastValue.replace('specialty-option-', '');
              } else if (!values.specialty) {
                values.specialty = '';
              }
              await dispatch(updateProfile(values));
              resetForm();

              handleClosePopup();
              setStatus({ success: true });
              openSnackbar('Profile updated');
              const coursesData = await UpdateProfileService.addMyCredPoints(
                user.wpUserID
              );
              if (coursesData) {
                openSnackbar(
                  'Good job! you just earned 10 medtigo points.'
                );
              }
            } catch (error) {
              setStatus({ success: false });
              setErrors({
                submit: error || 'Some error occurred, please try again.'
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Box>
                <TextField
                  required
                  id="custom-css-outlined-input"
                  fullWidth
                  label="First Name"
                  name="first_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="first_name"
                  value={values.first_name || ''}
                  inputProps={{ autoComplete: 'off' }}
                  error={Boolean(touched.first_name && errors.first_name)}
                  helperText={touched.first_name && errors.first_name}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  type="last_name"
                  value={values.last_name || ''}
                  inputProps={{ autoComplete: 'off' }}
                  error={Boolean(touched.last_name && errors.last_name)}
                  helperText={touched.last_name && errors.last_name}
                  sx={{ mb: 2 }}
                />
                {profession ? (
                  <>
                    <Autocomplete
                      getOptionLabel={option => option.name}
                      id="designation_id"
                      options={designations}
                      name={'designation_id'}
                      onChange={(event, value) => {
                        // const text = event.target.innerText;
                        const text = value ? value.name : '';
                        handleChange('designation_id-' + text)(event);
                        setFieldValue('designation_id', text);

                        if (text) {
                          let designation_id = designationsObject[text]['id'];
                          if (showSpecialtyFor.indexOf(designation_id) > -1) {
                            setSpecialityList(specialityOptions);
                            setSpecialityType(true);
                          } else if (
                            showProgramFor.indexOf(designation_id) > -1
                          ) {
                            setSpecialityList(studentProgramOptions);
                            setSpecialityType(true);
                          } else {
                            setSpecialityList([]);
                            setSpecialityType(false);
                            values.specialty = '';
                          }
                        } else {
                          setSpecialityList([]);
                          setSpecialityType(false);
                          values.specialty = '';
                        }
                      }}
                      renderInput={params => {
                        return (
                          <TextField
                            label="Profession"
                            {...params}
                            margin="none"
                            required
                            name={'designation'}
                            sx={{ mb: 2 }}
                          />
                        );
                      }}
                    />
                    {specialityType && (
                      <Autocomplete
                        getOptionLabel={option => option}
                        id="specialty"
                        options={specialityList}
                        name={'specialty'}
                        onChange={event => {
                          const text = event.target.innerText;
                          handleChange('specialty-option-' + text)(event);
                        }}
                        defaultValue={user.specialty || ''}
                        renderInput={params => {
                          return (
                            <TextField
                              label="Specialty"
                              {...params}
                              margin="none"
                              required
                              name="specialty"
                              sx={{ mb: 2 }}
                            />
                          );
                        }}
                      />
                    )}
                  </>
                ) : null}

                {showResults ? (
                  <TextField
                    fullWidth
                    label="NPI Number"
                    name="npi_number"
                    type="npi_number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.npi_number && errors.npi_number)}
                    helperText={touched.npi_number && errors.npi_number}
                    sx={{ mb: 2 }}
                  />
                ) : null}

                <DialogActions sx={{ p: 0 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Box>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default UserDetailsPopup;
