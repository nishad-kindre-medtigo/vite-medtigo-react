import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import BuyIcon from '@mui/icons-material/AddShoppingCart';
import { FullAccessPlanInfo } from '../data';
import { useBuyPlan } from '../../../../hooks/useBuyPlan';
import { CertificateValidity } from '../ui';

// Constants for colors and styles
export const COLORS = {
  primary: '#2872C1',
  secondary: '#55A3FF96',
  white: '#fff',
  black: '#000',
  grey: '#C9C9C9',
  lightGrey: '#F0F0F0',
  darkGrey: '#606060',
  red: '#FF0000',
  darkRed: '#C9001D'
};

export const FONT = {
  small: '10px',
  medium: '12px',
  normal: '16px',
  large: '20px',
  xLarge: '24px',
};

const CurrentPlanText = ({ children }) => (
  <Typography
    component="span"
    style={{
      fontWeight: 500,
      fontSize: FONT.normal,
      color: COLORS.darkRed,
    }}
  >
    {children}
  </Typography>
);

const PlanCardText = ({ children, ...sx }) => (
  <Typography
    sx={{
      mb: 1,
      fontWeight: 500,
      fontSize: FONT.medium,
      color: '#636363',
      ...sx
    }}
  >
    {children}
  </Typography>
);

const PlanPrice = ({ price = '$50', isPlanPurchased }) => (
<Typography
  component="span"
  sx={{
    fontSize: '30px',
    color: COLORS.primary,
    fontWeight: 600,
    display: 'flex', // Use flexbox for alignment
    alignItems: 'center', // Vertically align items
    gap: 1
  }}
>
  {price}
  {isPlanPurchased && <CurrentPlanText>CURRENT PLAN</CurrentPlanText>}
</Typography>

);

export const styles = {
  dividerText: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: COLORS.white,
    color: '#1E1E1E',
    paddingInline: '12px',
  },
  discountText: {
    color: COLORS.red,
    fontSize: FONT.large,
  },
  priceText: {
    color: COLORS.primary,
    fontSize: FONT.xLarge,
    '@media (max-width: 600px)': {
      fontSize: FONT.large,
    },
  },
  strikeThrough: {
    color: COLORS.darkGrey,
    textDecoration: 'line-through',
    fontSize: FONT.large,
  },
  priceBox: {
    height: '100%',
    minHeight: {xs: '400px', sm: '320px'},
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 10px 0px #00000033',
    background: COLORS.white,
  },
  buyButton: {
    paddingInline: '20px',
    borderRadius: '4px',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
  mainDiscountContainer: {
    '@media (max-width: 600px)': {
      paddingBlock: 10,
      gap: '6px',
    },
  },
  discountContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  listContainer: {
    marginLeft: '16px',
    fontWeight: 'bold',
    lineHeight: '24px',
    fontSize: FONT.medium
  },
  cardListContainer: {
    fontWeight: 'bold',
    fontSize: FONT.medium,
    lineHeight: '24px',
    marginLeft: FONT.normal,
  },
  listItem: {
    marginBottom: '3px',
  },
  itemDescription: {
    fontWeight: 500,
    lineHeight: '26px',
  },
};

const fullAccessPlanCreditsBadge = "https://courses.medtigo.com/wp-content/uploads/2024/08/Group-1000005246-1.png";
const fullAccessPlanPreview = "https://courses.medtigo.com/wp-content/uploads/2025/03/full_access_popup.png";
const basicRibbon = 'https://courses.medtigo.com/wp-content/uploads/2025/03/basic_ribbon.png';
const standardRibbon = 'https://courses.medtigo.com/wp-content/uploads/2025/03/standard_ribbon.png';
const bestValueRibbon = 'https://courses.medtigo.com/wp-content/uploads/2025/03/best_value_ribbon.png';

// Card for Basic Plan
export const BasicPlanCard = ({ title, cardImg1, currentPlan, isMobile }) => {
  const { buyPlan, courseIds, isLoading, setIsLoading } = useBuyPlan();
  const isPlanPurchased = currentPlan === 'basic';

  const handleBuyPlan = () => {
    const currentCourse = courseIds[title].basic.regular; // basic plan for course
    setIsLoading(true);
    buyPlan(currentCourse);
  };

  return (
    <Box p={2} sx={{...styles.priceBox, position: 'relative', border: isPlanPurchased && '2px solid #2872C1'}}>
      <PlanPrice price='$30' isPlanPurchased={isPlanPurchased}/>
      <img src={basicRibbon} alt="Basic Plan Ribbon" style={{ position: 'absolute', top: -1, right: -4, height: '100px'}} />
      <Box sx={{ borderBottom: '1px solid #D6D6D6' }}>
        <CertificateValidity duration="6 MONTHS" />
        {isMobile && <img src={cardImg1} alt="Card Image 1" width={250}/>}
      </Box>
      <Box flexGrow={1} sx={{ mt: 1, position: 'relative' }}>
        <PlanCardText>The Plan includes following:</PlanCardText>
        {!isMobile && <img src={cardImg1} alt="Card Image 1" style={{ position: 'absolute', top: 0, right: 0}} />}
        <ul style={styles.cardListContainer}>
          <li>{title} Provider Card</li>
          <li>
            Course Syllabus and Study Guide
          </li>
        </ul>
      </Box>
      <Box textAlign="right" alignSelf="flex-end">
        <Button variant="contained" style={styles.buyButton} onClick={handleBuyPlan} startIcon={<BuyIcon />}>
          BUY NOW
        </Button>
      </Box>
    </Box>
  );
};

// Card for Standard Plan
export const StandardPlanCard = ({ title, cardImg1, currentPlan, isMobile }) => {
  const { buyPlan, courseIds, isLoading, setIsLoading } = useBuyPlan();
  const isPlanPurchased = currentPlan === 'standard';

  const handleBuyPlan = () => {
    const currentCourse = courseIds[title].standard.regular; // standard plan for course
    setIsLoading(true);
    buyPlan(currentCourse);
  };

  return (
    <Box p={2} sx={{ ...styles.priceBox, position: 'relative', border: isPlanPurchased && '2px solid #2872C1'}}>
      <PlanPrice price='$45' isPlanPurchased={isPlanPurchased}/>
      <img src={standardRibbon} alt="Standard Plan Ribbon" style={{ position: 'absolute', top: -1, right: -4, height: '100px'}} />
      <Box sx={{ borderBottom: '1px solid #D6D6D6' }}>
        <CertificateValidity duration="1 YEAR" />
        {isMobile && <img src={cardImg1} alt="Card Image 1" width={200}/>}
      </Box>
      <Box flexGrow={1} sx={{ mt: 1, position: 'relative' }}>
        <PlanCardText>The Plan includes following:</PlanCardText>
        {!isMobile && <img src={cardImg1} alt="Card Image 1" style={{ position: 'absolute', top: 0, right: 0}} />}
        <ul style={styles.cardListContainer}>
          <li>{title} Provider Card</li>
          <li>Certificate Tracker</li>
          <li>
            Course Syllabus and Study Guide
          </li>
        </ul>
      </Box>
      <Box textAlign="right">
        <Button variant="contained" style={styles.buyButton} onClick={handleBuyPlan} startIcon={<BuyIcon />}>
          BUY NOW
        </Button>
      </Box>
    </Box>
  );
};

// Card for Best Value Plan
export const BestValuePlanCard = ({ title, creditsBadge, cardImg2, isMobile, cmeCredits, currentPlan, fullAccess }) => {
  const { buyPlan, courseIds, setIsLoading } = useBuyPlan();
  const isPlanPurchased = (currentPlan === 'best_value' && !fullAccess) || currentPlan === 'addon';

  const handleBuyPlan = () => {
    const currentCourse = courseIds[title].best_value; // best value plan for course
    setIsLoading(true);
    buyPlan(currentCourse)
  }

  return (
    <Box p={2} sx={{ ...styles.priceBox, position: 'relative', border: isPlanPurchased && '2px solid #2872C1' }}>
      <PlanPrice price='$50' isPlanPurchased={isPlanPurchased}/>
      <img src={bestValueRibbon} alt="Best Value Plan Ribbon" style={{ position: 'absolute', top: -1, right: -4, height: '100px'}} />
      <Box sx={{ borderBottom: '1px solid #D6D6D6' }}>
        <CertificateValidity />
        {isMobile && <img src={cardImg2} alt="Card Image 2" width={250}/>}
      </Box>
      <Box flexGrow={1} sx={{ mt: 1, position: 'relative' }}>
        <Box component="img" src={creditsBadge} alt="Credits Badge" sx={{ marginLeft: -2, width: 180, mt: 1 }}/>
        <PlanCardText sx={{ m: 0 }}>The Plan includes following:</PlanCardText>
        {!isMobile && <img src={cardImg2} alt="Card Image 2" style={{ position: 'absolute', top: 0, right: 0}} />}
        <ul style={styles.cardListContainer}>
          <li>{title} Provider Card</li>
          <li>Full-size PDF Certificate</li>
          {title === "ACLS" && (
            <li>Full Access to Simulation</li>
          )}
          <li>Certificate Tracker</li>
          <li>Course Syllabus and Study Guide</li>
        </ul>
      </Box>
      <Box textAlign="right">
        <Button variant="contained" style={styles.buyButton} onClick={handleBuyPlan} startIcon={<BuyIcon />}>
          BUY NOW
        </Button>
      </Box>
    </Box>
  );
};

// Card for Full Access Plan
export const FullAccessPlanCard = ({ isMobile, courseID, currentPlan, fullAccess }) => {
  const { buyPlan, isLoading, setIsLoading } = useBuyPlan();
  let isPlanPurchased = currentPlan === 'best_value' && fullAccess;

  if(fullAccess && (courseID == 79132 || courseID == 151904)){
    isPlanPurchased = true
  }

  const handleBuyPlan = () => {
    setIsLoading(true);
    buyPlan();
  };
  
  const PlanPrice = () => {
    return (
      <>
        <Typography component="span" style={{ fontWeight: 'bold', fontSize: FONT.large, color: COLORS.primary }}>
          $100&nbsp;&nbsp;
        </Typography>
        <Typography component="span" style={{ fontWeight: 'bold', fontSize: FONT.large,  textDecoration: 'line-through', color: '#6A6A6A' }}>
          $280
        </Typography>
        <Typography component="span" style={{ fontWeight: 'bold', color: COLORS.red, fontSize: FONT.large }}>
          &nbsp;&nbsp;70% OFF
        </Typography>
      </>
    );
  };

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          p: 2,
          border: isPlanPurchased && '2px solid #2872C1',
          boxShadow: '0px 2px 10px 0px #00000033',
          background: COLORS.white
        }}
      >
        <Grid container>
          <Grid container>
            <Grid item xs={12} md={8}>
              {isPlanPurchased && (
                <CurrentPlanText>CURRENT PLAN</CurrentPlanText>
              )}
              <Typography
                sx={{ fontWeight: 'bold', fontSize: FONT.large, mb: 1 }}
              >
                medtigo Full Access Plan
                {!isMobile && (
                  <>
                    {' '}
                    - <PlanPrice />
                  </>
                )}
              </Typography>
              {isMobile && <PlanPrice />}
              <CertificateValidity />
              <Typography sx={{ fontWeight: 'bold', fontSize: FONT.medium }}>
                The Plan includes following:
              </Typography>
              <ul style={styles.listContainer}>
                {FullAccessPlanInfo.map((item, index) => (
                  <li key={index}>
                    <div>
                      {item.title}
                      <span style={styles.itemDescription}>
                        {item.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <img
                src={fullAccessPlanPreview}
                alt="Course Preview"
                style={{ width: '100%' }}
              />
            </Grid>
          </Grid>
          <Grid item xs textAlign="right">
            <Button
              variant="contained"
              style={styles.buyButton}
              onClick={handleBuyPlan}
              startIcon={<BuyIcon />}
            >
              BUY NOW
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

// Card for NRP & ASLS Course
export const SingleCard = ({ title, cardImg1, isMobile, fullAccess, currentPlan }) => {
  const price = '$40';
  const { buyPlan, courseIds, isLoading, setIsLoading } = useBuyPlan();
  let isPlanPurchased = !fullAccess && currentPlan !== "no_access";

  const handleBuyPlan = () => {
    const currentCourse = courseIds[title]; // Plans for ASLS & NRP
    setIsLoading(true);
    buyPlan(currentCourse)
  }

  const Decription = () => {
    return (
    <>
      <Typography style={{ fontWeight: 'bold', fontSize: FONT.medium }}>
        The course includes following:
      </Typography>
      <ul style={styles.listContainer}>
        <li>{title} Provider Card</li>
        {/* {title === 'ASC CE' && (
          <li>
            2 CME/CE Credits -{' '}
            <span style={{ fontWeight: 500 }}>
              Meet your CME/CE requirements by getting these credits upon successful course completion.
            </span>
          </li>
        )} */}
        <li>
          Course Syllabus and Study Guide -{' '}
          <span style={{ fontWeight: 500 }}>
            A downloadable PDF version that will help you study whenever, wherever you want to.
          </span>
        </li>
        <li>
          Professional Course Certificate -{' '}
          <span style={{ fontWeight: 500 }}>
            A premium certificate serving as the official medtigo credential for course completion.
          </span>
        </li>
      </ul>
    </>
    )
  }

  return (
    <Box sx={{ ...styles.priceBox, border: isPlanPurchased && '2px solid #2872C1' }} p={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, pb: 1, mb: 1, borderBottom: '1px solid #D6D6D6' }}>
        <Box>
          {isPlanPurchased && <CurrentPlanText>CURRENT PLAN</CurrentPlanText>}
          <Typography sx={{ fontSize: '30px', color: COLORS.primary, fontWeight: 600 }}>
            {price}
          </Typography>
          <CertificateValidity sx={{ background: '#EAF3FF'}} />
        </Box>
        <img src={cardImg1} alt="Card Image 1" width={130}/>
      </Box>
      <Decription/>
      <Box mt={1} textAlign="right" alignSelf="flex-end">
        <Button variant="contained" style={styles.buyButton} onClick={handleBuyPlan} startIcon={<BuyIcon />}>
          BUY NOW
        </Button>
      </Box>
    </Box>
  );
};
