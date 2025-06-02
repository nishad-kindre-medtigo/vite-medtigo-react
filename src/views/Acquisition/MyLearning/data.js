
// STATIC DATA FOR COURSE IMAGES USED IN MY LEARNING PAGE
export const courses = [
    {
        id: 4526,
        title: 'ACLS',
        color: '#8C071A',
        subtitle: 'Advanced Cardiovascular Life Support',
        cmeCredits: 4.25,
        image: 'http://courses.medtigo.com/wp-content/uploads/2024/10/acls.svg',
        courseImage: 'http://courses.medtigo.com/wp-content/uploads/2024/08/acls_banner_title.svg',
        courseMobileImage: '/images/myLearning/acls-mobile-img.svg',
        creditsBadge: 'http://courses.medtigo.com/wp-content/uploads/2024/09/acls_cme_credits.svg',
        cardImg1:'https://courses.medtigo.com/wp-content/uploads/2025/03/acls_provider_card.svg',
        cardImg2:'https://courses.medtigo.com/wp-content/uploads/2025/03/acls_provider_card_and_cme.svg',
    },
    {
        id: 9985,
        title: 'BLS',
        color: '#014B6B',
        subtitle: 'Basic Life Support',
        cmeCredits: 3,
        image: 'http://courses.medtigo.com/wp-content/uploads/2024/10/bls.svg',
        courseImage: 'http://courses.medtigo.com/wp-content/uploads/2024/08/bls_banner_title.svg',
        courseMobileImage: '/images/myLearning/bls-mobile-img.svg',
        creditsBadge: 'http://courses.medtigo.com/wp-content/uploads/2024/09/bls_cme_credits.svg',
        cardImg1:'https://courses.medtigo.com/wp-content/uploads/2025/03/bls_provider_card.svg',
        cardImg2:'https://courses.medtigo.com/wp-content/uploads/2025/03/bls_provider_card_and_cme.svg',
    },
    {
        id: 9238,
        title: 'PALS',
        color: '#3B227D',
        subtitle: 'Pediatric Advanced Life Support',
        cmeCredits: 4,
        image: 'http://courses.medtigo.com/wp-content/uploads/2024/10/pals.svg',
        courseImage: 'http://courses.medtigo.com/wp-content/uploads/2024/08/pals_banner_title.svg',
        courseMobileImage: '/images/myLearning/pals-mobile-img.svg',
        creditsBadge: 'http://courses.medtigo.com/wp-content/uploads/2024/09/pals_cme_credits.svg',
        cardImg1:'https://courses.medtigo.com/wp-content/uploads/2025/03/pals_provider_card.svg',
        cardImg2:'https://courses.medtigo.com/wp-content/uploads/2025/03/pals_provider_card_and_cme.svg',
    },
    {
        id: 79132,
        title: 'NRP',
        color: '#013737',
        subtitle: 'Neonatal Resuscitation Program',
        image: 'http://courses.medtigo.com/wp-content/uploads/2024/10/nrp-1.svg',
        courseImage: 'http://courses.medtigo.com/wp-content/uploads/2024/08/nrp_banner_title.svg',
        courseMobileImage: '/images/myLearning/nrp-mobile-img.svg',
        cardImg1: 'https://courses.medtigo.com/wp-content/uploads/2025/03/nrp_provider_card.svg',
    },
    {
        id: 151904,
        title: 'ASC CE',
        color: '#1D1D65',
        subtitle: 'Annual Stroke Center Continuing Education',
        image: 'https://courses.medtigo.com/wp-content/uploads/2024/12/ascce.webp', // Course Card Image in My Learning Page
        courseImage: 'https://courses.medtigo.com/wp-content/uploads/2024/12/ascce-title.webp', // Explore Plans Popup Top Background Image
        courseMobileImage: 'https://courses.medtigo.com/wp-content/uploads/2024/12/ascce_mobile.svg', // Explore Plans Popup Top Background Image Mobile View
        cardImg1: 'https://courses.medtigo.com/wp-content/uploads/2025/03/ascce_provider_card.svg', // For Course Plan Cards in Explore Plans Popup
    },
    {
        id: 192797,
        title: 'NIHSS',
        cmeCredits: 2,
        image: 'https://courses.medtigo.com/wp-content/uploads/2025/02/nihss_prod_tile.png',
    },
    {
        id: 11159,
        title: 'Opioid Education and Pain Management',
        cmeCredits: 4,
        image: 'http://courses.medtigo.com/wp-content/uploads/2024/10/opioid.svg',
    }
];

export const FullAccessPlanImage = 'https://medtigo.com/wp-content/uploads/2025/02/full_access_gridview.png';

// MEDTIGO FULL ACCESS PLAN DESCRIPTION
export const FullAccessPlanInfo = [
    {
        title: 'Certificate Courses - ',
        description: 'Complete access to all five of our certificate courses in ACLS, BLS, PALS, ASC CE and NRP.'
    },
    {
        title: 'Course Syllabi - ',
        description: 'A complete set of downloadable PDF documents that will help you study whenever, wherever you want to.'
    },
    {
        title: '16.25 AMA PRA Category 1 CME/CE Credits - ',
        description: 'Meet your CME/CE requirements by getting these credits upon successful course completion.'
    },
    {
        title: 'Full-size Course Certificates - ',
        description: 'A premium set of completion certificates serving as the official medtigo credential for course completion.'
    },
    {
        title: 'Online 3D Simulations - ',
        description: 'A set of 30+ high-quality resuscitation simulation cases to put your knowledge to the test.'
    }
];

// COURSE ADDON PLAN DESCRIPTION
export const AddonPlanInfo = [
  'Provider Card',
  '3 CME/CE Credits',
  'Full-size PDF Certificate',
  'Certificate Tracker',
  'Course Syllabus and Study Guide',
  'Full Access To Simulation'
];

// USED TO CHECK PLAN FOR EACH PURCHASED COURSE FOR USER
export const coursePlans = {
  4526: {
    // ACLS
    19987: 'basic', // ORDER ITEM ID
    25320: 'basic_addon',
    1036: 'standard',
    25324: 'standard_addon',
    19986: 'best_value'
  },
  9985: {
    // BLS
    19982: 'basic',
    25318: 'basic_addon',
    1041: 'standard',
    25323: 'standard_addon',
    19981: 'best_value'
  },
  9238: {
    // PALS
    19985: 'basic',
    25322: 'basic_addon',
    1042: 'standard',
    25325: 'standard_addon',
    19984: 'best_value'
  },
  79132: {17474: 'none'}, // NRP
  151904: {17475: 'none'}, // ASLS
  11159: {6025: 'none'}, // OPIOID
  192797: {77817: 'none'}, // NIHSS
};

// ICONS IN THE COURSE CARD
export const COURSE_ICONS = {
  fullSizeCertificate: '/icons/myLearning/certificate_request.svg',
  viewCertificate: 'http://courses.medtigo.com/wp-content/uploads/2024/08/view_certificate.svg',
  claimCME: 'http://courses.medtigo.com/wp-content/uploads/2024/08/cme_claim.svg'
};