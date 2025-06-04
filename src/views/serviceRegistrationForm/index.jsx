

import React, { useEffect, useState } from 'react';
import "./style.css"
// import DateFnsUtils from '@date-io/moment';
import { Box, InputLabel, MenuItem, TextField, Typography, IconButton, FormControl, Select, FormControlLabel, FormLabel, RadioGroup, Radio, TextareaAutosize, Checkbox, Button, ThemeProvider, Divider, Tooltip } from '@mui/material';
import { useOpenSnackbar } from 'src/hooks/useOpenSnackbar';

import { countryList } from 'src/appConstants';
import { DatePicker, LocalizationProvider, DesktopDatePicker} from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import serviceFormRegistration from 'src/services/serviceFormRegistration';
import serviceFormRegistrationInstance from 'src/services/serviceFormRegistration';
import CryptoJS from 'crypto-js';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useSelector } from 'react-redux'; 
import InfoIcon from '@mui/icons-material/Info';


const steps = ['Personal Information', 'Professional Information', 'Documents', 'Terms & Conditions'];

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const HelperTextWithTooltip = () => {
    const [open, setOpen] = useState(false);
  
    const handleTooltipToggle = (event) => {
      event.stopPropagation(); // Prevent the tooltip from closing immediately
      setOpen((prev) => !prev);
    };
  
    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '3px' }}>
        <span>Need to Change?</span>
        <Tooltip
          arrow
          title="Please contact support to change email. support@medtigo.com"
          open={open}
          onClose={handleTooltipClose}
          onOpen={() => setOpen(true)} // Open tooltip handler
        >
          <IconButton onClick={handleTooltipToggle} style={{ padding: 0 }}>
            <InfoIcon fontSize='small'/>
          </IconButton>
        </Tooltip>
      </div>
    );
  };

const ServiceRegistationForm = ({onFormSubmit}) => {

    const state = useSelector((state) => state.account);

    const [activeStep, setActiveStep] = React.useState(0);
    const [scrolledTroughBottom, setScrollThroughBottom] = React.useState(false)

    const [isTCAccepted, setIsTCAccepted] = useState(false)
    const openSnackbar = useOpenSnackbar();
    const [isFormValid, setIsFormValid] = useState(true)
    const [scrollPosition, setScrollPosition] = useState(0);
    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        gender: "",
        email: state.user.email,
        phoneNumber: "",
        securityNumber: "",
        dateOfBirth: '',
        isUSCitizen: true,
        birthPlace: "",
        profession: "",
        StatesRequestingLicensure: "",
        currentLicenseStates: "",
        disclosureQuestions: [
            {
                question: "Have any disciplinary actions been threatened, initiated or are pending against you by a state licensure board?",
                answer: ""
            },
            {
                question: "Has your license to practice in any state ever been denied, limited, suspended or revoked, diminished, not renewed, relinquished or are any proceedings currently pending which may result in any such action?",
                answer: ""
            },
            {
                question: "Has your professional employment ever been suspended, diminished, revoked or terminated at any hospital or healthcare facility or are any proceedings that may result in any such action currently pending?",
                answer: ""
            },
            {
                question: "Have there been any suits or claims against you alleging malpractice, negligence, failure to diagnose, etc. which have been pending, opened, or closed?",
                answer: ""
            },
        ],
    })

    const [formDataError, setFormDataError] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        addressLine1: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        gender: "",
        email: "",
        phoneNumber: "",
        securityNumber: "",
        dateOfBirth: "",
        birthPlace: "",
        profession: "",
        StatesRequestingLicensure: "",
        disclosureQuestions: [
            "", "", "", ""
        ],
    })

    const isStepOptional = (step) => {
        return step === 1;
    };

    const handleNext = () => {
    // let newSkipped = skipped;
    // if (isStepSkipped(activeStep)) {
    //   newSkipped = new Set(newSkipped.values());
    //   newSkipped.delete(activeStep);
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // setSkipped(newSkipped);
  };

   const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

   const handleReset = () => {
    setActiveStep(0);
  };

  const validateFields = () => {
    for (const key in formData){
        switch(key){
            case "currentLicenseStates" : 
            case "nameChangeDocument" :
            case "addressLine2":
                break;
            case "disclosureQuestions":
               for(let i = 0; i < formData.disclosureQuestions.length; i++){
                const data = formData.disclosureQuestions[i]
                if (data.answer === ""){
                    const updatedErrorDisclosureQuestions = formDataError.disclosureQuestions.map((data,index) => {
                        if(index === i){
                            return "This field cannot be empty"
                        }
                        return data
                    })
                    setFormDataError({...formDataError, disclosureQuestions: updatedErrorDisclosureQuestions})
                    formDataError.disclosureQuestions[i] = 
                    setIsFormValid(false)
                    return false
                    }
                }
                break;
            default:
                if(formData[key] === ""){
                    setFormDataError({...formDataError, [key]: "This field cannot be empty"})
                    setIsFormValid(false)
                    return false     
                } 
        }
    }
    setIsFormValid(true)
    return true
  }

    const handleSubmitForm = async () => {
        try {
            const moveForward = validateFields()
            if (!moveForward){
                return
            }
            const formDataFormat = new FormData()

            for (const key in formData) {
                switch (key) {
                    case "CVAttachmentFile":
                    case "governmentIssuedID":
                    case "schoolDiploma":
                    case "headshotPhoto":
                    case "nameChangeDocument":
                        if (formData[key] !== "") {
                            const myNewFile = new File([formData[key]], key + "." +formData[key].name.split(".").pop(), { type: formData[key].type });
                            formDataFormat.append('file', myNewFile); break;
                        }break;
                    case "securityNumber":
                    case "phoneNumber":
                    case "dateOfBirth":
                        formDataFormat.append(key, CryptoJS.AES.encrypt(formData[key], ENCRYPTION_KEY).toString()); break
                    default:
                        formDataFormat.append(key, key === "disclosureQuestions" ? JSON.stringify(formData[key]) : formData[key])
                }
            }
            await serviceFormRegistrationInstance.addForm(formDataFormat)
            // dispatch({
            //     type: isFormModalOpen,
            //     payload: false
            // })
            onFormSubmit()

        }
        catch (err) {
            console.log(err);

            openSnackbar('Something went wrong', 'error');

        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll.bind(this));
    }, [])

    const handleScroll = (event) => {
        const height = Math.ceil(window.scrollY)
        if (height > 1110){
            setActiveStep(3)
        }
        else if(height > 950){
            setActiveStep(2)
        }
        else if(height > 470){
            setActiveStep(1)
        }else{
            setActiveStep(0)
        }
    }
    return <div 
    className='form-page'
    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", fontFamily: "Poppins"}}>
        <div>
            <img src='/images/logo.png' height="100px" width="250px" style={{
                height: '100px',
                width: '250px',
                paddingLeft: '20px',
                paddingBottom: '2px',
                paddingTop: '2px'
            }}></img>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {/* <div className='fadeshow1' style={{alignSelf: "start", position: "fixed", padding: "0 20px"}}>
            <Typography style={{fontWeight: "500", fontSize: "16px", alignSelf: "start", marginTop: "-45px", marginBottom: "20px", }} className='poppinsFont'>License Service Registration</Typography>
            <div style={{borderStyle: "solid", borderWidth: "1px", borderColor: "#D7D7D7", padding: "20px 20px", borderRadius: "4px"}}>
        <Stepper activeStep={activeStep} orientation='vertical' style={{}}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
        //   if (isStepOptional(index)) {
        //     labelProps.optional = (
        //       <Typography variant="caption">Optional</Typography>
        //     );
        //   }
        //   if (isStepSkipped(index)) {
        //     stepProps.completed = false;
        //   }
          return (
            <Step key={label} className='poppinsFont' {...stepProps} style={{fontFamily: "Poppins", display: "flex"}}
            sx={{
                '& .Mui-active .Mui-completed': {
                fontFamily: "Poppins"
          },
          '& .MuiStepLabel-root .Mui-completed': {
            color: '#2872C1', // circle color (COMPLETED)
          },
          '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
            {
              color: 'grey.500', // Just text label (COMPLETED)
            },
          '& .MuiStepLabel-root .Mui-active': {
            color: '#E9F4FF', // circle color (ACTIVE)
            borderStyle: "solid",
            borderColor: "#2872C1",
            borderRadius: "100%",
            paddingRight: "0px",
            borderWidth: "2px"

          },
          '& .MuiStepLabel-label.Mui-active':
            {
              color: '#2872C1', // Just text label (ACTIVE)
              fontWeight: "600",
              border: "none !important"
            },
          '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
            fill: '#2872C1', // circle's number (ACTIVE)
            fontWeight: "800",
            // fontSize: "20px"
          },
        }}
            >
              <StepLabel className='poppinsFont' style={{fontFamily: "'Poppins'"}} {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper></div></div> */}
        <div style={{ borderStyle: "solid", borderWidth: "1px", borderColor: "#D7D7D7", display: "flex", flexDirection: "column", alignItems: "start", gap: "20px", padding: "10px 20px", flexBasis: "1", flexGrow: "1", borderRadius: "4px", fontSize: "12px", marginBottom: "20px",paddingBottom: "20px", overflowY: "scroll", height: "500px"}}>
            {/* {activeStep === 0 &&  */}
            <div className='personal' style={{display: "flex", flexDirection: "column", gap: "10px", width: "100%"}}>

                <Typography style={{fontWeight: "500", fontSize: "17px"}}>Personal Information</Typography>
            <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "10px", flex: "1", minWidth: "150px"}}> 
            <div style={{ display: "flex", gap: "5px", flexDirection: "column"}}>
                <Typography>Name*</Typography>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <TextField
                        placeholder="First"
                        variant="outlined"
                        value={formData.first_name}
                        error={formDataError.first_name !== ""}
                        helperText={formDataError.first_name}
                        onChange={(e) => { 
                            setFormData({ ...formData, first_name: e.target.value }) 
                            if(e.target.value !== ""){
                                setFormDataError({...formDataError, first_name: ""})
                            }
                        }}
                        size='small'
                        style={{flexGrow: "1"}}
                    />
                    <TextField
                        placeholder="Middle"
                        variant="outlined"
                        value={formData.middle_name}
                        error={formDataError.middle_name !== ""}
                        helperText={formDataError.middle_name}
                        onChange={(e) => {
                            setFormData({ ...formData, middle_name: e.target.value }) 
                            if(e.target.value !== ""){
                                setFormDataError({...formDataError, middle_name: ""})
                            }
                        }}
                        size='small'
                        style={{flexGrow: "1"}}
                    />
                    <TextField
                        placeholder="Last"
                        variant="outlined"
                        value={formData.last_name}
                        error={formDataError.last_name !== ""}
                        helperText={formDataError.last_name}
                        onChange={(e) => { 
                            setFormData({ ...formData, last_name: e.target.value })
                            if(e.target.value !== ""){
                                setFormDataError({...formDataError, last_name: ""})
                            }
                         }}
                        size='small'
                        style={{flexGrow: "1"}}
                    />
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <Typography>Email Address*</Typography>
                <TextField
                    variant="outlined"
                    disabled={true}
                    style={{ flexGrow: "1" }}
                    value={formData.email}
                    error={formDataError.email !== ""}
                    onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if(e.target.value !== ""){
                            setFormDataError({...formDataError, email: ""})
                        }
                    }}
                    size='small'
                />
                <HelperTextWithTooltip />
            </div>
            <div style={{display: "flex", gap: "10px", flexWrap: "wrap"}}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px"}}>
                <Typography>Phone Number*</Typography>
                <div style={{ display: "flex", gap: "10px" }}>
                    <TextField
                        // label="###"
                        variant="outlined"
                        style={{ flexGrow: "1" }}
                        value={formData.phoneNumber}
                        error={formDataError.phoneNumber !== ""}
                        helperText={formDataError.phoneNumber}
                        onChange={(e) => {
                                setFormData({ ...formData, phoneNumber: e.target.value })
                        if(e.target.value !== ""){
                            setFormDataError({...formDataError, phoneNumber: ""})
                        }
                            }}
                        size='small'
                    />
                    {/* <TextField
                        label="###"
                        variant="outlined"
                        style={{ flexGrow: "1" }}
                        value={formData.phoneNumber2}
                        onChange={(e) => setFormData({ ...formData, phoneNumber2: e.target.value })}
                        size='small'
                    />
                    <TextField
                        label="####"
                        variant="outlined"
                        style={{ flexGrow: "1" }}
                        value={formData.phoneNumber3}
                        onChange={(e) => setFormData({ ...formData, phoneNumber3: e.target.value })}
                        size='small'
                    /> */}
                </div>
            </div>
            {/* <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}> */}
                {/* <Typography>Gender*</Typography> */}
                <Box
                        style={{ flexGrow: "1", alignSelf: "end", display: "flex", flexDirection: "column", gap: "5px"}}
                    >
                <Typography>Gender*</Typography>
                        <FormControl fullWidth size='small'>
                            {/* <InputLabel id="demo-simple-select-label">Gender</InputLabel> */}
                            <Select
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData.gender}
                                error={formDataError.gender !== ""}
                                helperText={formDataError.gender}
                                // label="Gender"
                                onChange={(e) => { 
                                    setFormData({ ...formData, gender: e.target.value })
                                    if(e.target.value !== ""){
                                        setFormDataError({...formDataError, gender: ""})
                                    }
                                 }}
                                size='small'
                            >
                                {["Male", "Female", "Other"].map(gender => {
                                    return <MenuItem key={gender} value={gender.toLowerCase()}>{gender}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                {/* <TextField
                    variant="outlined"
                    style={{ flexGrow: "1" }}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    size='small'
                /> */}
            {/* </div> */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flexGrow: "1" }}>
                <Typography>Social Security Number*</Typography>
                <TextField
                    variant="outlined"
                    type='number'
                    style={{ flexGrow: "1" }}
                    error={formDataError.securityNumber !== ""}
                    helperText={formDataError.securityNumber}
                    value={formData.securityNumber}
                    onChange={(e) => {
                        setFormData({ ...formData, securityNumber: e.target.value })
                        if(e.target.value !== ""){
                            setFormDataError({...formDataError, securityNumber: ""})
                        }
                    }}
                    size='small'
                />
            </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Are you a U.S Citizen</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={formData.isUSCitizen}
                        name="radio-buttons-group"
                        onChange={(e) => setFormData({ ...formData, isUSCitizen: e.target.value })}
                        style={{display: "flex", flexDirection: "row"}}
                    >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "10px", flex: "1"}}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignSelf: "stretch", flexWrap: "wrap" }}>

                <Typography>Address*</Typography>
                <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <TextField
                    placeholder='Address Line 1'
                    variant="outlined"
                    style={{ flexGrow: "1" }}
                    value={formData.addressLine1}
                    error={formDataError.addressLine1 !== ""}
                    helperText={formDataError.addressLine1}
                    onChange={(e) => {
                        setFormData({ ...formData, addressLine1: e.target.value })
                        if(e.target.value !== ""){
                            setFormDataError({...formDataError, addressLine1: ""})
                        }
                    }}
                    size='small'
                />
                <TextField
                    placeholder="Address Line 2"
                    variant="outlined"
                    value={formData.addressLine2}
                    onChange={(e) => {
                        setFormData({ ...formData, addressLine2: e.target.value })
                    }}
                        size='small'
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                    <TextField
                        placeholder="City"
                        variant="outlined"
                        style={{ flexGrow: "1" }}
                        value={formData.city}
                        error={formDataError.city !== ""}
                        helperText={formDataError.city}
                        onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value })
                            if(e.target.value !== ""){
                            setFormDataError({...formDataError, city: ""})
                        }
                        }}
                        size='small'
                    />
                    <TextField
                        placeholder="State/Province/Region"
                        variant="outlined"
                        style={{ flexGrow: "1" }}
                        value={formData.state}
                        error={formDataError.state !== ""}
                        helperText={formDataError.state}
                        onChange={(e) => {
                            setFormData({ ...formData, state: e.target.value })
                            if(e.target.value !== ""){
                            setFormDataError({...formDataError, state: ""})
                        }
                            
                        }}
                        size='small'
                    />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <TextField
                        placeholder="Postal / Zip Code"
                        variant="outlined"
                        style={{ flexGrow: "1" }}
                        value={formData.zipCode}
                        error={formDataError.zipCode !== ""}
                        helperText={formDataError.zipCode}
                        onChange={(e) => {
                            setFormData({ ...formData, zipCode: e.target.value })
                            if(e.target.value !== ""){
                            setFormDataError({...formDataError, zipCode: ""})
                        }
                        }}
                        size='small'
                    />
                    <Box
                        style={{ flexGrow: "1" }}
                    >
                        <FormControl fullWidth size='small'>
                            <InputLabel id="demo-simple-select-label">Country</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData.country.toLowerCase()}
                                label="Country"
                                error={formDataError.country !== ""}
                                helperText={formDataError.country}
                                onChange={(e) => { 
                                    setFormData({ ...formData, country: e.target.value }) 
                                    if(e.target.value !== ""){
                            setFormDataError({...formDataError, country: ""})
                        }
                                }}
                                size='small'
                            >
                                {countryList.map(country => {
                                    return <MenuItem key={country} value={country.name.toLowerCase()}>{country.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    </div>
                </div>
            </div>

<div style={{display: "flex", gap: "10px", marginTop: "2px"}}>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1" }}>
                <Typography>Date of Birth*</Typography>
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}> */}
                    {/* <DatePicker
                        variant="outlined"
                        inputVariant='outlined'
                        format="MM/DD/YYYY"
                        margin="none"
                        size='small'
                        id="dateOfBirth"
                        // label="MM/DD/YYYY"
                        value={formData.dateOfBirth}
                        // views={["date", "month","year"]}
                        name="dateOfBirth"
                        style={{
                            '.MuiFormLabel-root.Mui-disabled': { color: 'grey' },
                            '.MuiPaper-root': {color: "#000000", backgroundColor: "#ffffff !important"},
                        }}
                        autoOk
                        className={classes.textFields}
                        onChange={value =>{
                            setFormData({ ...formData, dateOfBirth: value.format("MM/DD/YYYY") })
                        }
                        }
                        
                    /> */}
                {/* </MuiPickersUtilsProvider> */}
                <form noValidate>
      {/* <TextField
        id="date"
        type="date"
        value={formData.dateOfBirth !== "" && moment(formData.dateOfBirth).format("YYYY-MM-DD")}
        className={dateClasses.textField}
        error={formDataError.birthPlace !== ""}
        helperText={formDataError.birthPlace}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
            if(e.target.value === ""){
                setFormData({ ...formData, dateOfBirth: "" })
            }
            else{
                setFormData({ ...formData, dateOfBirth: moment(e.target.value).format("MMM DD, YYYY") })
            }
        }}
        size='small'
        style={{width: "100%"}}
      /> */}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          fullWidth
          id="birth-date"
          name="Birth_Date"
          value={
            formData.dateOfBirth
              ? moment(formData.dateOfBirth).format(
                  'YYYY-MM-DD'
                )
              : null
          }
          onError={value => 
              setFormDataError({
                ...formDataError,
                dateOfBirth: value
              })
          }
          renderInput={params => (
            <TextField {...params} fullWidth size="small" />
          )}
          onChange={value => {
            setFormData({
              ...formData,
              dateOfBirth: moment(value).format(
                'MMM DD, YYYY'
              )
            });
          }}
        />
    </LocalizationProvider>
    </form>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1"  }}>
                <Typography>Birth Place*</Typography>
                <TextField
                    variant="outlined"
                    placeholder="City, State, Country"
                    style={{ flexGrow: "1" }}
                    value={formData.birthPlace}
                    error={formDataError.birthPlace !== ""}
                    helperText={formDataError.birthPlace}
                    onChange={(e) => {
                        setFormData({ ...formData, birthPlace: e.target.value })
                        if(e.target.value !== ""){
                            setFormDataError({...formDataError, birthPlace: ""})
                        }
                    }}
                    size='small'
                />
            </div>
            </div>
            </div>
            </div>
            <Divider style={{margin: "10px 0"}}/>
            </div>
            {/* } */}
            {/* {activeStep === 1 &&  */}
            <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "100%"}}>

                <Typography style={{fontWeight: "500", fontSize: "17px"}}>Professional Information</Typography>
            <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
            
            <div style={{flex: "1"}}>

            <Box
                sx={{ minWidth: "220px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px"}} style={{ flexGrow: "1" }}
            >
                <Typography>Type of License Requesting*</Typography>
                <FormControl fullWidth size='small'>
                    {/* <InputLabel className='poppinsFont' id="demo-simple-select-label">Something</InputLabel> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        displayEmpty
                        value={formData.profession}
                        inputProps={{ 'aria-label': 'Without label' }}
                        error={formDataError.profession !== ""}
                        helperText={formDataError.profession}
                        // label="Select Profession"
                        onChange={(e) => { 
                            setFormData({ ...formData, profession: e.target.value }) 
                            if(e.target.value !== ""){
                            setFormDataError({...formDataError, profession: ""})
                        }
                        }}
                        size='small'
                    >
                        {["APRN", "DO", "LCSW", "LMHC", "LPN", "MD", "PA", "Psychologist", "RN", "Other"].map(profession => {
                            return <MenuItem key={profession} value={profession}>{profession}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Box>
            <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", gap: "10px", marginBottom: "20px" }}>
                <Typography>State(S) Requesting Licensure*</Typography>
                <TextareaAutosize
                    variant="outlined"
                    placeholder='Example NY, NJ, CA'
                    minRows="3"
                    style={{ flexGrow: "1", padding: "5px", fontFamily: "Poppins" }}
                    required
                    value={formData.StatesRequestingLicensure}
                    onChange={(e) => {
                        setFormData({ ...formData, StatesRequestingLicensure: e.target.value })
                        if(e.target.value !== ""){
                            setFormDataError({...formDataError, StatesRequestingLicensure: ""})
                        }
                    }}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", gap: "10px" }}>
                <Typography>Do you hold a license in any other US State? If so, what State(s)?</Typography>
                <TextareaAutosize
                    variant="outlined"
                    placeholder='Example NY, NJ, CA'
                    minRows="3"
                    style={{ flexGrow: "1", padding: "5px", fontFamily: "Poppins" }}
                    value={formData.currentLicenseStates}
                    onChange={(e) => setFormData({ ...formData, currentLicenseStates: e.target.value })}
                />
            </div>
            </div>
            <div style={{flex: "1", minWidth: "200px"}}>

            <div>
                <Typography style={{fontWeight: "600", fontSize: "16px", fontFamily: "Poppins", marginBottom: "5px"}}>Disclosure Questions*</Typography>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <FormControl
                    error={formDataError.disclosureQuestions[0] !== ""}
                    >
                        <FormLabel id="demo-radio-buttons-group-label" style={{fontSize: "16px"}}>Have any disciplinary actions been threatened, initiated or are pending against you by a state licensure board?
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                            onChange={(e) => {
                                const updatedQuestions = formData.disclosureQuestions.map((data, index) => {
                                    if (index === 0) {
                                        return { ...data, answer: e.target.value }
                                    }
                                    return data
                                })
                                 const updatedErrorQuestions = formDataError.disclosureQuestions.map((data, index) => {
                                    if (index === 0) {
                                        return ""
                                    }
                                    return data
                                })
                                setFormDataError({...formDataError, disclosureQuestions: updatedErrorQuestions})
                                setFormData({ ...formData, disclosureQuestions: updatedQuestions })
                            }
                            }
                            style={{display: "flex", flexDirection: "row"}}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <FormControl
error={formDataError.disclosureQuestions[1] !== ""}
                    >
                        <FormLabel id="demo-radio-buttons-group-label" style={{fontSize: "16px"}}>Has your license to practice in any state ever been denied, limited, suspended or revoked, diminished, not renewed, relinquished or are any proceedings currently pending which may result in any such action?
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                            onChange={(e) => {
                                const updatedQuestions = formData.disclosureQuestions.map((data, index) => {
                                    if (index === 1) {
                                        return { ...data, answer: e.target.value }
                                    }
                                    return data
                                })
                                 const updatedErrorQuestions = formDataError.disclosureQuestions.map((data, index) => {
                                    if (index === 1) {
                                        return ""
                                    }
                                    return data
                                })
                                setFormDataError({...formDataError, disclosureQuestions: updatedErrorQuestions})
                                setFormData({ ...formData, disclosureQuestions: updatedQuestions })
                            }
                            }
                            style={{display: "flex", flexDirection: "row"}}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <FormControl
                    error={formDataError.disclosureQuestions[2] !== ""}
                    >
                        <FormLabel id="demo-radio-buttons-group-label" style={{fontSize: "16px"}}>Has your professional employment ever been suspended, diminished, revoked or terminated at any hospital or healthcare facility or are any proceedings that may result in any such action currently pending?
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                            onChange={(e) => {
                                const updatedQuestions = formData.disclosureQuestions.map((data, index) => {
                                    if (index === 2) {
                                        return { ...data, answer: e.target.value }
                                    }
                                    return data
                                })
                                const updatedErrorQuestions = formDataError.disclosureQuestions.map((data, index) => {
                                    if (index === 2) {
                                        return ""
                                    }
                                    return data
                                })
                                setFormDataError({...formDataError, disclosureQuestions: updatedErrorQuestions})
                                setFormData({ ...formData, disclosureQuestions: updatedQuestions })
                            }
                            }style={{display: "flex", flexDirection: "row"}}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <FormControl
                    error={formDataError.disclosureQuestions[3] !== ""}
                    >
                        <FormLabel id="demo-radio-buttons-group-label" style={{fontSize: "16px"}}>Have there been any suits or claims against you alleging malpractice, negligence, failure to diagnose, etc. which have been pending, opened, or closed?
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue=""
                            name="radio-buttons-group"
                            onChange={(e) => {
                                const updatedQuestions = formData.disclosureQuestions.map((data, index) => {
                                    if (index === 3) {
                                        return { ...data, answer: e.target.value }
                                    }
                                    return data
                                })
                                 const updatedErrorQuestions = formDataError.disclosureQuestions.map((data, index) => {
                                    if (index === 3) {
                                        return ""
                                    }
                                    return data
                                })
                                setFormDataError({...formDataError, disclosureQuestions: updatedErrorQuestions})
                                setFormData({ ...formData, disclosureQuestions: updatedQuestions })
                            }
                            }style={{display: "flex", flexDirection: "row"}}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </div></div></div>
            {/* <Divider style={{margin: "10px 0"}}/> */}
            </div>
            {/* } */}
            {/* {activeStep === 2 &&  */}
            {/* <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "100%"}}>

                <Typography style={{fontWeight: "500", fontSize: "17px"}}>Documents</Typography>
            <div style={{display: "flex", flexDirection: "column", gap: "10px", flexWrap: "wrap"}}>
            <Typography style={{backgroundColor: "#FFFCF1", fontFamily: "Poppins", padding: "7px", paddingLeft: "20px",fontSize: "14px"}}><span style={{fontFamily: "600"}}>Note:</span> File Type should be in pdf, doc, docx, xls, xlsx, csv, txt, jpg, jpeg, png ,zip</Typography>
            <div style={{display: "flex", gap: "20px", flexWrap: "wrap"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "10px", flex: "1", minWidth: "200px"}}>

            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                <Typography>CV*</Typography>
                <Button
                    variant="outlined"
                    component="label"
                    style={{textTransform: "none", display: "flex", gap: "5px", fontWeight: "500", fontFamily: "Poppins"}}
                >
                <input
                    type="file"
                    color="primary"
                    accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.pdf"
                    name="CVAttachmentFile"
                    style={{ border: "1px dashed rgb(100, 169, 255)", padding: "15px", color: "transparent", width: "100%", cursor: "pointer"}}
                    required
                    onChange={event => {
                        setFormData({ ...formData, CVAttachmentFile: event.target.files[0] })
                    }}
                    hidden
                    />
                    <Upload height="20px" width="20px"/>
                    Choose file
                </Button>
                {formData.CVAttachmentFile && <div style={{display: "flex",flex: 1, alignItems: "center", justifyContent: "space-between", borderColor: "#C1C1C1", borderStyle: "solid", borderWidth: "1px", padding: "5px 10px",
                borderRadius: "5px"}}>
                    <div>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>{formData.CVAttachmentFile.name}</Typography>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>Size: {formData.CVAttachmentFile.size / 1000} KB</Typography>
                    </div>
                    <XCircle color='#FF3E4C' style={{cursor: "pointer"}} onClick={() => {
                        setFormData({ ...formData, CVAttachmentFile: "" })
                    }}/>
                </div>}
                <p style={{fontSize: "12px", color: "gray" }}>Please upload a copy of your CV</p>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                <Typography>Government Issued ID*
                </Typography>
                <Button
                    variant="outlined"
                    component="label"
                    style={{textTransform: "none", display: "flex", gap: "5px", fontWeight: "500", fontFamily: "Poppins"}}
                >
                <input
                    type="file"
                    color="primary"
                    accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.pdf"
                    name="governmentIssuedID"
                    style={{ border: "1px dashed rgb(100, 169, 255)", padding: "15px", color: "rgb(100, 169, 255)", width: "100%", cursor: "pointer" }}
                    required
                    onChange={event => {
                        setFormData({ ...formData, governmentIssuedID: event.target.files[0] })
                    }} hidden/>
                    <Upload height="20px" width="20px"/>
                    Choose file
                    </Button>
                    {formData.governmentIssuedID && <div style={{display: "flex",flex: 1, alignItems: "center", justifyContent: "space-between", borderColor: "#C1C1C1", borderStyle: "solid", borderWidth: "1px", padding: "5px 10px",
                borderRadius: "5px"}}>
                    <div>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>{formData.governmentIssuedID.name}</Typography>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>Size: {formData.governmentIssuedID.size / 1000} KB</Typography>
                    </div>
                    <XCircle color='#FF3E4C' style={{cursor: "pointer"}} onClick={() => {
                        setFormData({ ...formData, governmentIssuedID: "" })
                    }}/>
                </div>}
                <p style={{fontSize: "12px", color: "gray" }}>Please upload a copy of your Driver's License or Passport

                </p>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                <Typography>School Diploma*
                </Typography>
                 <Button
                    variant="outlined"
                    component="label"
                    style={{textTransform: "none", display: "flex", gap: "5px", fontWeight: "500", fontFamily: "Poppins"}}
                >
                <input
                    type="file"
                    color="primary"
                    required
                    accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.pdf"
                    name="schoolDiploma"
                    style={{ border: "1px dashed rgb(100, 169, 255)", padding: "15px", color: "rgb(100, 169, 255)", width: "100%", cursor: "pointer" }}
                    onChange={event => {
                        setFormData({ ...formData, schoolDiploma: event.target.files[0] })
                    }} hidden/>
                    <Upload height="20px" width="20px"/>
                    Choose file
                    </Button>
                    {formData.schoolDiploma && <div style={{display: "flex",flex: 1, alignItems: "center", justifyContent: "space-between", borderColor: "#C1C1C1", borderStyle: "solid", borderWidth: "1px", padding: "5px 10px",
                borderRadius: "5px"}}>
                    <div>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>{formData.schoolDiploma.name}</Typography>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>Size: {formData.schoolDiploma.size / 1000} KB</Typography>
                    </div>
                    <XCircle color='#FF3E4C' style={{cursor: "pointer"}} onClick={() => {
                        setFormData({ ...formData, schoolDiploma: "" })
                    }}/>
                </div>}
                <p style={{fontSize: "12px", color: "gray" }}>Physicians please upload a copy of your medical school diploma. PA, NP, or RN, please upload a copy of your highest level of education diploma

                </p>
            </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "10px", flex: "1", minWidth: "200px"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                <Typography>Headshot Photo*
                </Typography>
                 <Button
                    variant="outlined"
                    component="label"
                    style={{textTransform: "none", display: "flex", gap: "5px", fontWeight: "500", fontFamily: "Poppins"}}
                >
                <input
                    type="file"
                    color="primary"
                    required
                    accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.pdf"
                    name="headshotPhoto"
                    style={{ border: "1px dashed rgb(100, 169, 255)", padding: "15px", color: "rgb(100, 169, 255)", width: "100%", cursor: "pointer" }}
                    onChange={event => {
                        setFormData({ ...formData, headshotPhoto: event.target.files[0] })
                    }} hidden/>
                     <Upload height="20px" width="20px"/>
                    Choose file
                    </Button>
                    {formData.headshotPhoto && <div style={{display: "flex",flex: 1, alignItems: "center", justifyContent: "space-between", borderColor: "#C1C1C1", borderStyle: "solid", borderWidth: "1px", padding: "5px 10px",
                borderRadius: "5px"}}>
                    <div>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>{formData.headshotPhoto.name}</Typography>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>Size: {formData.headshotPhoto.size / 1000} KB</Typography>
                    </div>
                    <XCircle color='#FF3E4C' style={{cursor: "pointer"}} onClick={() => {
                        setFormData({ ...formData, headshotPhoto: "" })
                    }}/>
                </div>}
                <p style={{fontSize: "12px", color: "gray" }}>Please upload a photo of yourself from the shoulders and above

                </p>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                <Typography>Have you ever changed your name? If so, please upload a copy of your marriage certificate, divorce dicree, or name change documentation
                </Typography>
                 <Button
                    variant="outlined"
                    component="label"
                    style={{textTransform: "none", display: "flex", gap: "5px", fontWeight: "500", fontFamily: "Poppins"}}
                >
                <input
                    type="file"
                    color="primary"
                    accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.pdf"
                    name="nameChangeDocument"
                    style={{ border: "1px dashed rgb(100, 169, 255)", padding: "15px", color: "rgb(100, 169, 255)", width: "100%", cursor: "pointer" }}
                    onChange={event => {
                        setFormData({ ...formData, nameChangeDocument: event.target.files[0] })
                    }} hidden/>
                    <Upload height="20px" width="20px"/>
                    Choose file
                    </Button>
                    {formData.nameChangeDocument && <div style={{display: "flex",flex: 1, alignItems: "center", justifyContent: "space-between", borderColor: "#C1C1C1", borderStyle: "solid", borderWidth: "1px", padding: "5px 10px",
                borderRadius: "5px"}}>
                    <div>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>{formData.nameChangeDocument.name}</Typography>
                    <Typography style={{fontSize: "12px", fontFamily: "Poppins"}}>Size: {formData.nameChangeDocument.size / 1000} KB</Typography>
                    </div>
                    <XCircle color='#FF3E4C' style={{cursor: "pointer"}} onClick={() => {
                        setFormData({ ...formData, nameChangeDocument: "" })
                    }}/>
                </div>}
                <p style={{fontSize: "12px", color: "gray" }}>If you have not changed your name, no need to upload any documentation.

                </p>
            </div>
            </div></div>
            </div>
            <Divider style={{margin: "10px 0"}}/>
            </div> */}
            {/* } */}
            {/* {activeStep >= 3 &&  */}
            {/* <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>

                <Typography style={{fontWeight: "500", fontSize: "17px"}}>Terms & Conditions</Typography>
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <div style={{ padding: "5px", height: "300px", overflowY: "auto" }} onScroll={(e) => {
                    const bottom = Math.abs(((e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight));
                    setScrollThroughBottom(bottom < 3)
                    
                }}>
                    <Typography className='poppinsFont'>Request for Service Terms and Conditions *</Typography>
                    <div style={{ border: "1px solid black", padding: "5px"}}>
                    <Typography className='poppinsFont'>
                        medtigo is a leading provider of licensing services for physician and allied health provider state licenses. Client wishes to utilize medtigo’s services in obtaining one or more state licenses. It is our goal to provide you with the highest quality and most efficient service. To that end, this Request for Service is entered between us to identify the scope of services we will provide, the important timelines, and to describe and agree upon the roles and responsibilities of each of us.
                    </Typography>
                    <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
                        <tr>
                            <th style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont' style={{fontWeight: "bold"}}>
                                What medtigo is responsible for
                                </Typography>
                                </th>
                            <th style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont' style={{fontWeight: "bold"}}>
                                What you (Client/Provider) are responsible for
                                </Typography>
                                </th>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                <span style={{fontWeight: "bold"}}>Onboarding</span> - medtigo staff will review our service in detail and gather information from you about the license you wish to obtain.
                                </Typography>
                            </td>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                Once you are ready to proceed, our staff will send you an invoice for our service fee. You will return that and complete our demographic information form and provide a copy of your current CV.
                            </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                <span style={{fontWeight: "bold"}}>Application</span> - medtigo licensing analyst will obtain the application from the state medical board and fill in the application on your behalf. We use information about you from your CV and information that is publicly available, so it is important that you check carefully for accuracy.
                                </Typography>
                            </td>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                Once you receive the application from your analyst, you should carefully review all the information that is entered. If a section requires an edit, it should be reported to your analyst so the change can be made. Once the application is correct, it will be submitted to the medical board. When it is accurate and complete, you will either sign the paper application or submit the electronic version, depending on your state.
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                <span style={{fontWeight: "bold"}}>Primary Source Verifications Requested</span> - medtigo licensing analyst will request all the necessary primary source verifications on your behalf.
                                </Typography>
                            </td>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                Primary source verification fees will be invoiced to you or your finance department. Once we receive payment, we will submit the verification request. Verifications Requested will not be requested if the invoice is outstanding.
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                <span style={{fontWeight: "bold"}}>Criminal Background Screening / Fingerprinting</span> - medtigo licensing analyst will notify you if a background screening is required for your application. This is a state-specific process, and the state will either email or mail an application packet directly to you.
                                </Typography>
                            </td>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                If your application requires a background screening, it is your responsibility to complete it as soon as possible so there is no delay in the application process. You will receive instructions directly from the state on how to complete the background screening.
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                <span style={{fontWeight: "bold"}}>Follow Up Until Approval</span> - medtigo licensing analyst will follow up with the state medical board until the application is confirmed as complete by the board and a license number is issued.
                                </Typography>
                            </td>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                There are instances when the board will email the applicant an update on the status of the application. Please forward those updates to your analyst so they can assist with any outstanding items.
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                <span style={{fontWeight: "bold"}}>Communication</span> - you will receive weekly updates on the status of your application from your medtigo licensing analyst. You can always obtain real time updates by logging into our license tracker.
                                </Typography>
                            </td>
                            <td style={{ border: "1px solid black", padding: "0 5px" }}>
                                <Typography className='poppinsFont'>
                                Timely communication with us is key to completing your application. You must complete all items in a timely manner and keep us updated on any travel or times you will be unavailable. Failure to do so will delay your application.
                                </Typography>
                            </td>
                        </tr>
                    </table>
                    <Typography className='poppinsFont'>
                        medtigo is not responsible for delays or license denials based on your history or due to missing information from you.  If we notice any marks or non-standard items in your application, we will notify you before proceeding. We will always notify you of open items.
                        If we fail to receive a response from you after 45 days, we reserve the right to cancel our services and cease work on your application. Please note: our fee is non-refundable.
                    </Typography>
                </div></div>
            </div>
            <Box
                alignItems="center"
                display="flex"

                ml={-1}
                style={{
                    color: '#000'
                }}
            >
                <Checkbox
                    // name="send_login_details"
                    onChange={() => { setIsTCAccepted(value => !value) }}
                    checked={isTCAccepted}
                    disabled={!scrolledTroughBottom}
                />
                <Typography
                    variant="body2"
                    color="#000000"
                >
                    I accept the Request for Service
                </Typography>
            </Box>

            
            </div> */}
            
            {/* } */}
        <React.Fragment>
            <div style={{display: "flex", alignSelf: "center", paddingBottom: "10px", alignItems: "center", flexGrow: "1", width: "100%", position: "relative"}}>

          {!isFormValid && <Typography className="errorDisplay"style={{color: "red", position: "absolute"}}>Please fill all mandatory fields</Typography>}
          <Box sx={{ display: 'flex', flexDirection: 'row', marginLeft: "auto", marginRight: "auto"}}>
            {/* <Button
              color="inherit"
              disabled={activeStep === 0}
            //   onClick={handleBack}
              sx={{ mr: 1 }}
              >
              Back
            </Button> */}

            
          </Box>
                </div>
                
        </React.Fragment>
        </div>
        <Button color='primary' variant='contained' onClick={handleSubmitForm} style={{alignSelf: "center", marginBottom: "15px"}}>
              {/* {activeStep >= steps.length - 1 ? 'Submit' : 'Next'} */}
              Submit
            </Button>
        </div>
        
        
    </div>
}
export default ServiceRegistationForm
