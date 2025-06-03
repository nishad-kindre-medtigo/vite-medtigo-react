import React from 'react';
import { Button, Link, Typography, Divider, Box, Grid } from '@mui/material';
import BuyIcon from '@mui/icons-material/AddShoppingCart';
import { FullAccessPlanInfo, FullAccessPlanImage } from '../data';

const styles = {
  card: {
    borderRadius: 2,
    height: '100%',
    border: '1px solid #CFCFCF',
    background: '#fff',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.23)',
    ':hover': {
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.36)', // Slightly darker shadow
    },
    position: 'relative',
  },
  title: {
    color: '#1E1E1E',
    fontSize: '36px',
    fontWeight: 600,
    '@media (max-width: 600px)': {
      fontSize: '20px',
      paddingInline: '20px',
    },
  },
  price: {
    color: '#0059B7',
    fontSize: '32px',
    fontWeight: 600,
    '@media (max-width: 600px)': {
      fontSize: '20px',
    },
  },
  discountContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    '@media (max-width: 600px)': {
      paddingBlock: '10px',
      paddingLeft: '20px',
      gap: '6px',
    },
  },
  discountText: {
    fontSize: '20px',
    fontWeight: 500,
    '@media (max-width: 600px)': {
      fontSize: '16px',
    },
  },
  discountAmount: {
    color: '#6A6A6A',
    textDecoration: 'line-through',
  },
  discountPercentage: {
    color: '#FF0000',
  },
  subscriptionText: {
    color: 'black',
    fontSize: '18px',
    fontWeight: 600,
    marginTop: '8px',
    '@media (max-width: 600px)': {
      fontSize: '14px',
      paddingInline: '20px',
      margin: 0,
    },
  },
  detailText: {
    color: 'black',
    fontSize: '16px',
    fontWeight: 300,
    lineHeight: '26px',
    '@media (max-width: 600px)': {
      fontSize: '14px',
      paddingInline: '20px',
    },
  },
  buyNowButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '12px',
    '@media (max-width: 600px)': {
      flexDirection: 'row-reverse',
      margin: 0,
      padding: '10px 20px',
    },
  },
  listContainer: {
    marginTop: '16px',
    '@media (max-width: 600px)': {
      paddingLeft: '10px',
      paddingRight: '20px',
    },
  },
  itemTitle: {
    color: 'black',
    display: 'list-item',
    listStyleType: 'disc',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '26px',
    marginLeft: '16px',
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },
  itemDescription: {
    color: 'black',
    fontWeight: 300,
    lineHeight: '26px',
  },
  link: {
    textDecoration: 'underline',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    color: '#0059B7',
  },
};

// Medtigo Full Course Access Plan Card
export const FullAccessPlanCard = React.memo(({ handleBuyPlan }) => {
    return (
      <Grid container p={{xs: 1.5, sm: 2}} style={styles.card}>
        <Grid size={{ sm: 12, md: 6 }}>
          <img src={FullAccessPlanImage} alt="Medtigo Full Access Plan" style={{width: '100%'}}/>
        </Grid>
        <Grid size={{ sm: 12, md: 6 }} sx={{ pl: {xs: 0, sm: 2}, pr: {xs: 0, sm: 2} }}>
          <Box sx={styles.title}>
            medtigo Full Access Plan
          </Box>
          <Box sx={styles.discountContainer}>
            <Box sx={styles.price}>$100</Box>
            <Box sx={{ ...styles.discountText, ...styles.discountAmount }}>
              $280
            </Box>
            <Box sx={{ ...styles.discountText, ...styles.discountPercentage }}>
              70% off
            </Box>
          </Box>
          <Box sx={styles.subscriptionText}>
            The medtigo Annual Subscription includes the following:
          </Box>
          <Box sx={styles.detailText}>
            These activities include CME/CE credits certified by the Accreditation Council for Continuing Medical Education (ACCME) provided by TeamHealth Institute.
          </Box>
          <Box sx={styles.listContainer}>
            {FullAccessPlanInfo.map((item, index) => (
              <Box key={index} mb={2}>
                <Box sx={styles.itemTitle}>
                  {item.title}
                  <span style={styles.itemDescription}>
                    {item.description}
                  </span>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={styles.buyNowButtonContainer}>
            <Button variant="contained" onClick={handleBuyPlan} startIcon={<BuyIcon />} >
              BUY NOW
            </Button>
            <Link style={styles.link} onClick={handleBuyPlan}>
              ADD TO CART
            </Link>
          </Box>
        </Grid>
      </Grid>
    )
})

FullAccessPlanCard.displayName = "FullAccessPlanCard"

// Divider
export const DividerText = () => {
    return (
      <Grid size={12} sx={{ position: 'relative', py: 1 }}>
        <Divider style={{ background: '#A9A9A9' }} />
        <Typography
          style={{
            position: 'absolute',
            fontSize: '24px',
            fontWeight: 600,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            color: '#1E1E1E',
            paddingInline: '12px'
          }}
        >
          OR
        </Typography>
    </Grid>
    )
}
