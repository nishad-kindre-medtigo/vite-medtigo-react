import { useParams } from "react-router";
import { useSelector } from "react-redux";
import OrderServices from 'src/services/orderServices';


const SimulationCaseRedirection = async () => {
  const { Case, Source } = useParams();
  const { user } = useSelector((state) => state.account);
  let UserName = user.first_name + " " + user.last_name;
  let simulationAccess = false;
  let productID;

  const simulationAccessResponse = await OrderServices.oderValidationForSimulation(user.id);

  if(simulationAccessResponse.productId ==1036 && user.email.split('@')[1] != 'teamhealth.com'){
    productID = simulationAccessResponse.productId
  }else if(simulationAccessResponse.productId ==19987 && user.email.split('@')[1] != 'teamhealth.com'){
    productID = simulationAccessResponse.productId
  }else if(simulationAccessResponse.simulationAccess){
    simulationAccess = true;
  }else if(user.email.split('@')[1] == 'teamhealth.com'){
    simulationAccess = true;
  }else{
    simulationAccess = false;
  }

  if (Case === 'CaseA' && simulationAccess) {
    return window.open(`https://simulation.medtigo.com/cases/case-1?email=${user.email}&t=${user.wp_token}&id=${user.wpUserID}&name=${UserName ? UserName : ''}&caseName=${Case}&source=${Source}`, '_self');
  } else if (Case === 'CaseB' && simulationAccess) {
    return window.open(`https://simulation.medtigo.com/cases/case-2?email=${user.email}&t=${user.wp_token}&id=${user.wpUserID}&name=${UserName ? UserName : ''}&caseName=${Case}&source=${Source}`, '_self');
  } else if (Case === 'CaseC' && simulationAccess) {
    return window.open(`https://simulation.medtigo.com/cases/case-3?email=${user.email}&t=${user.wp_token}&id=${user.wpUserID}&name=${UserName ? UserName : ''}&caseName=${Case}&source=${Source}`, '_self');
  } else if (Case === 'CaseD' && simulationAccess) {
    return window.open(`https://simulation.medtigo.com/cases/case-4?email=${user.email}&t=${user.wp_token}&id=${user.wpUserID}&name=${UserName ? UserName : ''}&caseName=${Case}&source=${Source}`, '_self');
  } else if (Case === 'CaseE' && simulationAccess) {
    return window.open(`https://simulation.medtigo.com/cases/case-5?email=${user.email}&t=${user.wp_token}&id=${user.wpUserID}&name=${UserName ? UserName : ''}&caseName=${Case}&source=${Source}`, '_self');
  } else if (Case === 'CaseF' && simulationAccess) {
    return window.open(`https://simulation.medtigo.com/cases/case-6?email=${user.email}&t=${user.wp_token}&id=${user.wpUserID}&name=${UserName ? UserName : ''}&caseName=${Case}&source=${Source}`, '_self');
  } else if(Case === 'Home' && simulationAccess){
    return window.open(`https://simulation.medtigo.com?t=${user.wp_token}&caseName=${Case}&source=${Source}`, '_self');
  }else{
    return window.open(`https://connect.medtigo.com/noSimulationCaseAccess/${productID}`, '_self');
  }
}

export default SimulationCaseRedirection;
