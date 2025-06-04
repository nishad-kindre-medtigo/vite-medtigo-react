export const LICENSE_STEPS = [
  { active: 'Initiating', inactive: 'Initiated', completed: 'Initiated' },
  { active: 'Submitting', inactive: 'Submission', completed: 'Submitted' },
  { active: 'Verifying', inactive: 'Verification', completed: 'Verified' },
  { active: 'Finalizing', inactive: 'Finalization', completed: 'Finalized' },
  { active: 'Approving', inactive: 'Approval', completed: 'Approved' }
];

export const getLicenseActiveStep = licenseStatus => {
  let activeStep = -1;
  if (
    licenseStatus == 'Invoice Requested' ||
    licenseStatus === 'Onboarding' ||
    licenseStatus === 'Onboarding Completed' ||
    licenseStatus === 'Job Created'
  ) {
    activeStep = 0;
  } else if (licenseStatus == 'Application Submitted') {
    activeStep = 2;
  } else if (licenseStatus == 'Verifications Requested') {
    activeStep = 3;
  } else if (licenseStatus == 'Application Complete') {
    activeStep = 4;
  } else {
    activeStep = 1;
  }
  return activeStep;
};

export const formatLicenseTaskName = data => {
  return data.Certificate_Name.includes(',')
    ? data.Certificate_Name.split(',')
        .map((data1, index) => {
          const currentStateAbbr =
            data.state_abbr.includes(',') && data.state_abbr.split(',')[index];
          if (data1 === '') return '';
          return data1 + ' - ' + currentStateAbbr;
        })
        .slice(0, -1)
        .join(', ')
    : data.Certificate_Name +
        ' - ' +
        (data.state === 'Onboarding' ? 'Onboarding' : data.state_abbr);
};

export const convertMarkdownLinksToHtml = (text) => {
  return text?.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer" aria-label="website" style="color: blue; text-decoration: underline">$1</a>'
  );
};
