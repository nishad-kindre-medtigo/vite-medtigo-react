import React, { useState, useEffect } from 'react';
import { Box, Backdrop } from '@mui/material';
import { useBuyPlan } from 'src/hooks/useBuyPlan';
import { Loader } from '../../ui/Progress';

const data = {
  BLS: {
    plan: 19981,
    image: '/images/carousel/Bls.png',
  },
  ACLS: {
    plan: 19986,
    image: '/images/carousel/Acls.png',
  },
  PALS: {
    plan: 19984,
    image: '/images/carousel/Pals.png',
  },
};

const images = Object.keys(data);

const CarouselContainer = ({ children }) => (
  <Box
    sx={{
      position: 'relative',
      width: { xs: '90vw', sm: '700px' },
      minHeight: { xs: '41px', sm: '86px' },
      margin: 'auto',
      paddingTop: '0.5rem',
    }}
  >
    {children}
  </Box>
);

const CarouselImage = ({ src, alt }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{
      width: '100%',
      objectFit: 'cover',
      cursor: 'pointer',
      borderRadius: '2px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      transition: 'filter 0.3s ease-in-out',
      '&:hover': {
        filter: 'brightness(1.2) saturate(1.3)', // Brighten and increase saturation on hover
      },
    }}
  />
);


const DotContainer = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      bottom: { xs: '10px', sm: '12px' },
      width: '100%',
      gap: '8px',
    }}
  >
    {children}
  </Box>
);

const Dot = ({ active, onClick }) => (
  <Box
    sx={{
      height: { xs: '4px', sm: '8px' },
      width: { xs: '4px', sm: '8px' },
      borderRadius: '50%',
      backgroundColor: active ? '#2872C1' : '#E5E5E5',
      transition: 'background-color 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#1E4E87',
      },
    }}
    onClick={onClick}
  />
);

const Carousel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { buyPlan, isLoading, setIsLoading } = useBuyPlan();  

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % images.length);
  };

  const handleImageClick = () => {
    const currentItem = images[activeStep];
    const { plan } = data[currentItem];
    setIsLoading(true);
    buyPlan(plan);
  };

  return (
    <CarouselContainer>
      <Box onClick={handleImageClick}>
        <CarouselImage
          src={data[images[activeStep]].image}
          alt={images[activeStep]}
        />
      </Box>
      <DotContainer>
        {images.map((_, index) => (
          <Dot key={index} active={index === activeStep} onClick={() => setActiveStep(index)} />
        ))}
      </DotContainer>
      <Backdrop open={isLoading} style={{ zIndex: 1300, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Loader />
        <h3 style={{ marginTop: '10px', fontSize: '20px' }}>Redirecting to medtigo Store...</h3>
      </Backdrop>
    </CarouselContainer>
  );
};

export default Carousel;
