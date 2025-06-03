import React, { useState, useContext } from 'react';
import { Autocomplete, TextField, Button, Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Typography, Grid, RadioGroup } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Page from '../../../components/Page';
import learningService from '../../../services/learningService';
import orderServices from '../../../services/orderServices';
import certificatesService from '../../../services/certificatesService';
import { useOpenSnackbar } from '../../../hooks/useOpenSnackbar';
import { CertificatesContext } from '../../../context/CertificatesContext';
import MOCForm from '../components/MOCForm';
import FormSubmitBackdrop from '../components/FormSubmitBackdrop';
import { CREDENTIALS, NURSE_OPTIONS, PHYSICIAN_OPTIONS } from '../data';
import { DecisionOptions, RatingOptions } from '../components/Options';
import { AccessDeniedScreen } from '../../CourseLearning/components';
import { CertificateVariants } from '../../../appConstants';

// SURVEY FORM VALID FOR OPIOID & NIHSS COURSE
const OpioidSurveyForm = (props) => {
  const { courseID, hash, currentOrderID } = props;
  const { setActiveCertificateData, activeCertificateData, fetchCMECertificates } = useContext(CertificatesContext);
  const openSnackbar = useOpenSnackbar();
  const [surveyInputs, setSurveyInputs] = useState({ courseID: courseID });
  const [showMOCForm, setShowMOCForm] = useState(false);
  const [profession, setProfession] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialityOptions, setSpecialityOptions] = useState([]);
  const [showSpecialtyOptions, setShowSpecialtyOptions] = useState(false);
  const [dataForm, setDataForm] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      const response = await learningService.generateCMECertificate(formData);

      // store cme certificate id for order in orders table
      if (response) {
        await orderServices.addBenefit(currentOrderID,'cme_certificate',parseInt(response.certificate_id));
        await certificatesService.sendCMECertificateEmail({ courseID, cme_certificate_link: response.filePath })
      }

      fetchCMECertificates();

      // Set form response data and update form status
      setDataForm(response);
      setShowMOCForm(true);

      await orderServices.disableUrlService({ hash });
    } catch (error) {
      openSnackbar(
        error.error || 'An error occurred while generating certificate. Please contact support.',
        'error'
      );
    } finally {
      // Re-enable the button after the process completes
      setIsSubmitting(false);
    }
  };

  if (showMOCForm) {
    return (
      <MOCForm
        courseID={courseID}
        dataForm={dataForm}
        setActiveCertificateData={setActiveCertificateData}
        activeCertificateData={activeCertificateData}
      />
    );
  } else {
    return (
      <Page title='Course Name to be updated'>
        <Box 
          sx={{
            height: { xs: 'auto', sm: 'calc(100vh - 58px)' },
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
                <Grid size={{ xs: 12, md: 8 }} style={{ padding: '24px' }}>
                  <form
                    autoComplete='off'
                    id={'cme-form'}
                    onSubmit={handleSubmit}
                  >
                    <FormControl component='fieldset' fullWidth>
                      <FormLabel>
                        <b>1.</b> Credentials*
                      </FormLabel>
                      <Autocomplete
                        getOptionLabel={CREDENTIALS => CREDENTIALS.label}
                        id='designation_id'
                        options={CREDENTIALS}
                        name='designation'
                        onChange={(e, value) => handleProfession(value.value)}
                        renderInput={params => {
                          return (
                            <TextField
                              required
                              label='Profession'
                              {...params}
                              name='designation'
                            />
                          );
                        }}
                      />
                      {showSpecialtyOptions ? (
                        <Autocomplete
                          getOptionLabel={specialityOptions =>
                            specialityOptions.label
                          }
                          id='designation_id'
                          options={specialityOptions}
                          name='Speciality'
                          onChange={(e, value) => setSpecialty(value.value)}
                          renderInput={params => {
                            return (
                              <TextField
                                label='Speciality'
                                {...params}
                                required
                                name='Speciality'
                              />
                            );
                          }}
                        />
                      ) : null}
                    </FormControl>
                    
                    <FormControl component='fieldset' fullWidth>
                      <FormLabel>
                        <b>2.</b>AANA ID # (If you are seeking AANA Class A credit, this is required.):
                      </FormLabel>
                      <TextField
                        fullWidth
                        inputProps={{
                          rows: 1
                        }}
                        multiline
                        name={'aana_id'}
                        onChange={handleInputChange}
                        placeholder={'Type your response here'}
                      />
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>3.</b> Please rate the following:
                      </FormLabel>
                      <FormControl component='fieldset' fullWidth>
                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>3.1. </b>Overall activity rating*
                          </FormLabel>
                          <FormLabel component='legend'></FormLabel>
                          <RadioGroup row
                            name='overall_activity_rating'
                            required
                            onChange={e => handleInputChange(e, 'overall_activity_rating')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>
                      </FormControl>

                      <FormControl component='fieldset' fullWidth>
                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>3.2 </b>Ease of activity navigation*
                          </FormLabel>
                          <FormLabel component='legend'></FormLabel>
                          <RadioGroup row
                            name='Ease_of_activity_navigation'
                            required
                            onChange={e => handleInputChange(e, 'Ease_of_activity_navigation')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>
                      </FormControl>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>4.</b> Please rate your ability to achieve the following objectives:
                      </FormLabel>
                      <FormControl component='fieldset' fullWidth>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.1. </b>Describe the pathophysiology of pain as it relates to the concepts of pain management*
                          </FormLabel>
                          <RadioGroup row
                            name='Describe_the_pathophysiology_of_pain_as_it_relates_to_the_concepts_of_pain_management'
                            required
                            onChange={e => handleInputChange(e, 'Describe_the_pathophysiology_of_pain_as_it_relates_to_the_concepts_of_pain_management')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.2. </b>Accurately assess patients in pain*
                          </FormLabel>
                          <RadioGroup row
                            name='Accurately_assess_patients_in_pain'
                            required
                            onChange={e => handleInputChange(e, 'Accurately_assess_patients_in_pain')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.3. </b>Develop a safe and effective pain treatment plan*
                          </FormLabel>
                          <RadioGroup row
                            name='Develop_a_safe_and_effective_pain_treatment_plan'
                            required
                            onChange={e => handleInputChange(e, 'Develop_a_safe_and_effective_pain_treatment_plan')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.4. </b>Identify evidence-based non-opioid and
                            multimodal options for the treatment of pain,
                            including nonpharmacologic modalities, such as
                            implantable device alternatives*
                          </FormLabel>
                          <RadioGroup row
                            name='Identify_evidence_based_non_opioid_and_multimodal_options_for_the_treatment_of_pain'
                            required
                            onChange={e => handleInputChange(e, 'Identify_evidence_based_non_opioid_and_multimodal_options_for_the_treatment_of_pain')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.5. </b>Identify the risks and benefits of opioid therapy, including neonatal abstinence syndrome (NAS)*
                          </FormLabel>
                          <RadioGroup row
                            name='Identify_the_risks_and_benefits_of_opioid_therapy'
                            required
                            onChange={e => handleInputChange(e, 'Identify_the_risks_and_benefits_of_opioid_therapy')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.6. </b>Manage ongoing opioid therapy including overdose education for patients/caregivers*
                          </FormLabel>
                          <RadioGroup row
                            name='Manage_ongoing_opioid_therapy_including_overdose_education_for_patients_caregivers'
                            required
                            onChange={e => handleInputChange(e, 'Manage_ongoing_opioid_therapy_including_overdose_education_for_patients_caregivers')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.7. </b>Recognize behaviors that may be
                            associated with opioid / controlled substance use
                            disorder, including the screening, brief
                            intervention, and referral to treatment (SBIRT)
                            approach to substance use disorder*
                          </FormLabel>
                          <RadioGroup row
                            name='Recognize_behaviors_that_may_be_associated_with_opioid'
                            required
                            onChange={e => handleInputChange(e, 'Recognize_behaviors_that_may_be_associated_with_opioid')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.8. </b>Discuss cannabis use for pain management*
                          </FormLabel>
                          <RadioGroup row
                            name='Discuss_cannabis_use'
                            required
                            onChange={e => handleInputChange(e, 'Discuss_cannabis_use')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.9. </b>Coordinate palliative and end-of-life care*
                          </FormLabel>
                          <RadioGroup row
                            name='Coordinate_palliative_and_end_of_life_care'
                            required
                            onChange={e => handleInputChange(e, 'Coordinate_palliative_and_end_of_life_care')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>4.10. </b>Identify controlled substance
                            prescribing/monitoring requirements for specific
                            state(s) in which you practice, including Florida
                            midlevel clinician controlled substance prescribing
                            requirements and New York state and Federal
                            requirements for prescribing controlled substances*
                          </FormLabel>
                          <RadioGroup row
                            name='Identify_controlled_substance_prescribing_monitoring_requirements_for'
                            required
                            onChange={e => handleInputChange(e, 'Identify_controlled_substance_prescribing_monitoring_requirements_for')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>
                      </FormControl>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>5. </b>Please identify the impact of completing this activity on your practice (select all that apply):*
                      </FormLabel>
                      <FormGroup>
                        {[
                          'I	will	change	the	management	and/or	treatment	of	my	patients.',
                          'I will change the way I interact with other members of the healthcare team to provide better patient care.',
                          'I	will	create/revise	protocols,	policies,	and/or	procedures.',
                          'This	activity	validated	my	current	practice;	no	changes	will	be	made.',
                          'Other'
                        ].map(field => (
                          <FormControlLabel
                            key={field}
                            control={
                              <Checkbox
                                onChange={e => handleInputChange(e)}
                                name='identify_practice_change'
                                color='primary'
                                value={field}
                              />
                            }
                            label={field}
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
                        <b>6.</b> Please rate the overall projected impact of
                        this activity on your knowledge, competence,
                        performance, and patient outcomes*{' '}
                        <small style={{ color: '#5A5A5A' }}>
                          <em>
                            (Note: Competence is defined as the ability to apply
                            knowledge, skills, and judgment in practice (knowing
                            how to do something)):
                          </em>
                        </small>
                      </FormLabel>
                      <FormControl component='fieldset' fullWidth>
                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>6.1. </b>This activity increased my knowledge*
                          </FormLabel>
                          <RadioGroup row
                            name='knowledge_increased'
                            required
                            onChange={e => handleInputChange(e, 'knowledge_increased')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>6.2. </b>This activity increased my competence*
                          </FormLabel>
                          <RadioGroup row
                            name='competence_increased'
                            required
                            onChange={e => handleInputChange(e, 'competence_increased')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>6.3. </b>This activity will improve my practice*
                          </FormLabel>
                          <RadioGroup row
                            name='practice_performance_improved'
                            required
                            onChange={e => handleInputChange(e, 'practice_performance_improved')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>

                        <FormControl component='fieldset' fullWidth>
                          <FormLabel component='legend'>
                            <b>6.4.</b>This activity will improve my patient outcomes*
                          </FormLabel>
                          <RadioGroup row
                            name='improve_patient_outcome'
                            required
                            onChange={e => handleInputChange(e, 'improve_patient_outcome')}
                          >
                            <RatingOptions />
                          </RadioGroup>
                        </FormControl>
                      </FormControl>
                      <small style={{ color: '#5A5A5A', fontStyle: 'italic' }}>
                        *The Accreditation Council for CME (ACCME) and the
                        American Nurses Credentialing Center (ANCC) requires us
                        to analyze and report aggregate data on changes in
                        learners’ competence, performance, or patient outcomes.
                      </small>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel>
                        <b>7.</b> State one item you learned that will improve your practice:
                      </FormLabel>
                      <TextField
                        fullWidth
                        inputProps={{
                          rows: 3
                        }}
                        multiline
                        name={
                          'State_one_item_you_learned_that_will_improve_your_practice'
                        }
                        onChange={handleInputChange}
                        placeholder={'Type your response here'}
                      />
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel>
                        <b>8.</b> If you plan to make changes and would like to be contacted for follow-up, please provide your contact email address:
                      </FormLabel>
                      <TextField
                        fullWidth
                        label='Email'
                        id='fullWidth'
                        name={'follow_up_email'}
                        onChange={handleInputChange}
                      />
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>9. </b>Please indicate any barriers you perceive in implementing these changes. (Select all that apply)*
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
                        ].map(field => (
                          <FormControlLabel
                            key={field}
                            control={
                              <Checkbox
                                onChange={e => handleInputChange(e)}
                                name='barriers'
                                color='primary'
                                value={field}
                              />
                            }
                            label={field}
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
                        <b>10. </b>Will you attempt to address these barriers in order to implement changes in your competence, performance, and/or patients’ outcomes?*
                      </FormLabel>
                      <RadioGroup row
                        name='address_barriers'
                        onChange={e => handleInputChange(e, 'address_barriers')}
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
                            name={'address_barrier_how'}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>11. </b> Was there an opportunity to explore practice-relevant issues and learn from, with, and about other members of the healthcare team?
                      </FormLabel>
                      <RadioGroup row
                        name='matche_current_practice'
                        onChange={e => handleInputChange(e, 'matche_current_practice')}
                      >
                        <DecisionOptions />
                        {surveyInputs['matche_current_practice'] === 'No' && (
                          <div className={'describe-box'}>
                            <div>Please explain?</div>
                            <TextField
                              variant='standard'
                              name={'matche_current_practice_how'}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </RadioGroup>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>12. </b>How might the format of this activity be improved? (Please select all that apply)
                      </FormLabel>
                      <FormGroup>
                        {[
                          'Provide	more	resources/tools',
                          'Include	more	visual	content	(demonstrations,	etc.)',
                          'Include	more	games/skills	testing',
                          'Include	more	case-based	presentations ',
                          'Format	was	appropriate;	no	changes	needed',
                          'Other'
                        ].map(field => (
                          <FormControlLabel
                            key={field}
                            control={
                              <Checkbox
                                onChange={e => handleInputChange(e)}
                                name='format_improvement'
                                color='primary'
                                value={field}
                              />
                            }
                            label={field}
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
                        <b>13. </b> Was the activity balanced, objective, scientifically rigorous, and without commercial bias?
                      </FormLabel>
                      <RadioGroup row
                        name='presentations_balanced'
                        onChange={e => handleInputChange(e, 'presentations_balanced')}
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
                      <FormLabel>
                        <b>14.</b> Additional comment / specific suggestion to improve this activity:
                      </FormLabel>
                      <TextField
                        fullWidth
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
                        <b>15.</b> Please list other topics you would like to see addressed in future CME/CE activities:
                      </FormLabel>
                      <TextField
                        fullWidth
                        inputProps={{
                          rows: 5
                        }}
                        multiline
                        name={'list_other_topics'}
                        onChange={handleInputChange}
                        placeholder={'Type your response here'}
                      />
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>16. </b>Did the activity content match your current (or potential) scope of practice as a member of the healthcare team?
                      </FormLabel>
                      <RadioGroup row
                        name='matched_current_practice'
                        onChange={e => handleInputChange(e, 'matched_current_practice')}
                      >
                        <DecisionOptions showNA={true} />
                        {surveyInputs['matched_current_practice'] === 'N/A – barriers not perceived' && (
                          <div className={'describe-box'}>
                            <div>Why not?</div>
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
                        <b>17. </b>After completing this activity, I have a better understanding of the various roles and responsibilities of others on my team.
                      </FormLabel>
                      <RadioGroup row
                        name='various_roles_and_responsibilities'
                        onChange={e => handleInputChange(e, 'various_roles_and_responsibilities')}
                      >
                        <DecisionOptions showNA={true} />
                        {surveyInputs['various_roles_and_responsibilities'] === 'N/A – barriers not perceived' && (
                          <div className={'describe-box'}>
                            <div>Why not?</div>
                            <TextField
                              variant='standard'
                              name={'various_roles_and_responsibilities_how'}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </RadioGroup>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>18. </b>The information presented in this activity will improve my skills or strategy in my role as a member of the healthcare team.
                      </FormLabel>
                      <RadioGroup row
                        name='will_improve_my_skills_or_strategy'
                        onChange={e => handleInputChange(e, 'will_improve_my_skills_or_strategy')}
                      >
                        <DecisionOptions showNA={true} />
                        {surveyInputs['will_improve_my_skills_or_strategy'] === 'N/A – barriers not perceived' && (
                          <div className={'describe-box'}>
                            <div>Why not?</div>
                            <TextField
                              variant='standard'
                              name={'will_improve_my_skills_or_strategy_how'}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </RadioGroup>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>19. </b>The information presented in this activity will change the way I interact with my team.
                      </FormLabel>
                      <RadioGroup row
                        name='change_the_way_I_interact_with_my_team'
                        onChange={e => handleInputChange(e, 'change_the_way_I_interact_with_my_team')}
                      >
                        <DecisionOptions showNA={true} />
                        {surveyInputs['change_the_way_I_interact_with_my_team'] === 'N/A – barriers not perceived' && (
                          <div className={'describe-box'}>
                            <div>Why not?</div>
                            <TextField
                              variant='standard'
                              name={
                                'change_the_way_I_interact_with_my_team_how'
                              }
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </RadioGroup>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>20. </b>The information presented in this activity will help me to better engage and support other members of the healthcare team in the care of patients.
                      </FormLabel>
                      <RadioGroup row
                        name='better_engage_and_support_other_members_of_the_healthcare_team'
                        onChange={e =>
                          handleInputChange(
                            e,
                            'better_engage_and_support_other_members_of_the_healthcare_team'
                          )
                        }
                      >
                        <DecisionOptions showNA={true} />
                        {surveyInputs['better_engage_and_support_other_members_of_the_healthcare_team'] === 'N/A – barriers not perceived' && (
                          <div className={'describe-box'}>
                            <div>Why not?</div>
                            <TextField
                              variant='standard'
                              name='better_engage_and_support_other_members_of_the_healthcare_team_how'
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </RadioGroup>
                    </FormControl>

                    <FormControl component='fieldset' fullWidth>
                      <FormLabel component='legend'>
                        <b>21. </b>My participation in this activity will positively impact the performance of my healthcare team.
                      </FormLabel>
                      <RadioGroup row
                        name='impact_the_performance_of_my_healthcare_team'
                        onChange={e => handleInputChange(e, 'impact_the_performance_of_my_healthcare_team')}
                      >
                        <DecisionOptions showNA={true} />
                        {surveyInputs['impact_the_performance_of_my_healthcare_team'] === 'N/A – barriers not perceived' && (
                          <div className={'describe-box'}>
                            <div>Why not?</div>
                            <TextField
                              variant='standard'
                              name='impact_the_performance_of_my_healthcare_team_how'
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </RadioGroup>
                    </FormControl>

                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
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
        <FormSubmitBackdrop open={isSubmitting} />
      </Page>
    );
  }
};

export default OpioidSurveyForm;
