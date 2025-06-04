import React, {
  useState,
  useRef,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  GlobalStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider,} from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import eSignatureService from '../../services/esignatureService';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { jsPDF } from 'jspdf';
import dayjs from 'dayjs';
import 'jspdf/dist/polyfills.es.js';
import { useSnackbar } from "notistack";
import SignatureCanvas from "react-signature-canvas";
import {ConsentDialog} from './ConsentDialog';
import './fonts.css';
import { useSelector } from "react-redux";
import { Slide } from '@mui/material';  
import SendForSignatureComponent from "./SendForSignatureComponent";
import HistoryPage from "./HistoryPage";
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from 'react-router-dom';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const AddSignatureComponent = ({ pdf }) => {
  const theme = useTheme();
  const maxWidthRef = useRef(0);
  const maxSignatureWidthRef = useRef(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  const canvasContainerRef = useRef(null);
  const canvasRefs = useRef([]);
  const [numPages, setNumPages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null); 
  const [signatureAddedCount, setSignatureAddedCount] = useState(0);
  const [filledSignaturePlaceholders, setFilledSignaturePlaceholders] = useState(new Set());
  const [selectedFont, setSelectedFont] = useState("Dancing Script");
  const [clickPosition, setClickPosition] = useState({ clickX: 0, clickY: 0 });
  const [nameAddedCount, setNameAddedCount] = useState(0);
  const [filledNamePlaceholders, setFilledNamePlaceholders] = useState(new Set());
  const [dateAddedCount, setDateAddedCount] = useState(0);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);
  const [filledDatePlaceholders, setFilledDatePlaceholders] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [digitalSignature, setDigitalSignature] = useState(""); // Store text digital signature
  const [signatureImage, setSignatureImage] = useState(null); // Store image signature
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state for text signature
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false); // Track canvas visibility
  const [canvasSignature, setCanvasSignature] = useState(null); // Store canvas signature
  const [open, setOpen] = useState(false);
  const sigCanvasRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [PlaceHolder, setPlaceHolder] = useState(null);
  const [currentDatePlaceholder, setDatePlaceholder] = useState(null);
  const [ctxValSignature, setCTXSignature] = useState(null);
  const [ctxDate, setCtxDate] = useState(null);
  const [signaturePositions, setSignaturePositions] = useState([]);
  const [datePositions, setDatePositions] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [currentdate, setCurrentDate] = useState(null);
  const [openDatePicker, setDatePicker] = useState(false); // For controlling DatePicker open state
  const [pdfUrl, setPdfUrl] = useState(null);
  const penCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="black" height="24" viewBox="0 0 24 24" width="24"><path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0L15 5.24 18.76 9l1.96-1.96c.39-.39.39-1.02-.01-1.41zm-3.64 4.24L10.07 17H7v-3.07l7-7 3.07 3.07zm-3.64 9.12H5v-5.06L15.07 5l5.06 5.06L10.07 19z"/></svg>') 0 0, auto`;
  const datePickerRef = useRef(null); // Reference for the DatePicker
  //const pdfRef = useRef(null);
  const [senderEmail, setSenderEmail] = useState('');
const [recipientEmail, setRecipientEmail] = useState('');
const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
const [nameInput, setNameInput] = useState("");
const [nameError, setNameError] = useState(false);
const [nameErrorMessage, setNameErrorMessage] = useState('');
const [signatureErrorMessage, setSignatureErrorMessage] = useState('');
const [namePlaceHolder, setNamePlaceHolder] = useState(null);
const [ctxName, setCtxName] = useState(null);
const [fullnamePositions, setFullnamePositions] = useState([]);
const [senderID, setSenderID] = useState(null);
const [isVisible, setIsVisible] = useState(true);
const [showSendForSignature, setShowSendForSignature] = useState(false);
const { enqueueSnackbar } = useSnackbar();
const [errorMessage, setErrorMessage] = useState('');
const [coordinateCounts, setCoordinateCounts] = useState({
  dateCount: 0,
  fullnameCount: 0,
  signatureCount: 0
});

const [coordinateStatus, setCoordinateStatus] = useState({
  dateCoordinates: false,
  fullnameCoordinates: false,
  signatureCoordinates: false
});

const navigate = useNavigate();
  const { user } = useSelector((state) => state.account);
  const [tabValue, setTabValue] = React.useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    
    // Check if it's Safari but NOT Chrome on iOS or desktop
    const isSafari = (
      userAgent.indexOf("Safari") !== -1 &&
      userAgent.indexOf("Chrome") === -1 && // Exclude Chrome on desktop
      userAgent.indexOf("CriOS") === -1 &&  // Exclude Chrome on iOS
      userAgent.indexOf("Edg") === -1 &&    // Exclude Edge
      userAgent.indexOf("OPR") === -1       // Exclude Opera
    );
    
    // Only show notification for Safari users
    if (isSafari) {
      enqueueSnackbar('For the better experience, we recommend using Chrome.', {
        variant: 'warning',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 5000,
        TransitionComponent: Slide,
        TransitionProps: {
          timeout: {
            enter: 500,
            exit: 500,
          },
        },
      });
    }
  }, [enqueueSnackbar]);

     const handleSignatureChange = (e) => {
      const value = e.target.value;
   
      // Reset errors initially
      setError(false);
      setSignatureErrorMessage('');  
   
      // Check length
      if (value.length > 25) {
        setError(true);
        setSignatureErrorMessage('Signature cannot exceed 25 characters');
        setDigitalSignature(value.slice(0, 25)); // Restrict input length
        return;
      }
   
      setDigitalSignature(value);
   };
   
  

    useEffect(() => {
      const container = document.querySelector('.pdfCont');
      if (!container) return;
  
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        
        // Check if at top
        if (scrollTop === 0) {
          setIsAtTop(true);
        } else {
          setIsAtTop(false);
        }
  
        // Check if at bottom
        if (scrollHeight - scrollTop === clientHeight) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
  
        // Prevent scroll when at boundaries
        if (isAtTop && scrollTop < 0) {
          container.scrollTop = 0;
        }
        
        if (isAtBottom && scrollTop + clientHeight > scrollHeight) {
          container.scrollTop = scrollHeight - clientHeight;
        }
      };
  
      container.addEventListener('scroll', handleScroll);
      
      // Initial check
      handleScroll();
  
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }, [isAtTop, isAtBottom]);

    const handleNameChange = (e) => {
      const value = e.target.value;
    
      // Reset errors initially
      setNameError(false);
      setNameErrorMessage('');
    
      // Check for numbers
      if (/[0-9]/.test(value)) {
        setNameError(true);
        setNameErrorMessage('Numbers are not allowed in the name!');
        return;
      }
    
      // Check for special characters (excluding spaces)
      if (/[^a-zA-Z\s'-]/.test(value)) {
        setNameError(true);
        setNameErrorMessage("Full Name should only contain letters and spaces");
        return;
      }
      
    
      // Check length
      if (value.length > 25) {
        setNameError(true);
        setNameErrorMessage('Name cannot exceed 25 characters');
        setNameInput(value.slice(0, 25)); // Restrict input length
        return;
      }
    
      setNameInput(value);
   };
   
    

  const fonts = [
    {
      value: 'WindSong',
      label: 'WindSong',
      style: "'WindSong', cursive",
      cssImport: "@import url('https://fonts.googleapis.com/css2?family=Windsong&display=swap');"
    }, 
    {
      value: 'Signatie',
      label: 'Signatie',
      style: "'Signatie', cursive",
      cssImport: "@font-face { font-family: 'Signatie'; src: url('/fonts/signatie.regular.otf') format('opentype'); font-weight: normal; font-style: normal; }"
    },
    {
      value: 'Petemoss',
      label: 'Petemoss',
      style: "'Petemoss', sans-serif",
      cssImport: "@import url('https://fonts.googleapis.com/css2?family=Petemoss&display=swap');"
    },   
  ];
  

  const injectFontImports = (fonts) => {
    fonts.forEach((font) => {
      const style = document.createElement('style');
      style.innerHTML = font.cssImport;
      document.head.appendChild(style);
    });
  };
  
  useEffect(() => {
    injectFontImports(fonts);
  }, []);

  const fontStyles = fonts.map(font => font.cssImport).join('\n');
  const urlParams = new URLSearchParams(window.location.search);
  const signatureID = urlParams.get("id");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchAllData(urlParams.get("id")); 
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [signatureID]); // This runs only once, on mount

  useEffect(() => {
    if (dataFetched) {
      handleOpenPDF();
    }
  }, [dataFetched]); 

  useEffect(() => {
    if (canvasSignature) {
      handleSaveCanvasSignature();
    }
  }, [canvasSignature]);
  useEffect(() => {
  }, [signaturePositions]);
  
  useEffect(() => {
  }, [datePositions]);


  useEffect(() => {
    if (signatureImage) {
      handleAddSignature();
    }
  }, [signatureImage]);

  useEffect(() => {
    const preloadFonts = async () => {
      const fontPromises = fonts.map((font) => {
        if (font.cssImport.includes('https://fonts.googleapis.com')) {
          // For Google Fonts
          const fontFamily = font.value.replace(/\s+/g, '+');
          const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap`;
          
          // Check if the font is already imported
          if (!document.querySelector(`link[href="${fontUrl}"]`)) {
            const fontLink = document.createElement('link');
            fontLink.href = fontUrl;
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
          }
  
          return document.fonts.load(`20px "${font.value}"`);
        } else {
          // For Custom Fonts (e.g., BastilgaOne, Signatie)
          const fontFamily = font.value;
          const fontFace = new FontFace(fontFamily, `url(/fonts/${fontFamily.toLowerCase().replace(/\s+/g, '-')}.regular.otf)`);
  
          // Load the custom font
          return fontFace.load().then(() => {
            document.fonts.add(fontFace);
          });
        }
      });
  
      try {
        await Promise.all(fontPromises);
      } catch (err) {
        console.error('Error preloading fonts:', err);
      }
    };
  
    preloadFonts();
  }, []);

useEffect(() => {
  if (isDialogOpen) {
    setDigitalSignature(""); 
  }
}, [isDialogOpen]);

useEffect(() => {
  if (openDatePicker) {
    document.addEventListener("mousedown", handleClickOutside);
  }
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [openDatePicker]);

const getCanvasSize = (canvas) => {
  return canvas.toDataURL('image/png').length * 0.75; // Convert base64 to approximate byte size
};
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


    async function fetchAllData(signatureID) {
      try {
        const data = await eSignatureService.getSignature(signatureID);
        processAllData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    
    const handleFinish = () => {
      // This will hide ConsentDialog and show SendForSignatureComponent
      setShowSendForSignature(true);
      setIsVisible(false);

      navigate('/e-sign/history');
    };

    if (!isVisible && showSendForSignature) {
      return <HistoryPage openHistoryFromPreview={true} initialTab="received"/>;
    }

    const countCoordinates = (coordinates) => {
      if (!coordinates) return 0;
      try {
        const coords = JSON.parse(coordinates);
        return Array.isArray(coords) ? coords.length : 0;
      } catch (e) {
        console.error("Error parsing coordinates:", e);
        return 0;
      }
    };
    const processAllData = async (data) => {
      try {
        // Check create flag first and redirect if false
        if (!data?.data?.data?.create) {
          window.location.href = '/signed';
          return;
        }
    
        // Validate the nested data structure
        if (!data?.data?.data) {
          console.error("Invalid data structure:", data);
          return;
        }
    
        // Extract the inner data object and maintain compatibility with both structures
        const innerData = data.data.data;
        const {
          id,
          filepath: rawFilePath,
          note,
          recipientEmail,
          recipientName,
          dateCoordinates = '[]',
          fullnameCoordinates = '[]',
          signatureCoordinates = '[]',
          senderID,
          recipientID,
          senderEmail,
        } = innerData;
    
        setSenderID(senderID);
        const counts = {
          dateCount: countCoordinates(dateCoordinates),
          fullnameCount: countCoordinates(fullnameCoordinates),
          signatureCount: countCoordinates(signatureCoordinates)
        };

       
        
        const coordinateStatus = {
          dateCoordinates: counts.dateCount > 0,
          fullnameCoordinates: counts.fullnameCount > 0,
          signatureCoordinates: counts.signatureCount > 0
        };
        
        const allCoordinatesEmpty = Object.values(coordinateStatus).every(status => status === false);
        
        if (allCoordinatesEmpty) {
          console.warn("Warning: All coordinate positions are empty");
        }
    
        Object.entries(coordinateStatus).forEach(([key, status]) => {
          if (!status) {
            console.warn(`No coordinates found for: ${key}`);
          }
        });
    
        setCoordinateCounts(counts);
        setCoordinateStatus(coordinateStatus);
        setRecipientEmail(recipientEmail);
    
        const processCoordinates = (coordString) => {
          if (!coordString) return [];
          
          try {
              const coords = JSON.parse(coordString);
              return Array.isArray(coords) ? coords.map(coord => ({
                  pageNum: parseInt(coord.canvasId) || 1,
                  xPercent: parseFloat(coord.xPercent) || 0,
                  yPercent: parseFloat(coord.yPercent) || 0,
                  width: parseFloat(coord.width) || 0,
                  height: parseFloat(coord.height) || 0
              })) : [];
          } catch (e) {
              console.error("Error parsing coordinates:", e);
              return [];
          }
      };
    

        
        const processedSignatureCoords = processCoordinates(signatureCoordinates);
        const processedDateCoords = processCoordinates(dateCoordinates);
        const processedFullnameCoords = processCoordinates(fullnameCoordinates);
    
        const baseUrl = 'https://dev.medtigo.com/';
        // const baseUrl = 'http://localhost:8080/';
        const cleanFilePath = rawFilePath.startsWith('/') ? rawFilePath.slice(1) : rawFilePath;
        const fullPdfUrl = baseUrl + cleanFilePath;
        
        setPdfUrl(fullPdfUrl);
        setSignaturePositions(processedSignatureCoords);
        setDatePositions(processedDateCoords);
        setFullnamePositions(processedFullnameCoords);
    
        try {
          const pdfDoc = await pdfjsLib.getDocument(fullPdfUrl).promise;
    
          setTimeout(() => {
            // Draw signature placeholders
            processedSignatureCoords.forEach((coord, index) => {
              const canvas = canvasRefs.current[coord.pageNum - 1];
              if (canvas) {
                const ctx = canvas.getContext('2d');
                drawTextBox(ctx, "Sign Here", coord.x, coord.y, coord.w, coord.h);
              } else {
                console.warn(`Canvas not found for signature on page ${coord.pageNum}`);
              }
            });
    
            // Draw date placeholders
            processedDateCoords.forEach((coord, index) => {
              const canvas = canvasRefs.current[coord.pageNum - 1];
              if (canvas) {
                const ctx = canvas.getContext('2d');
                drawTextBox(ctx, "Date Here", coord.x, coord.y, coord.w, coord.h);
              } else {
                console.warn(`Canvas not found for date on page ${coord.pageNum}`);
              }
            });
    
            // Draw fullname placeholders
            processedFullnameCoords.forEach((coord, index) => {
              const canvas = canvasRefs.current[coord.pageNum - 1];
              if (canvas) {
                const ctx = canvas.getContext('2d');
                drawTextBox(ctx, "Name Here", coord.x, coord.y, coord.w, coord.h);
              } else {
                console.warn(`Canvas not found for fullname on page ${coord.pageNum}`);
              }
            });
            
            // If no coordinates are present, add default signature box on first page
            if (allCoordinatesEmpty) {
              const firstPageCanvas = canvasRefs.current[0];
              if (firstPageCanvas) {
                const ctx = firstPageCanvas.getContext('2d');
                const defaultPosition = {
                  x: firstPageCanvas.width * 0.7,
                  y: firstPageCanvas.height * 0.8,
                  w: 250,
                  h: 80
                };
                drawTextBox(ctx, "Sign Here", defaultPosition.x, defaultPosition.y, 
                           defaultPosition.w, defaultPosition.h);
              }
            }
            
          }, 1000);
    
        } catch (error) {
          console.error("Error loading PDF:", error, {
            url: fullPdfUrl,
            error: error.message,
            stack: error.stack
          });
        }
      } catch (error) {
        console.error("Error processing data:", error, {
          error: error.message,
          stack: error.stack
        });
      }
    };
 

  const handleClickOutside = (event) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
      handleCloseDatePicker(); // Close the DatePicker if clicked outside
    }
  };
  const stopPropagation = (event) => {
    event.stopPropagation();
  };

 const handleDownloadPDF = async (returnBlob = false) => {
     if (numPages.length === 0) {
       return null;
     }

 
     const pdfDoc = new jsPDF({
       compress: true // Enable compression
     });
   
     let totalSize = 0;
     // Process all canvases
     for (let i = 0; i < canvasRefs.current.length; i++) {
       const canvas = canvasRefs.current[i];
       
       // Create a temporary canvas with reduced size
       const tempCanvas = document.createElement('canvas');
       const ctx = tempCanvas.getContext('2d');
       
       // Set smaller dimensions (72 DPI is typically sufficient for documents)
       const scale = 1.0; // Reduce scale to 72 DPI
       tempCanvas.width = canvas.width * scale;
       tempCanvas.height = canvas.height * scale;
       
       // Draw original canvas content onto smaller canvas
       ctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
       
       // Convert to JPEG instead of PNG, with moderate quality
       const imgData = tempCanvas.toDataURL('image/png', 0.8);
       const pageSize = imgData.length * 0.75;
       totalSize += pageSize;
       
 
       // Calculate dimensions for the image in the PDF
       const imgWidth = pdfDoc.internal.pageSize.getWidth();
       const imgHeight = (tempCanvas.height * imgWidth) / tempCanvas.width;
   
       if (i > 0) {
         pdfDoc.addPage();
       }
       pdfDoc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
     }
 
     const finalPdfBlob = pdfDoc.output('blob');
   
     if (returnBlob) {
       return pdfDoc.output('blob');
     } else {
       pdfDoc.save("edited_pdf.pdf");
     }
   };



   // Run this effect only when `openDatePicker` changes

   const handleOpenPDF = async () => {
    if (!pdfUrl || !canvasContainerRef.current) return;
  
    const container = canvasContainerRef.current;
    container.innerHTML = "";
    canvasRefs.current = [];
  
    // Get the container width
    const containerWidth = container.clientWidth || window.innerWidth;
    const isMobile = window.innerWidth <= 768;
  
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const fileSizeInBytes = blob.size;
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
  
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdfDoc = await loadingTask.promise;
      canvasRefs.current = new Array(pdfDoc.numPages).fill(null);
      setNumPages(pdfDoc.numPages);
  
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const pageContainer = document.createElement("div");
        pageContainer.style.position = "relative";
        pageContainer.style.border = isMobile ? "" :"20px solid #F8F8F8";
        pageContainer.style.borderBottom = isMobile ? "10px solid #F8F8F8" :"";
        pageContainer.style.width = "100%";
        pageContainer.setAttribute("data-page", pageNum);
  
        const canvas = document.createElement("canvas");
        canvas.setAttribute("data-id", pageNum);
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvasRefs.current[pageNum - 1] = canvas;
        drawPlaceholders(canvas, pageNum);
  
        pageContainer.appendChild(canvas);
        container.appendChild(pageContainer);
      }
  
      // Eager load first 25 pages
      const eagerLoadPromises = [];
      for (let pageNum = 1; pageNum <= Math.min(25, pdfDoc.numPages); pageNum++) {
        eagerLoadPromises.push(renderPage(pdfDoc, pageNum, isMobile));
      }
      await Promise.all(eagerLoadPromises);
  
      if (pdfDoc.numPages > 25) {
        const observer = new IntersectionObserver(
          async (entries, observer) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const pageNum = parseInt(entry.target.getAttribute("data-page"));
                const canvas = canvasRefs.current[pageNum - 1];
                if (!canvas.getAttribute("data-rendered")) {
                  await renderPage(pdfDoc, pageNum, isMobile);
                  observer.unobserve(entry.target);
                }
              }
            }
          },
          { root: null, rootMargin: "100px", threshold: 0.1 }
        );
  
        container.querySelectorAll("[data-page]").forEach(pageContainer => {
          const pageNum = parseInt(pageContainer.getAttribute("data-page"));
          if (pageNum > 25) {
            observer.observe(pageContainer);
          }
        });
      }
  
      setPdfLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setIsLoading(false);
    }
  };

// Helper function to draw placeholders
const drawPlaceholders = (canvas, pageNum) => {
  if (!canvas) {
      console.warn('Canvas not available for drawing placeholders');
      return;
  }
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
      console.warn('Could not get canvas context');
      return;
  }

  // Ensure canvas is properly sized
  if (!canvas.width || !canvas.height) {
      console.warn('Canvas dimensions not set');
      return;
  }
  
  // Draw signature placeholders
  signaturePositions.forEach(pos => {
      if (parseInt(pos.pageNum) === parseInt(pageNum)) {
          drawTextBox(
              ctx,
              "Sign Here",
              {
                  xPercent: pos.xPercent,
                  yPercent: pos.yPercent,
                  width: pos.width,
                  height: pos.height
              },
              canvas
          );
      }
  });

  // Draw date placeholders
  datePositions.forEach(pos => {
      if (parseInt(pos.pageNum) === parseInt(pageNum)) {
          drawTextBox(
              ctx,
              "Date Here",
              {
                  xPercent: pos.xPercent,
                  yPercent: pos.yPercent,
                  width: pos.width,
                  height: pos.height
              },
              canvas
          );
      }
  });

  // Draw fullname placeholders
  fullnamePositions.forEach(pos => {
      if (parseInt(pos.pageNum) === parseInt(pageNum)) {
          drawTextBox(
              ctx,
              "Name Here",
              {
                  xPercent: pos.xPercent,
                  yPercent: pos.yPercent,
                  width: pos.width,
                  height: pos.height
              },
              canvas
          );
      }
  });
};

// Helper function to render a single page
const renderPage = async (pdfDoc, pageNum) => {
  try {
    const canvas = canvasRefs.current[pageNum - 1];
    if (!canvas) {
      console.error('Canvas not found for page', pageNum);
      return;
    }

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.2 });
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');
    
    // Render PDF page
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    // Draw placeholders immediately after rendering
    [signaturePositions, datePositions, fullnamePositions].forEach((positions, index) => {
      if (positions?.length > 0) {
        positions.forEach(pos => {
          if (pos.pageNum === pageNum) {
            const placeholderText = index === 0 ? "Sign Here" : 
                                  index === 1 ? "Date Here" : 
                                  "Name Here";
            
            const coordinates = {
              xPercent: pos.xPercent,
              yPercent: pos.yPercent,
              width: pos.width,
              height: pos.height
            };
            
            drawTextBox(context, placeholderText, coordinates, canvas);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error rendering page:', error);
  }
};



  const LoadingOverlay = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} />
      <Box sx={{ mt: 2, fontSize: "1.2rem", color: "text.primary" }}>
        Loading document...
      </Box>
    </Box>
  );


  let textBoxCount = 0;
  
  const drawTextBox = (ctx, text, coordinates, canvas) => {
    if (!ctx || !text || !coordinates || !canvas) {
        console.warn('Missing required parameters for drawTextBox');
        return;
    }

    // Calculate exact coordinates
    const x = (coordinates.xPercent / 100) * canvas.width;
    const y = (coordinates.yPercent / 100) * canvas.height;
    
    // Set dimensions based on device type
    const w =  coordinates.width;  // Same width for both
    const h =  coordinates.height;    // Same height for both


    // Save the current context state
    ctx.save();

    // Draw background
    ctx.fillStyle = '#EBF5FF';
    ctx.fillRect(x, y, w, h);

    // Set text styles with dynamic font size
    const fontSize = isMobile ? '12px' : '16px';
    ctx.font = `500 ${fontSize} Arial`;
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw the text in the center of the box
    ctx.fillText(text, x + w/2, y + h/2);

    ctx.restore();
};

  
const handleClickCanvas = event => {
  const element = event.target;
  if (!element || element.tagName.toLowerCase() !== "canvas") {
      return;
  }

  try {
      const canvas = element;
      const canvasId = parseInt(canvas.getAttribute("data-id") || "1");
      
      setCurrentPage(canvasId);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
          console.error("Unable to get canvas context");
          return;
      }

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      // Helper function to check if click is within box
      const isClickInBox = (pos, canvasId) => {
          const posX = (pos.xPercent / 100) * canvas.width;
          const posY = (pos.yPercent / 100) * canvas.height;
          const posW = pos.width;
          const posH = pos.height;

          return (
              parseInt(pos.pageNum) === canvasId &&
              clickX >= posX &&
              clickX <= posX + posW &&
              clickY >= posY &&
              clickY <= posY + posH
          );
      };

      // Check signature positions with debugging
      if (Array.isArray(signaturePositions) && signaturePositions.length > 0) {
          signaturePositions.forEach((pos, index) => {
              if (isClickInBox(pos, canvasId)) {

                  
                  setPlaceHolder(pos);
                  setCTXSignature(ctx);
                  setClickPosition({ clickX, clickY });
                  
                  // Verify state updates
                  setTimeout(() => {
                  }, 0);
                  
                  handleClickOpen();
              }
          });
      }

      // Check date positions with debugging
      if (Array.isArray(datePositions) && datePositions.length > 0) {
        datePositions.forEach((pos) => {
            if (isClickInBox(pos, canvasId)) {
                setDatePlaceholder(pos);
                setCtxDate(ctx);
                setClickPosition({ clickX, clickY });
                handleOpenDatePicker();
            }
        });
    }

      // Check fullname positions with debugging
      if (Array.isArray(fullnamePositions) && fullnamePositions.length > 0) {
          fullnamePositions.forEach((pos, index) => {
              if (isClickInBox(pos, canvasId)) {
                  
                  setNamePlaceHolder(pos);
                  setCtxName(ctx);
                  setClickPosition({ clickX, clickY });
                  
                  // Verify state updates
                  setTimeout(() => {
                  }, 0);
                  
                  handleOpenNameDialog();
              }
          });
      }

  } catch (error) {
      console.error('Error in handleClickCanvas:', error);
  }
};

  const handleOpenNameDialog = () => {
    setNameInput("");
    setIsNameDialogOpen(true);
  };

  const handleCloseNameDialog = () => {
    setIsNameDialogOpen(false);
  };

  const drawName = (ctx, placeholder, name, maxWidthRef) => {
    const canvas = ctx.canvas;

    // Ensure width and height are correctly calculated
    const x = (placeholder.xPercent / 100) * canvas.width;
    const y = (placeholder.yPercent / 100) * canvas.height;
    
    // Minimum width from placeholder
    const minWidth = placeholder.width;

    // Set font size dynamically
    const fontSize = isMobile ? 12 : 16;
    ctx.font = `${fontSize}px Arial`;

    // Measure text width and set dynamic width
    const textWidth = ctx.measureText(name).width;
    const padding = 10; // Extra padding around text
    let dynamicWidth = textWidth + padding * 2;

    // Ensure the width never shrinks below the minimum width
    dynamicWidth = Math.max(dynamicWidth, minWidth);

    // Get the maximum width from previous text to clear properly
    const maxWidth = Math.max(dynamicWidth, maxWidthRef.current || minWidth);
    maxWidthRef.current = maxWidth; // Save the max width for future use


    // Clear the entire max width area to prevent overlapping
    ctx.save();
    ctx.clearRect(x, y, maxWidth, placeholder.height);

    // Draw text
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, x + dynamicWidth / 2, y + placeholder.height / 2);

    ctx.restore();
};






const handleAddName = () => {
  if (!nameInput.trim()) {
    enqueueSnackbar("Name cannot be empty!", { variant: "warning" });
    return;
  }

  if (/\d/.test(nameInput)) {
    enqueueSnackbar("Numbers are not allowed in the name!", { variant: "error" });
    return;
  }

  if (namePlaceHolder && ctxName) {
    try {
      drawName(ctxName, namePlaceHolder, nameInput, maxWidthRef);
      
      const placeholderKey = `${namePlaceHolder.xPercent}_${namePlaceHolder.yPercent}_${namePlaceHolder.pageNum}`;
      
      setFilledNamePlaceholders(prev => {
        const newSet = new Set(prev);
        if (!newSet.has(placeholderKey)) {
          newSet.add(placeholderKey);
          setNameAddedCount(newSet.size);
        }
        return newSet;
      });

      handleCloseNameDialog();
    } catch (error) {
      console.error("Error handling name addition:", error);
    }
  }
};

  
  
  //Function to iterate through all date coordinates
  const updateDatePlaceholdersOneByOne = async (newDate) => {
    for (const coord of datePositions) {
      const placeholderKey = `${coord.xPercent}_${coord.yPercent}_${coord.pageNum}`;
      if (filledDatePlaceholders.has(placeholderKey)) {
        continue;
      }
  
      setDatePlaceholder(coord);
      await new Promise(resolve => setTimeout(resolve, 100));
  
      setFilledDatePlaceholders((prev) => {
        const newSet = new Set(prev);
        newSet.add(placeholderKey);
        return newSet;
      });
      setDateAddedCount((prev) => prev + 1);
  
      updateAllDates(newDate);
  
      drawDateAtPosition(newDate, coord);
    }
  };
  
  

  const updateAllDates = (newDate) => {
    datePositions.forEach((coord) => {
      drawDateAtPosition(newDate, coord);
    });
  };

  // UseEffect to react to currentDatePlaceholder changes


  const drawDateAtPosition = (date, placeholder) => {
    const canvas = canvasRefs.current[placeholder.pageNum - 1];
    const context = canvas.getContext("2d");
  
    // Calculate exact coordinates from percentages
    const x = (placeholder.xPercent / 100) * canvas.width;
    const y = (placeholder.yPercent / 100) * canvas.height;
    const w = placeholder.width;
    const h = placeholder.height;
  
    // Clear the exact placeholder area
    context.clearRect(x, y, w, h);
  
    // Set font size based on device and placeholder size
    const baseFontSize = isMobile ? 12 : 16;
    let fontSize = `${baseFontSize}px`;
    
    // Draw the new text while ensuring it fits within the placeholder
    context.font = `${fontSize} Arial`;
    let textWidth = context.measureText(date).width;
    
    // If text is too wide, reduce font size until it fits
    if (textWidth > w - 10) { // 10px padding
      const ratio = (w - 10) / textWidth;
      const newSize = Math.floor(baseFontSize * ratio);
      fontSize = `${Math.max(8, newSize)}px`; // Don't go smaller than 8px
      context.font = `${fontSize} Arial`;
      textWidth = context.measureText(date).width;
    }
    
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
  
    // Draw text at exact center of box
    context.fillText(date, x + w/2, y + h/2);
  
    // Update the filled dates count only for new entries
    const placeholderKey = `${placeholder.xPercent}_${placeholder.yPercent}_${placeholder.pageNum}`;
    if (!filledDatePlaceholders.has(placeholderKey)) {
      setFilledDatePlaceholders(prev => {
        const newSet = new Set(prev);
        newSet.add(placeholderKey);
        return newSet;
      });
      setDateAddedCount(prev => prev + 1);
    }
  };


  // Function to draw signature (you need to implement this)
  const drawSignature = (ctx, placeholder, signature) => {
    if (!ctx || !placeholder || !signature) return;

    const canvas = ctx.canvas;
    const x = (placeholder.xPercent / 100) * canvas.width;
    const y = (placeholder.yPercent / 100) * canvas.height;
    let w = placeholder.width;
    let h = placeholder.height;

    ctx.save();
    ctx.clearRect(x, y, w, h);

    if (signature instanceof Image) {
        // Handle image signatures (drawn or uploaded)
        const scale = Math.min(w / signature.width, h / signature.height);
        const newWidth = signature.width * scale;
        const newHeight = signature.height * scale;
        const imageX = x + (w - newWidth) / 2;
        const imageY = y + (h - newHeight) / 2;
        
        ctx.drawImage(signature, imageX, imageY, newWidth, newHeight);
    } else if (typeof signature === "string") {
        const fontFamily = selectedFont.replace(/\s+/g, '+');
        const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap`;

        if (!document.querySelector(`link[href="${fontUrl}"]`)) {
            const fontLink = document.createElement('link');
            fontLink.href = fontUrl;
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
        }

        document.fonts.load(`700 17px "${selectedFont}"`).then(() => {
            let fontSize = 17; // Default font size
            ctx.font = `700 ${fontSize}px "${selectedFont}"`;
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let textMetrics = ctx.measureText(signature);
            let textWidth = textMetrics.width;
            let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

            // Adjust font size if text is too big
            while (textWidth > w - 10 || textHeight > h - 10) {
                fontSize -= 1;
                ctx.font = `700 ${fontSize}px "${selectedFont}"`;
                textMetrics = ctx.measureText(signature);
                textWidth = textMetrics.width;
                textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
            }

            ctx.fillText(signature, x + w / 2, y + h / 2);
        }).catch(err => {
            console.error("Error loading font:", err);
        });
    }

    ctx.restore();
};


  const handleClickOpen = () => {
    setDigitalSignature("");
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  // ADD TEXT SIGNATURESS
 const handleAddDigitalSignature = async () => {
  const canvas = canvasRefs.current[currentPage - 1];
  const context = canvas.getContext("2d");

  const fontFamily = selectedFont.replace(/\s+/g, '+');
  const fontWeight = "700";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${fontWeight}&display=swap`;

  if (!document.querySelector(`link[href="${fontUrl}"]`)) {
    const fontLink = document.createElement('link');
    fontLink.href = fontUrl;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }

  try {
    await document.fonts.load(`${fontWeight} 20px "${selectedFont}"`);
    drawSignature(ctxValSignature, PlaceHolder, digitalSignature);
    
    const placeholderKey = `${PlaceHolder.xPercent}_${PlaceHolder.yPercent}_${PlaceHolder.pageNum}`;
    
   setFilledSignaturePlaceholders(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(placeholderKey)) {
        newSet.add(placeholderKey);
        setSignatureAddedCount(newSet.size); // Use the set's size for accuracy
      }
      return newSet;
    });
  } catch (err) {
    console.error('Error loading font:', err);
  }
};


const handleImageSignatureChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    if (file.size > 1 * 1024 * 1024) {
      enqueueSnackbar("The file size must not exceed 1 MB. Please upload a smaller file.", {
        variant: "warning",
      });
      return; // Exit the function to prevent further processing
    }

    const reader = new FileReader();

    // FileReader reads the file content asynchronously
    reader.onload = () => {
      setPreviewImage(reader.result);// Store the image's data URL in state
    const placeholderKey = `${PlaceHolder.xPercent}_${PlaceHolder.yPercent}_${PlaceHolder.pageNum}`;


      setFilledSignaturePlaceholders((prev) => {
        const newSet = new Set(prev); // Use a Set to prevent duplicate placeholders
        if (!newSet.has(placeholderKey)) {
          newSet.add(placeholderKey); // Add the new placeholder key
          setSignatureAddedCount(newSet.size); // Update the count with the Set's size
        }
        return newSet;
      }); // Store the preview image URL
    };

    reader.readAsDataURL(file); // Read the file as a data URL for preview
  }
};

const handleRemoveImage = () => {
  setPreviewImage(null); // Remove the preview image
};

const handleUploadImage = () => {
  if (!previewImage || !ctxValSignature || !PlaceHolder) return;
  
  const img = new Image();
  img.src = previewImage;
  
  img.onload = () => {
    
    drawSignature(ctxValSignature, PlaceHolder, img);
    
    // Update placeholder tracking
    const placeholderKey = `${PlaceHolder.xPercent}_${PlaceHolder.yPercent}_${PlaceHolder.pageNum}`;
    setFilledSignaturePlaceholders(prev => {
  const newSet = new Set(prev);
 if (!newSet.has(placeholderKey)) {
 newSet.add(placeholderKey);
 setSignatureAddedCount(newSet.size);
 }
 return newSet;
});
    
    handleClose();
  };
  
  setPreviewImage(null);
};


  const handleAddSignature = () => {
    const canvas = canvasRefs.current[currentPage - 1];
    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = signatureImage;
    img.onload = () => {

      drawSignature(
        ctxValSignature,
        PlaceHolder.x,
        PlaceHolder.y,
        PlaceHolder.w,
        PlaceHolder.h,
        img
      );
      handleClose(); // Draw the image signature
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  };

  const DrawSignature = () => {
    if (!sigCanvasRef.current) return;
    
    const signatureDataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
    const img = new Image();
    img.src = signatureDataUrl;
    
    img.onload = () => {
      if (ctxValSignature && PlaceHolder) {
        drawSignature(ctxValSignature, PlaceHolder, img);
        
        // Update placeholder tracking
        const placeholderKey = `${PlaceHolder.xPercent}_${PlaceHolder.yPercent}_${PlaceHolder.pageNum}`;
        
        setFilledSignaturePlaceholders(prev => {

          const newSet = new Set(prev);
    
          if (!newSet.has(placeholderKey)) {
    
            newSet.add(placeholderKey);
            setSignatureAddedCount(newSet.size);
          }
          return newSet;
        });
      }
    };
    
    setCanvasSignature(signatureDataUrl);
    setShowSignatureCanvas(false);
  };

  const handleSaveCanvasSignature = () => {
    const canvas = canvasRefs.current[currentPage - 1];
    const context = canvas.getContext("2d");
    setCTXSignature(context);
    const img = new Image();
    img.src = canvasSignature;
    img.onload = () => {
      drawSignature(
        ctxValSignature,
        PlaceHolder.x,
        PlaceHolder.y,
        PlaceHolder.w,
        PlaceHolder.h,
        img
      );
    };
    img.onerror = (error) => {
      console.error("Error loading canvas signature:", error);
    };
  };

  const handleOpenDatePicker = () => {
    setDatePicker(true);
    //setCurrentDate(newValue);
  };

  // Handle closing of DatePicker
  const handleCloseDatePicker = () => {
    setDatePicker(false);
  };

  return (
    <>
     {isLoading && <LoadingOverlay />}
     {isVisible ? (
          <>
            <ConsentDialog
      handleDownloadPDF={handleDownloadPDF}
      signatureID={signatureID}
      senderID={senderID}
      pdfFilename="edited_pdf.pdf"
      senderEmail={senderEmail}
      recipientEmail={recipientEmail}
      signatureAddedCount={signatureAddedCount}
      dateAddedCount={dateAddedCount}
      nameAddedCount={nameAddedCount}
      coordinateCounts={coordinateCounts}
      onFinish={handleFinish}  // Passing onFinish to hide the dialog
    />
          </>
        ) : (
          <>
            {/* Only show when isVisible is false */}
            <HistoryPage openHistoryFromPreview={true} initialTab="received"/>
          </>
        )}
        
        {isVisible && (
          <Box>
     <GlobalStyles
  styles={{
    ".pdfCont": {
      WebkitOverflowScrolling: 'touch',
      overflowX: 'auto',  
      whiteSpace: "nowrap",
      display: "block",
      maxWidth: '100%', // Added to contain the content
      ...(isMobile && {
        maxHeight: '80vh',
        overflowX: "scroll",
        width: "100%", // Changed from minWidth to width
      })
    },
    ".pdfCont::-webkit-scrollbar": {
      width: "0px",
      height: "4px",
    },
    ".pdfCont::-webkit-scrollbar-thumb": {
      background: "rgba(136, 136, 136, 0.5)",
      borderRadius: "2px",
    },
    ".pdfCont::-webkit-scrollbar-thumb:hover": {
      background: "rgba(85, 85, 85, 0.7)",
    },
    ".pdfCont::-webkit-scrollbar-track": {
      background: "rgba(241, 241, 241, 0.5)",
    },
    ".pdfCont::-webkit-scrollbar-track:horizontal": {
      height: "4px",
    },
    ".pdfCont::-webkit-scrollbar-thumb:horizontal": {
      borderRadius: "2px",
      background: "rgba(136, 136, 136, 0.5)",
    },
    ".pdfCont::-webkit-scrollbar-thumb:horizontal:hover": {
      background: "rgba(85, 85, 85, 0.7)",
    }
  }}
/>

      <Box>
      <Box 
  elevation={3} 
  style={{ 
    padding: isMobile ? '8px' : '24px',
        margin: '0 auto',
        backgroundColor: "#F8F8F8",
        maxWidth: isMobile ? '100%' : '',
        position: 'relative', // Added for proper containment
        overflow: 'hidden'
  }}
>
  <Grid
    container
    spacing={isMobile ? 1 : 2}
    justifyContent="space-between"
    alignItems="center"
    style={{ marginBottom: isMobile ? '8px' : '16px' }}
  >
  </Grid>

  <div 
    className="pdfCont" 
    style={{
      WebkitOverflowScrolling: 'touch',
      overflowX: 'auto',
      position: 'relative', // Added for proper containment
      ...(isMobile && {
        overflowY: 'auto',
        maxHeight: '80vh',
      }),
    }}
  >
    <Box
      style={{
        marginBottom: '16px',
        display: "flex",
        justifyContent: isMobile ? "" : "center",
        position: 'relative',
        width: '100%' 
      }}
    >
      <Box
       ref={canvasContainerRef}
       style={{
         marginTop: "20px",
         backgroundColor: "white",
         width: isMobile ? "max-content" : "max-content",
       }}
       onClick={handleClickCanvas}
      />


<LocalizationProvider dateAdapter={AdapterDayjs}>
  {openDatePicker && (
    <Dialog
      open={openDatePicker}
      onClose={handleCloseDatePicker}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          position: isMobile ? "fixed" : "absolute",
          backgroundColor: "white",
          border: "1px solid #ccc",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          borderRadius: "8px",
          padding: "16px",
          width: "fit-content",
          maxWidth: "320px",
          minWidth: "280px",
        },
      }}
    >
      <DialogTitle style={{ padding: "0 16px" }}>Pick a Date</DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        <DateCalendar
          value={currentdate || dayjs()}
          onChange={(newValue) => {
            if (newValue && newValue.isValid()) {
              setCurrentDate(newValue);
              const formattedDate = newValue.format("MMMM D, YYYY");
              handleCloseDatePicker();
              // Only update the currently selected date placeholder
              if (currentDatePlaceholder) {
                drawDateAtPosition(formattedDate, currentDatePlaceholder);
              }
            } else {
              console.error('Selected date is invalid:', newValue);
            }
          }}
          maxDate={dayjs()} // This disables all future dates
          sx={{
            width: '100%',
            height: '324px',
          }}
        />
      </DialogContent>
    </Dialog>
  )}
</LocalizationProvider>
    </Box>
  </div>
</Box>
        <div>
        {/* <FontLoader /> */}
        <Dialog open={open} onClose={handleClose}>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered style={{backgroundColor:'#DFEEFF'}} TabIndicatorProps={{
          style: {
            backgroundColor: '#2872C1',  // Custom active tab indicator color
          },
        }}>
            <Tab label="TYPE"  style={{
            fontWeight: tabValue === 0 ? 600 : 400,
            transition: 'all 0.3s ease',
          }} />
            <Tab label="DRAW" style={{
            fontWeight: tabValue === 1 ? 600 : 400,
            transition: 'all 0.3s ease'
          }} />
            <Tab label="UPLOAD" style={{
            fontWeight: tabValue === 2 ? 600 : 400,
            transition: 'all 0.3s ease',
          }}/>
          </Tabs>

        {tabValue === 0 && (
           <div>
           <DialogContent>
           <Box sx={{ mx: 'auto', width: { xs: '100%', sm: '430px' } }}>
               <Typography style={{ fontSize: '20px', marginBottom:'10px' }}>Signature</Typography>
               <TextField
  fullWidth
  label="Your Signature"
  variant="outlined"
  value={digitalSignature}
  onChange={handleSignatureChange}
  sx={{
    mb: 3,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#DFDFDF', // Set border color
      },
      '&:hover fieldset': {
        borderColor: '#DFDFDF', // Set border color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2872C1', // Set border color when focused
      },
    },
  }}
  error={error} // Show error state
  helperText={error ? signatureErrorMessage : ''}
/>


     
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                 {fonts.map((font) => (
                   <Paper
                     key={font.value}
                     elevation={0}
                     sx={{
                       fontFamily: selectedFont === font.value ? font.value : 'inherit',
                       borderBottom: selectedFont === font.value ? '1px solid #DFDFDF' : '1px solid #DFDFDF',
                       borderRadius: 0,
                       transition: 'all 0.2s ease',
                     }}
                   >
                     <Box
                       sx={{
                         display: 'flex',
                         alignItems: 'center',
                         width: '100%',
                         gap: 2,
                         backgroundColor: selectedFont === font.value ? '#f5f5f5' : 'transparent', // Highlight selected font
                         cursor: 'pointer',
                       }}
                     >
                       <Checkbox
                         checked={selectedFont === font.value}
                         onChange={() => setSelectedFont(font.value)}
                         color="primary"
                       />
                       <Box
                         component="span"
                         sx={{
                           fontSize: '24px',
                           fontFamily: `${font.style}, sans-serif !important`,
                           flexGrow: 1,
                           color: '#000',
                           fontWeight: '700',
                         }}
                         onClick={() => setSelectedFont(font.value)}
                       >
                         {digitalSignature || 'Your Signature'}
                       </Box>
                     </Box>
                   </Paper>
                 ))}
               </Box>
             </Box>
           </DialogContent>
     
           <DialogActions style={{paddingTop:'0px', paddingBottom:'24px', paddingLeft:'24px', paddingRight:'24px'}}>
             <Button variant="outlined" onClick={handleClose} style={{marginRight:'5px',textTransform:'none'}}>
               Cancel
             </Button>
             <Button
               variant="contained"
               color="primary"
               onClick={() => {
                 handleAddDigitalSignature();
                 handleClose();
               }}
               disabled={!digitalSignature}
               style={{textTransform:'none', padding:'5px 32px',}}
             >
               Add 
             </Button>
           </DialogActions>
         </div>
            )}
            
          {tabValue === 2 && (
            <div>
          <DialogContent style={{ padding: '20px', paddingBottom: '0' }}>
        <Box
          style={{
            backgroundColor: '#F1F1F1',
            width: isMobile ? '100%' : '435px',
            height: '300px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {previewImage ? (
            <Box
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  padding: '20px',
                }}
              />
            </Box>
          ) : (
            <Typography
              style={{
                padding: '14px',
                fontSize: '16px',
                fontWeight: 400,
                letterSpacing: '0.04em',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Note:
              </span>{' '}
              Kindly upload the signature image, ensuring that the file size does not exceed 1 MB.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        style={{
          padding: '20px',
          display: 'flex',
          gap: '10px',
          flexDirection: isMobile ? 'row' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
        }}
      >
        <Button variant="outlined" onClick={handleClose} style={{ textTransform: 'none' }}>
          Cancel
        </Button>
        {!previewImage ? (
          <Button
            variant="contained"
            component="label"
            color="primary"
            style={{ textTransform: 'none' }}
          >
            Choose
            <input type="file" accept="image/*" hidden onChange={handleImageSignatureChange} />
          </Button>
        ) : (
          <>
            <Button
              onClick={handleRemoveImage}
              variant="outlined"
              style={{ textTransform: 'none', padding: '5px 15px' }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ textTransform: 'none', marginRight: isMobile ? '0' : '3px' }}
              onClick={handleUploadImage}
            >
              Upload
            </Button>
          </>
        )}
      </DialogActions>
          </div>
          )}

          {tabValue === 1 && (
         <div>
         <DialogContent style={{ paddingBottom: "0px" }}>
  <SignatureCanvas
    ref={sigCanvasRef}
    penColor="black"
    penWidth={15}
    canvasProps={{
      width: 430,
      height: 300,
      style: {
        cursor: penCursor,
        background: "#F1F1F1",
        width: "100%", // This makes it responsive
        maxWidth: "430px", // Maximum width
        height: "300px", // Fixed height
      },
    }}
  />
</DialogContent>
           <DialogActions
             style={{
               paddingTop: "14px",
               paddingBottom: isMobile ? "15px" : "20px", // Adjust padding for mobile
             }}
           >
             <Button
               variant="outlined"
               onClick={handleClose}
               style={{
                 textTransform: "none",
                 marginRight: isMobile ? "2px" : "5px", // Adjust margin for mobile
               }}
             >
               Cancel
             </Button>
             <Button
               variant="contained"
               onClick={() => {
                 DrawSignature();
                 handleClose();
               }}
               style={{
                 marginRight: isMobile ? "15px" : "15px",
                 textTransform: "none",
                 padding:'5px 32px',
               }}
             >
               Add
             </Button>
           </DialogActions>
         </div>
          )}
    </Dialog>
        </div>
        <Dialog 
      open={isNameDialogOpen} 
      onClose={handleCloseNameDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          width: isMobile ? '95%' : isTablet ? '80%' : '600px',
          margin: isMobile ? '16px' : '32px',
        }
      }}
    >
      <DialogTitle 
        style={{
          backgroundColor: '#DFEEFF',
          padding: isMobile ? '16px' : '20px',
          fontSize: isMobile ? '18px' : '20px'
        }}
      >
        Enter Your Name
      </DialogTitle>

      <DialogContent 
        style={{
          paddingTop: '10px',
          padding: isMobile ? '16px' : '24px'
        }}
      >
        <TextField
  autoFocus
  margin="dense"
  label="Full Name"
  variant="outlined"
  value={nameInput}
  onChange={handleNameChange}
  error={nameError}
  helperText={nameError ? nameErrorMessage : ''}
  style={{
    width: '100%',
  }}
  InputProps={{
    style: {
      fontSize: isMobile ? '14px' : '16px'
    }
  }}
  InputLabelProps={{
    style: {
      fontSize: isMobile ? '14px' : '16px'
    }
  }}
/>

      </DialogContent>

      <DialogActions 
        style={{
          padding: isMobile ? '16px' : '0px 20px 25px 20px',
          gap: isMobile ? '8px' : '0'
        }}
      >
        <Button 
          variant="outlined" 
          onClick={handleCloseNameDialog} 
          style={{ 
            marginRight: isMobile ? '0' : '8px',
            width: isMobile ? '100%' : 'auto',
            // order: isMobile ? 2 : 1,
            borderRadius:'2px',
            textTransform:'none'
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddName} 
          style={{ 
            marginRight: isMobile ? '0' : '3px',
            width: isMobile ? '100%' : 'auto',
            // order: isMobile ? 1 : 2,
            marginLeft: isMobile ? '0px' : '0px',
            textTransform:'none',
            borderRadius:'2px'
          }}
        >
          Save Name
        </Button>
      </DialogActions>
    </Dialog>
      </Box>
      </Box>
        )}
    </>
  );
};

export default AddSignatureComponent;
