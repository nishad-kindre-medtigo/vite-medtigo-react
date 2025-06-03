import React, { useState, useContext } from 'react';
import { Autocomplete, Button, Box, TextField, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Typography, Grid, RadioGroup } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Page from '../../components/Page';
import learningService from '../../services/learningService';
import orderServices from '../../services/orderServices';
import certificatesService from '../../services/certificatesService';
import { useOpenSnackbar } from '../../hooks/useOpenSnackbar';
import { CertificatesContext } from '../../context/CertificatesContext';
import FormSubmitBackdrop from './components/FormSubmitBackdrop';
import FormSubmissionPopup from './components/FormSubmissionPopup';
import { CREDENTIALS, NURSE_OPTIONS, PHYSICIAN_OPTIONS } from './data';
import { DecisionOptions, RatingOptions } from './components/Options';
import { AccessDeniedScreen } from '../CourseLearning/components';
import { CertificateVariants } from '../../appConstants';

// SURVEY FORM VALID FOR ACLS, BLS, PALS, ASC CE COURSE
const RegularCourseForm = (props) => {
  const { courseID, hash, currentOrderID } = props;
  const { setActiveCertificateData, activeCertificateData, fetchCMECertificates } = useContext(CertificatesContext);
  const openSnackbar = useOpenSnackbar();
  const [surveyInputs, setSurveyInputs] = useState({ courseID: courseID });
  const [profession, setProfession] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialityOptions, setSpecialityOptions] = useState([]);
  const [showSpecialtyOptions, setShowSpecialtyOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const courseName = CertificateVariants.find(c => c.Course_id == courseID)?.name

  // CHANGE PROFESSION
  const handleProfession = value => {
    setProfession(value);
    if (value == 'Nurses') {
      setSpecialty('');
      setSpecialityOptions(NURSE_OPTIONS);
      setShowSpecialtyOptions(true);
    } else if (value == 'Physicians') {
      setSpecialty('');
      setSpecialityOptions(PHYSICIAN_OPTIONS);
      setShowSpecialtyOptions(true);
    } else if (value == 'Other') {
      setSpecialityOptions([]);
      setShowSpecialtyOptions(false);
    } else {
      setSpecialityOptions([]);
      setShowSpecialtyOptions(false);
    }
  };

  // SAVE USER FORM INPUTS
  const handleInputChange = (e, fieldName = null, fieldValue = null) => {
    let name = fieldName ? fieldName : e.target ? e.target.name : '';
    let value = fieldValue ? fieldValue : e.target ? e.target.value : '';
    if (e.target.type === 'checkbox') {
      const oldSurveysData = surveyInputs[name] ? surveyInputs[name] : [];
      value = e.target.checked
        ? [...oldSurveysData, e.target.value]
        : oldSurveysData.filter(s => s !== e.target.value);
    }
    name && setSurveyInputs(inputs => ({ ...inputs, [name]: value }));
  };

  // SUBMIT SURVEY FORM - GENERATE CME CERTIFICATE - CERTIFICATE ORDER LINK
  const handleSubmit = async e => {
    e.preventDefault();

    // Disable the button immediately
    setIsSubmitting(true);

    const credentials = specialty ? `${profession} - ${specialty}` : profession;
    Object.assign(surveyInputs, { credentials: credentials });

    try {
      // API To Double Check if user can claim CME for Current Order
      const resp = await orderServices.validateService({
        hash: hash,
        course: courseID
      });

      if (resp) {
        setSurveyInputs(inputs => ({ ...inputs, credentials: credentials }));
        let formData = JSON.parse(
          JSON.stringify(
            Object.assign(surveyInputs, { credentials: credentials })
          )
        );
        formData['courseID'] = courseID;

        for (let input in surveyInputs) {
          if (Array.isArray(formData[input])) {
            formData[input] = formData[input].join(', ');
          }
        }

        // Generate CME Certificate API ( Add in Certificates Table & LMS, ZOHO API call)
        const response = await learningService.generateCMECertificate(formData);

        // store cme certificate id for order in orders table benefits column
        if (response) {
          await orderServices.addBenefit(currentOrderID, 'cme_certificate', parseInt(response.certificate_id));
          await certificatesService.sendCMECertificateEmail({ courseID, cme_certificate_link: response.filePath})
          setOpenSuccessPopup(true);
        }
        const nonCMECertId = activeCertificateData['id'];

        // Update the Current Order & Make the Hash Value Null
        await orderServices.disableUrlService({ hash });

        setActiveCertificateData({
          ...response,
          id: response.certificate_id,
          nonCMECertId
        });
        fetchCMECertificates();
      }
    } catch (error) {
      openSnackbar(
        error.error || 'An error occurred while generating certificate. Please contact support.',
        'error'
      );
    } finally {
      // Enable the button after the process completes
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setOpenSuccessPopup(false);

    // REDIRECT TO COURSE LEARNING PAGE AFTER GENERATING CERTIFICATE
    window.location.href = `/learning/course/${courseID}`;
  };

  return (
    <Page title='Course Name to be updated'>
      <Box 
        sx={{
          height: { xs: 'auto', sm: 'calc(100vh - 135px)' },
          overflow: 'auto',
          px: 2
        }}
      >
        {courseID && hash ? (
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid size={12}>
              <Typography sx={{ py: 2, color: '#2872C1', fontSize: '32px', fontWeight: 600, textAlign: 'center' }}>
               {courseName} CME Credits Evaluation Form
              </Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 500, textAlign: 'center' }}>
                Complete this evaluation form to receive your CME certificate.
              </Typography>
            </Grid>
              <Grid size={{ xs: 12, sm: 8 }} style={{ padding: '24px' }}>
                <form autoComplete='off' id='cme-form' onSubmit={handleSubmit}>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel>
                      <b>1.</b> Credentials*
                    </FormLabel>
                    <Autocomplete
                      getOptionLabel={CREDENTIALS => CREDENTIALS.label}
                      id='designation_id'
                      options={CREDENTIALS}
                      name={'designation'}
                      onChange={(e, value) => handleProfession(value.value)}
                      renderInput={params => (
                        <TextField
                          required
                          fullWidth
                          label='Profession'
                          {...params}
                          name={'designation'}
                        />
                      )}
                    />
                    {showSpecialtyOptions && (
                      <Autocomplete
                        getOptionLabel={specialityOptions => specialityOptions.label}
                        id='designation_id'
                        options={specialityOptions}
                        name={'Speciality'}
                        onChange={(e, value) => setSpecialty(value.value)}
                        renderInput={params => (
                          <TextField
                            label='Speciality'
                            {...params}
                            required
                            fullWidth
                            name={'Speciality'}
                          />
                        )}
                      />
                    )}
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>2.</b> Overall Activity Rating*
                    </FormLabel>
                    <RadioGroup row
                      name='overall_activity_rating'
                      required
                      onChange={e =>
                        handleInputChange(e, 'overall_activity_rating')
                      }
                    >
                      <RatingOptions />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>3.</b> Please rate the overall projected impact of this activity on your knowledge, competence, performance, and patient outcomes*{' '}
                      <small style={{ color: '#5A5A5A' }}>
                        <em>
                          {
                            '(Competence is defined as the ability to apply knowledge, skills, and judgment in practice (knowing how to do something):'
                          }
                        </em>
                      </small>
                    </FormLabel>
                    <FormControl component='fieldset' fullWidth>
                      <FormControl component='fieldset' fullWidth>
                        <FormLabel component='legend'>
                          <b>3.1. </b>This activity increased my knowledge*
                        </FormLabel>
                        <RadioGroup row
                          name='knowledge_increased'
                          onChange={e =>
                            handleInputChange(e, 'knowledge_increased')
                          }
                        >
                          <DecisionOptions showNoChange={true} />
                          {surveyInputs['knowledge_increased'] ===
                            'Yes' && (
                            <div className={'describe-box'}>
                              <div>Please describe, how?</div>
                              <TextField
                                variant='standard'
                                name={'knowledge_increased_how'}
                                onChange={handleInputChange}
                              />
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormControl component='fieldset' fullWidth>
                        <FormLabel component='legend'>
                          <b>3.2. </b>This activity increased my competence*
                        </FormLabel>
                        <RadioGroup row
                          name='competence_increased'
                          onChange={e =>
                            handleInputChange(e, 'competence_increased')
                          }
                        >
                          <DecisionOptions showNoChange={true} />
                          {surveyInputs['competence_increased'] ===
                            'Yes' && (
                            <div className={'describe-box'}>
                              <div>Please describe, how?</div>
                              <TextField
                                variant='standard'
                                name={'competence_increased_how'}
                                onChange={handleInputChange}
                              />
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormControl component='fieldset' fullWidth>
                        <FormLabel component='legend'>
                          <b>3.3. </b>This activity will improve my practice performance*
                        </FormLabel>
                        <RadioGroup row
                            name='practice_performance_improved'
                            onChange={e => handleInputChange(e, 'practice_performance_improved')}
                          >
                          <DecisionOptions showNoChange={true} />
                          {surveyInputs['practice_performance_improved'] ===
                            'Yes' && (
                            <div className={'describe-box'}>
                              <div>Please describe, how?</div>
                              <TextField
                                variant='standard'
                                name={'practice_performance_improved_how'}
                                onChange={handleInputChange}
                              />
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormControl component='fieldset' fullWidth>
                        <FormLabel component='legend'>
                          <b>3.4.</b>This activity will improve my patient outcomes*
                        </FormLabel>
                        <RadioGroup row
                            name='improve_patient_outcome'
                            onChange={e => handleInputChange(e, 'improve_patient_outcome')}
                          >
                          <DecisionOptions showNoChange={true} />
                          {surveyInputs['improve_patient_outcome'] ===
                            'Yes' && (
                            <div className={'describe-box'}>
                              <div>Please describe, how?</div>
                              <TextField
                                variant='standard'
                                name={'improve_patient_outcome_how'}
                                onChange={handleInputChange}
                              />
                            </div>
                          )}
                        </RadioGroup>
                      </FormControl>
                    </FormControl>
                    <small style={{ color: '#5A5A5A', fontStyle: 'italic' }}>
                      *The Accreditation Council for CME (ACCME) and the
                      American Nurses Credentialing Center (ANCC) requires
                      us to analyze and report aggregate data on changes in
                      learners’ competence, performance, or patient
                      outcomes.
                    </small>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>4. </b>Please identify how you will change your practice as a result of attending this activity. (Select all that apply)*
                    </FormLabel>
                    <FormGroup>
                      {[
                        'This activity validated my current practice; no changes will be made',
                        'Create/revise protocols, policies, and/or procedures',
                        'Change the management and/or treatment of my patients',
                        'Other'
                      ].map(value => (
                        <FormControlLabel
                          key={value}
                          control={
                            <Checkbox
                              onChange={e => handleInputChange(e)}
                              name='identify_practice_change'
                              value={value}
                            />
                          }
                          label={value}
                        />
                      ))}
                      {surveyInputs['identify_practice_change'] &&
                        surveyInputs['identify_practice_change'].includes(
                          'Other'
                        ) && (
                          <div className={'describe-box'}>
                            <div>Please specify?</div>
                            <TextField
                              variant='standard'
                              name={'identify_practice_change_other'}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                    </FormGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>5.</b> If you plan to make changes may we contact
                      you for follow-up? (Optional)
                    </FormLabel>
                    <RadioGroup row
                      name='follow_up'
                      onChange={e => handleInputChange(e, 'follow_up')}
                    >
                      <DecisionOptions />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>6. </b>Please indicate any barriers you perceive in
                      implementing these changes. (Select all that apply)*
                    </FormLabel>
                    <FormGroup>
                      {[
                        'Cost',
                        'Lack of Experience',
                        'Lack of Opportunity',
                        'Lack of Resources (equipment)',
                        'Lack of Administrative Support Patients',
                        'Lack of time to Assess/Counsel',
                        'Reimbursement/Insurance Issues',
                        'Patient Compliance Issues',
                        'Lack of consensus / prof. guidelines',
                        'No Barriers',
                        'Other'
                      ].map(value => (
                        <FormControlLabel
                          key={value}
                          control={
                            <Checkbox
                              onChange={e => handleInputChange(e)}
                              name='barriers'
                              value={value}
                            />
                          }
                          label={value}
                        />
                      ))}
                      {surveyInputs['barriers'] &&
                        surveyInputs['barriers'].includes('Other') && (
                          <div className={'describe-box'}>
                            <div>Please specify?</div>
                            <TextField
                              variant='standard'
                              name={'barriers_other'}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                    </FormGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>7. </b>Will you attempt to address these barriers in order to implement changes in your competence, performance, and/or patients’ outcomes?*
                    </FormLabel>
                    <RadioGroup row
                      name='address_barriers'
                      onChange={e =>
                        handleInputChange(e, 'address_barriers')
                      }
                    >
                      <DecisionOptions showNA={true} />
                    </RadioGroup>
                    {surveyInputs['address_barriers'] === 'Yes' && (
                      <div className={'describe-box'}>
                        <div>How?</div>
                        <TextField
                          variant='standard'
                          name={'address_barriers_how'}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                    {surveyInputs['address_barriers'] === 'No' && (
                      <div className={'describe-box'}>
                        <div>Why not?</div>
                        <TextField
                          variant='standard'
                          name={'address_barriers_how'}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>8. </b>The activity content matched my current (or potential) scope of practice*
                    </FormLabel>
                    <RadioGroup row
                      name='matched_current_practice'
                      onChange={e =>
                        handleInputChange(e, 'matched_current_practice')
                      }
                    >
                      <DecisionOptions />
                      {surveyInputs['matched_current_practice'] ===
                        'No' && (
                        <div className={'describe-box'}>
                          <div>Please explain?</div>
                          <TextField
                            variant='standard'
                            name={'matched_current_practice_how'}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>9. </b>How might the format of this activity be improved? (Please select all that apply)*
                    </FormLabel>
                    <FormGroup>
                      {[
                        'Format was appropriate; no changes needed',
                        'Add a hands-on Instructional Component',
                        'Include more case-based presentations',
                        'Opportunity for Q&A',
                        'Interactivity with attendees',
                        'Add breakouts for subtopics',
                        'Other'
                      ].map(value => (
                        <FormControlLabel
                          key={value}
                          control={
                            <Checkbox
                              onChange={e => handleInputChange(e)}
                              name='format_improvement'
                              value={value}
                            />
                          }
                          label={value}
                        />
                      ))}
                      {surveyInputs['format_improvement'] &&
                        surveyInputs['format_improvement'].includes(
                          'Other'
                        ) && (
                          <div className={'describe-box'}>
                            <div>Please describe?</div>
                            <TextField
                              variant='standard'
                              name={'format_improvement_other'}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                    </FormGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>10. </b>Overall, were the presentations balanced,
                      objective, scientifically rigorous, and without
                      commercial bias?*
                    </FormLabel>
                    <RadioGroup row
                      name='presentations_balanced'
                      onChange={e =>
                        handleInputChange(e, 'presentations_balanced')
                      }
                    >
                      <DecisionOptions />
                      {surveyInputs['presentations_balanced'] === 'No' && (
                        <div className={'describe-box'}>
                          <div>Please explain?</div>
                          <TextField
                            variant='standard'
                            name={'presentations_balanced_how'}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>11.</b> Please rate the course Content Quality*
                    </FormLabel>
                    <RadioGroup row
                      name='content_quality'
                      onChange={e =>
                        handleInputChange(e, 'content_quality')
                      }
                    >
                      <RatingOptions />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel component='legend'>
                      <b>12.</b> Please rate the Course Presentation*
                    </FormLabel>
                    <RadioGroup row
                      name='course_presentation'
                      onChange={e =>
                        handleInputChange(e, 'course_presentation')
                      }
                    >
                      <RatingOptions />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel>
                      <b>13.</b> Additional comment / specific suggestion to
                      improve this activity:
                    </FormLabel>
                    <TextField
                      variant='outlined'
                      inputProps={{
                        rows: 5
                      }}
                      multiline
                      name={'additional_comments'}
                      onChange={handleInputChange}
                      placeholder={'Type your response here'}
                    />
                  </FormControl>
                  <FormControl component='fieldset' fullWidth>
                    <FormLabel>
                      <b>14.</b> Please list other topics you would like to
                      see addressed in future CME/CE activities:
                    </FormLabel>
                    <TextField
                      variant='outlined'
                      inputProps={{
                        rows: 5
                      }}
                      multiline
                      name={'list_other_topics'}
                      onChange={handleInputChange}
                      placeholder={'Type your response here'}
                    />
                  </FormControl>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Button
                      size='large'
                      type='submit'
                      variant='contained'
                      disabled={isSubmitting}
                      align='center'
                      endIcon={<DownloadIcon />}
                    >
                      Submit & Get Certificate
                    </Button>
                  </Box>
                </form>
              </Grid>
          </Grid>
        ) : (
          <AccessDeniedScreen text="Something went wrong. Please contact support" />
        )}
      </Box>
      <FormSubmitBackdrop open={isSubmitting && !openSuccessPopup} />
      <FormSubmissionPopup open={openSuccessPopup} handleClose={handleCloseSuccessPopup} />
    </Page>
  );
}

export default RegularCourseForm;
