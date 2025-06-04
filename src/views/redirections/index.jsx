import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import authService from 'src/services/authService';
import LearningService from 'src/services/learningService';
import { MARKET_URL } from 'src/settings';

function RedirectingPage(){
    const navigate = useNavigate();
    const {place}=useParams();
  const { user } = useSelector(state => state.account);

  const admin_token = authService.getAccessToken();
  const token= admin_token? "&t1=" + admin_token:''

  const getCoursesToken = async () => {
    try {
      const newToken = await authService.generateToken(); // create a new 24 hour token
      return newToken;
    } catch (error) {
      console.error('Error generating token:', error);
      return null;
    }
  };  

    useEffect(()=>{
        firstTask();
        navigate.push('/home')
    },[])
    
const firstTask=async()=>{
    
    if(place === "checkout"){
        const lang = localStorage.getItem("lang") ? localStorage.getItem("lang") + "/" :  ""
        window.open(`https://staging2.medtigo.store/${lang}checkout?t=`+ user.wp_token + "&add-to-cart=" + localStorage.getItem("add-to-cart"), "_self")
    }
    else if(place==='marketplace'){

        window.open('https://medtigo.store?t=' + user.wp_token);

    }
    else if(place === 'journal'){
        window.open('https://staging2.journal.medtigo.com/?t=' + user.wp_token+token);
    }
    else if(place === 'courses'){
        const newToken = await getCoursesToken();
        const courses_connect_token = newToken ? "&t1=" + newToken : '';
        window.open('https://courses.medtigo.com/?t=' + user.wp_token + courses_connect_token);
    }
    else{
        window.open('https://medtigo.com?t=' + user.wp_token+token);
    }     
    await LearningService.redirectToPlace(place);
 
}
    return(
        <div>
            <h2>Redirecting...</h2>
        </div>
    )
}

export default RedirectingPage;
