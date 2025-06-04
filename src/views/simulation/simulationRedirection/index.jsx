import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import OrderServices from "src/services/orderServices";

const SimulationCaseRedirection = () => {
  const { Case, Source } = useParams();
  const { user } = useSelector((state) => state.account);

  useEffect(() => {
    if (!user) {
      window.open("https://connect.medtigo.com/login", "_self");
      return;
    }

    const UserName = `${user.first_name} ${user.last_name}`;
    const urlMap = {
      CaseA: `https://simulation.medtigo.com/cases/case-1`,
      CaseB: `https://simulation.medtigo.com/cases/case-2`,
      CaseC: `https://simulation.medtigo.com/cases/case-3`,
      CaseD: `https://simulation.medtigo.com/cases/case-4`,
      CaseE: `https://simulation.medtigo.com/cases/case-5`,
      CaseF: `https://simulation.medtigo.com/cases/case-6`,
      Home: `https://simulation.medtigo.com`,
    };

    const validateAccessAndRedirect = async () => {
      let simulationAccess = false;
      let productID;

      try {
        const simulationAccessResponse =
          await OrderServices.oderValidationForSimulation(user.id);

        if (
          (simulationAccessResponse.productId === 1036 ||
            simulationAccessResponse.productId === 19987) &&
          !user.email.includes("@teamhealth.com")
        ) {
          productID = simulationAccessResponse.productId;
        } else if (
          simulationAccessResponse.simulationAccess ||
          user.email.includes("@teamhealth.com")
        ) {
          simulationAccess = true;
        }

        if (simulationAccess && urlMap[Case]) {
          const targetUrl = `${urlMap[Case]}?email=${user.email}&t=${
            user.wp_token
          }&id=${user.wpUserID}&name=${encodeURIComponent(
            UserName
          )}&caseName=${Case}&source=${Source}`;
          window.open(targetUrl, "_self");
        } else {
          const noAccessUrl = `https://connect.medtigo.com/noSimulationCaseAccess/${
            productID || ""
          }`;
          window.open(noAccessUrl, "_self");
        }
      } catch (error) {
        console.error("Simulation access validation failed:", error);
        const errorUrl = "https://connect.medtigo.com/error";
        window.open(errorUrl, "_self");
      }
    };

    validateAccessAndRedirect();
  }, [Case, Source, user]);

  return null; // No UI is needed for this redirection component
};

export default SimulationCaseRedirection;
