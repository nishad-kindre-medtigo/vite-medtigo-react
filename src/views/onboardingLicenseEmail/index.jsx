import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import authService from '../../services/authService';

const OnboardingLicenseEmail = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || '';
    const route = urlParams.get('route') || '';
    const platform = urlParams.get('platform') || '';
    const [onSuccesEmailSent, setOnSuccesEmailSent] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const handleLoginEmail = async () => {
        try{
            await authService.resendLoginLink({
                encryptedEmail: email,
                route: route.split("").slice(1).join(""),
                platform
            })
            setOnSuccesEmailSent(true)
            setIsButtonDisabled(true)
        }
        catch(err){
            setIsButtonDisabled(false)
            setOnSuccesEmailSent(false)

        }
    }

    useEffect(() => {
        sessionStorage.removeItem("onBoardingPage")
        sessionStorage.removeItem("email")
        sessionStorage.removeItem("route")
        sessionStorage.removeItem("platform")
        sessionStorage.removeItem("isNotification")
        localStorage.removeItem("data")
    }, [])


    return <Grid container direction="column" alignItems="center" paddingTop="250px" gap="10px">
        <Grid item container direction="column" alignItems="center" gap="10px">
        <img src='./images/expiredLink.svg'/>
        <Typography style={{fontWeight: "600", fontSize: "24px", fontFamily: "Poppins"}}>Login Link Expired</Typography>
        <Typography style={{fontFamily: "Poppins"}}>Sorry, the previous link you received has either expired or is no longer valid.</Typography>
        <Typography style={{fontFamily: "Poppins"}}>Please click below button to regenerate the link.</Typography>
        </Grid>
        <Button disabled={isButtonDisabled} style={{backgroundColor: `${isButtonDisabled ? 'grey' : "#2872C1"}` , color: '#ffffff' , padding: "10px 15px"}} variant='contained' onClick={handleLoginEmail}>
            SEND ME A NEW LINK
        </Button>
        {onSuccesEmailSent && <Typography style={{fontFamily: "Poppins"}}>
            You will receive an email with a new login link, please check your email.
            </Typography>}
    </Grid>
}

export default OnboardingLicenseEmail