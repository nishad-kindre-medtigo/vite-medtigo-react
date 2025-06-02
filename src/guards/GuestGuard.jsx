import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {courseDetails} from "../appConstants";

function GuestGuard({ children }) {
  const account = useSelector((state) => state.account);
  const urlParams = new URLSearchParams(window.location.search);
  const admin_token = urlParams.get('admin_token') || urlParams.get('t');
  const certificate_id = urlParams.get('cert') || '';
  const cme_id = urlParams.get('cme') || '';
  const hash = urlParams.get('hash') || '';
  const destination = urlParams.get('destination');
  const urldata = urlParams.get('data',admin_token)
  const courseName = urlParams.get('courseName');
  const courseRequestEmail = urlParams.get('email');
  const syllabusName = urlParams.get('syllabusName');

  if(admin_token){
    localStorage.setItem('accessToken', admin_token);
    localStorage.setItem('courseName', courseName);
    localStorage.setItem('courseRequestEmail', courseRequestEmail);
    localStorage.setItem('syllabusName',syllabusName);
    if(urldata)
    {localStorage.setItem('data', urldata);}
    window.history.pushState({},
      document.title, window.location.pathname + (destination ? '?destination='+destination : '') + (certificate_id ? '?cert='+certificate_id : '') + (cme_id ? '?cme='+cme_id+'&hash='+hash : ''));
    return window.location.reload();
  }
  if (account.user && !admin_token) {
    let url
     const data= localStorage.getItem("data")
    if(data && data!="/login" && data!="/"){
      url=data
      // setTimeout(()=>{
      //   localStorage.removeItem("data")},5000)
    }else{
      url = '/home'
    }
    if(localStorage.getItem("courseName") =='PALS' || localStorage.getItem("courseName") =='ACLS' 
    ||localStorage.getItem("courseName") =='BLS' || localStorage.getItem("courseName") =='ASLS' ||localStorage.getItem("courseName") =='NRP' && localStorage.getItem("courseRequestEmail")){

      url = '/thankyou/fullCertificateRequest/'+localStorage.getItem("courseName")+'/'+localStorage.getItem("courseRequestEmail");
      // localStorage.removeItem("courseName");
      // localStorage.removeItem("courseRequestEmail");

    } 
    if(localStorage.getItem('syllabusName') =='PALS' || localStorage.getItem('syllabusName') =='ACLS' || localStorage.getItem('syllabusName') =='BLS'){
      url = '/syllabusReader/'+localStorage.getItem('syllabusName');
      // localStorage.removeItem("syllabusName");
    }
    // let url = '/home';
    if(destination){
      const course = courseDetails.find(course => course.short_name === destination.toUpperCase());
      url = course ? '/learning/course/'+course.id : '/home';
    }
    if(certificate_id){
      url = `/learning/course/${certificate_id}`
    }

    return <Navigate to={url} />;
  }

  return children;
}

GuestGuard.propTypes = {
  children: PropTypes.any
};

export default GuestGuard;
