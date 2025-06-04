import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Box, Backdrop } from "@mui/material";
import { Loader } from "src/ui/Progress";
import { useBuyPlan } from "src/hooks/useBuyPlan";

const data = {
  BLS: {
    plan: 19981,
    image: "/images/carousel/Bls.png",
  },
  ACLS: {
    plan: 19986,
    image: "/images/carousel/Acls.png",
  },
  PALS: {
    plan: 19984,
    image: "/images/carousel/Pals.png",
  },
};

// Memoized static arrays to prevent recreation on each render
const images = Object.keys(data);
const imageUrls = images.map((key) => data[key].image);

// Preload all images to prevent network calls during carousel transitions
const preloadImages = () => {
  imageUrls.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

// Memoized style objects to prevent recreation
const carouselContainerStyles = {
  position: "relative",
  width: { xs: "90vw", sm: "700px" },
  minHeight: { xs: "41px", sm: "86px" },
  margin: "auto",
  paddingTop: "0.5rem",
};

const carouselImageStyles = {
  width: "100%",
  objectFit: "cover",
  cursor: "pointer",
  borderRadius: "2px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  transition: "filter 0.3s ease-in-out",
  "&:hover": {
    filter: "brightness(1.2) saturate(1.3)",
  },
};

const hiddenImageStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  objectFit: "cover",
  borderRadius: "2px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  opacity: 0,
  pointerEvents: "none",
  zIndex: -1,
};

const dotContainerStyles = {
  display: "flex",
  justifyContent: "center",
  position: "absolute",
  bottom: { xs: "10px", sm: "12px" },
  width: "100%",
  gap: "8px",
};

const getDotStyles = (active) => ({
  height: { xs: "4px", sm: "8px" },
  width: { xs: "4px", sm: "8px" },
  borderRadius: "50%",
  backgroundColor: active ? "#2872C1" : "#E5E5E5",
  transition: "background-color 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#1E4E87",
  },
});

const backdropStyles = {
  zIndex: 1300,
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const loadingTextStyles = {
  marginTop: "10px",
  fontSize: "20px",
};

// Memoized components to prevent unnecessary re-renders
const CarouselContainer = React.memo(({ children }) => (
  <Box sx={carouselContainerStyles}>{children}</Box>
));

// Optimized image container that preloads all images
const CarouselImages = React.memo(({ activeIndex, onClick }) => {
  return (
    <Box sx={{ position: "relative" }} onClick={onClick}>
      {/* Render all images but only show the active one */}
      {imageUrls.map((src, index) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt={images[index]}
          sx={{
            ...carouselImageStyles,
            ...(index !== activeIndex ? hiddenImageStyles : {}),
            opacity: index === activeIndex ? 1 : 0,
            zIndex: index === activeIndex ? 1 : -1,
          }}
        />
      ))}
    </Box>
  );
});

const DotContainer = React.memo(({ children }) => (
  <Box sx={dotContainerStyles}>{children}</Box>
));

const Dot = React.memo(({ active, onClick }) => (
  <Box sx={getDotStyles(active)} onClick={onClick} />
));

const Carousel = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { buyPlan, isLoading, setIsLoading } = useBuyPlan();
  const intervalRef = useRef(null);
  const preloadedRef = useRef(false);

  // Preload images on component mount
  useEffect(() => {
    if (!preloadedRef.current) {
      preloadImages();
      preloadedRef.current = true;
    }
  }, []);

  // Memoized handlers to prevent recreation on each render
  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % images.length);
  }, []);

  const handleImageClick = useCallback(() => {
    const currentItem = images[activeStep];
    const { plan } = data[currentItem];
    setIsLoading(true);
    buyPlan(plan);
  }, [activeStep, buyPlan, setIsLoading]);

  const handleDotClick = useCallback((index) => {
    setActiveStep(index);
  }, []);

  // Optimized effect with proper cleanup
  useEffect(() => {
    intervalRef.current = setInterval(handleNext, 5000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [handleNext]);

  // Memoized dot handlers to prevent recreation
  const dotClickHandlers = useMemo(
    () => images.map((_, index) => () => handleDotClick(index)),
    [handleDotClick]
  );

  return (
    <CarouselContainer>
      <CarouselImages activeIndex={activeStep} onClick={handleImageClick} />
      <DotContainer>
        {images.map((_, index) => (
          <Dot
            key={index}
            active={index === activeStep}
            onClick={dotClickHandlers[index]}
          />
        ))}
      </DotContainer>
      <Backdrop open={isLoading} style={backdropStyles}>
        <Loader />
        <h3 style={loadingTextStyles}>Redirecting to medtigo Store...</h3>
      </Backdrop>
    </CarouselContainer>
  );
};

export default Carousel;
