// Course Plans TO place order for TeamHealth User passes Quiz
export const teamhealthPlans = {
  '4526': 19986, // ACLS
  '9985': 19981, // BLS
  '9238': 19984, // PALS
  '151904': 17475, // ASC CE
  '79132': 17474, // NRP
  '192797': 77817, // NIHSS
  '11159': 6025 // OPIOID
}

export const courseDetails = [
  {
    full_name: 'Advanced Cardiovascular Life Support',
    short_name: 'ACLS',
    id: 4526
  },
  {
    name: 'bls-course',
    full_name: 'Basic Life Support',
    short_name: 'BLS',
    id: 9985
  },
  {
    name: 'pals-course',
    full_name: 'Pediatric Advanced Life Support',
    id: 9238
  },
  {
    name: 'nrp-course',
    full_name: 'Neonatal Resuscitation Program',
    id: 79132
  },
  {
    name: 'NIH-stroke-scale',
    full_name: 'NIH Stroke Scale',
    id: 192797
  },
  {
    name: 'asls-course',
    full_name: 'Annual Stroke Center Continuing Education (ASC CE)',
    id: 151904
  },
  {
    name: 'opioid-course',
    full_name: 'Opioid And Pain Management',
    id: 11159
  }
];

// Config for Confetti when quiz passed
export const config = {
  spread: '360',
  startVelocity: '30',
  dragFraction: 0.12,
  elementCount: '300',
  stagger: '0',
  width: '7px',
  height: '7px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
};

export const simulationCasesData = [
  {
      case: ['case-1', 'case a', 'casea', 'case-100', 'case 100'],
      desc: 'A 78-year-old man found unconscious with a known history of diabetes.',
      image: 'https://simulation.medtigo.com/wp-content/uploads/2022/07/Screen-Shot-2021-07-08-at-3.43-1-6.png',
  },
  {
      case: ['case-2', 'case b', 'caseb', 'case-101', 'case 101'],
      desc: 'An 85-year-old man found confused with a known history of hypertension.',
      image: 'https://simulation.medtigo.com/wp-content/uploads/2022/08/MicrosoftTeams-image-4-2.png',
  },
  {
      case: ['case-3', 'case c', 'casec', 'case-102', 'case 102'],
      desc: 'A 78-year-old woman found dizzy with a known history of smoking.',
      image: 'https://simulation.medtigo.com/wp-content/uploads/2022/07/Screen-Shot-2021-07-08-at-3.43-1-4-1.png',
  },
  {
      case: ['case-4', 'case d', 'cased', 'case-103', 'case 103'],
      desc: 'A 24-year-old woman complaining of a "restless heart',
      image: 'https://simulation.medtigo.com/wp-content/uploads/2022/08/MicrosoftTeams-image-5.png',
  },
  {
      case: ['case-5', 'case e', 'casee', 'case-104', 'case 104'],
      desc: 'A 67-year-old man found unconscious with a known history of bradycardia.',
      image: 'https://simulation.medtigo.com/wp-content/uploads/2022/08/MicrosoftTeams-image-2-1-1-1-1.png',
  },
  {
      case: ['case-6', 'case f', 'casef', 'case-105', 'case 105'],
      desc: 'A 55-year-old woman found dizzy with a known history of using herbal tea.',
      image: 'https://simulation.medtigo.com/wp-content/uploads/2022/07/Screen-Shot-2021-07-08-at-3.43-1-1-1.png',
  }
]