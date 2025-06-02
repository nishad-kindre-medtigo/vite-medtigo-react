const calculateCredits = (data) => {
  let totalCredits = 0;
  data.forEach(cert => {
    totalCredits += parseFloat(cert.No_of_Credit_Hours);
  });
  // Round to 2 decimal places
  return Math.round(totalCredits * 100) / 100;
};

export default calculateCredits;
