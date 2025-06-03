import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  GlobalStyles,
  Tooltip,
  useTheme, useMediaQuery
} from "@mui/material";
import ConfirmationDialog from "./ConfirmationDialog";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'; // Correct import
import SendForSignatureComponent from "./SendForSignatureComponent";
import { useOpenSnackbar } from "../../hooks/useOpenSnackbar"
import { useSelector } from "react-redux";
import HistoryPage from "./HistoryPage";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const calendaricon = "/icons/esign/calendaricon.svg"
const PenIcon = "/icons/esign/penesign.svg"
const peoplewitheditIcon = "/icons/esign/peoplewitheditIcon.svg"

const buttonStyle = {
  marginRight: '8px',
  border: '1px dashed #1C5087',
  borderRadius: '2px',
  color: '#1C5087',
  cursor: 'move',
  padding: '6px 14px',
  backgroundColor: 'transparent', 
  position: 'relative', 
};

const PDFPreviewComponent = ({
  pdf,
  email,
  title,
  name,
  note,
  fileName,
  file,
  callMyFunction,
  onGoBack
}) => {
  const canvasContainerRef = useRef(null);
  const scrollInterval = useRef(null);
const scrollSpeed = 10;
const scrollThreshold = 150;
  const canvasRefs = useRef([]);
  const ctxRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const pdfContainerRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [fullName, setFullName] = useState("");
  const [showSendForSignature, setShowSendForSignature] = useState(false);
  const [showSendBackSignature, setShowSendBackSignature] = useState(false);
  const [date, setDate] = useState("");
  const [signature, setSignature] = useState("");
  const [pageNum, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [digitalSignature, setDigitalSignature] = useState(""); // Store text digital signature
  const [canvasSignature, setCanvasSignature] = useState(null); // Store canvas signature
  const [clickPosition, setClickPosition] = useState(null); // Store the click position for signature
  const [totalFields, setTotalFields] = useState(0);
  const [signaturePositions, setSignaturPos] = useState([]);
  const [NamePositions, setNamePos] = useState([]);
  const [datePositions, setDatePos] = useState([]);
  const openSnackbar = useOpenSnackbar();
  const { user } = useSelector((state) => state.account);
  const[xVal,setXval] =useState(null);
  const[yVal,setYval] =useState(null);
  const[widthBox,setWidthBox] =useState(null);
  const[heightBox,setHeightBox] =useState(null);
  const [senderID,setSenderID] = useState(user.id);
  const senderEmail = user?.email;
  const senderName = user?.first_name +" " + user?.last_name;
  const [disabled, setDisabled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const isMobileTest = /Mobi|Android/i.test(navigator.userAgent);  // Simple device detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return {
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
      isMobile: /iphone|ipad|ipod|android|mobile/.test(userAgent),
      userAgent
    };
  };
  const device = detectDevice();
 
 

  const handleTouchStart = () => {
    if (isMobileTest) setOpen(true); // Only open tooltip on mobile
  };

  const handleTouchEnd = () => {
    if (isMobileTest) setOpen(false); // Only close tooltip on mobile
  };
  const buttonStyle = {
    marginRight: isMobile ? '4px' : '8px',
    marginBottom: isMobile ? '8px' : '0',
    border: '1px dashed #1C5087',
    borderRadius: '2px',
    color: '#1C5087',
    cursor: 'move',
    padding: isMobile ? '4px 8px' : '6px 14px',
    backgroundColor: 'transparent',
    position: 'relative',
    fontSize: isMobile ? '12px' : '14px',
    width: isMobile ? '100%' : 'auto',
  };

  const actionButtonStyle = {
    marginRight: '8px',
    borderRadius: '2px',
    width: isMobile ? '100%' : 'auto',
    marginBottom: isMobile ? '8px' : '0',
  };

  useEffect(() => {
    const total = signaturePositions.length + datePositions.length + NamePositions.length;
    setTotalFields(total);
  }, [signaturePositions, datePositions, NamePositions]);

  useEffect(() => {
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    handleOpenPDF();
  }, []);


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

  const handleconfirmClick = async () => {
    if (disabled) return;
    setDisabled(true);
  
    try {
      await callMyFunction(
        note,
        name,
        senderName,
        senderID,
        senderEmail,
        email,
        file,
        datePositions.map(pos => ({
          ...pos,
          xPercent: pos.xPercent,
          yPercent: pos.yPercent
        })),
        NamePositions.map(pos => ({
          ...pos,
          xPercent: pos.xPercent,
          yPercent: pos.yPercent
        })),
        signaturePositions.map(pos => ({
          ...pos,
          xPercent: pos.xPercent,
          yPercent: pos.yPercent
        })),
        true,
        title
      );
  
      openSnackbar('Signature created successfully!!', 'success');
      setOpenDialog(false);
      setShowSendForSignature(true);
    } catch (err) {
      console.error('Error in handleConfirmClick:', err);
  
      if (err?.message === 'Recipient not found') {
        openSnackbar('The recipient is not registered on our platform.', 'error');
      } else {
        openSnackbar('Failed to save signature. Please try again.', 'error');
      }
      setDisabled(false);
    }
  };


  const handleSendClick = () => {
    setOpenDialog(true);  
  };


  const handleDragOverWithScroll = (e) => {
    e.preventDefault();
    handleDrag(e);
  };

  const handleSendBackSignature = () => {
    setShowSendBackSignature(true);
  };

  if (showSendForSignature) {
    return <HistoryPage openHistoryFromPreview={true} initialTab="sent"/>;
  }

  if (showSendBackSignature) {
    return <SendForSignatureComponent/>;
  }

  const handleOpenPDF = async () => {
  
    if (!pdf || !canvasContainerRef.current) {
      console.error("PDF or containerRef is missing");
      return;
    }
  
    const container = canvasContainerRef.current;
    container.innerHTML = "";
    canvasRefs.current = [];
  
    // Get the container width
    const containerWidth = container.clientWidth || window.innerWidth;
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        
        // Calculate scale to fit width
        const viewportOriginal = page.getViewport({ scale: 1.2 });
        const scale = isMobile ? 
          (containerWidth / viewportOriginal.width) * 0.95 : // 95% of screen width on mobile
          1.2; // Original scale for desktop
        
        const viewport = page.getViewport({ scale });
  
        const pageContainer = document.createElement("div");
        pageContainer.style.position = "relative";
        pageContainer.style.margin = isMobile ? "10px 0" : "0";
        pageContainer.style.width = "100%";
        pageContainer.style.border = isMobile ? "10px solid #F8F8F8": "10px solid #F8F8F8";  // Add spacing between pages
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
  
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.setAttribute("data-id", pageNum);
  
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
  
        await page.render(renderContext).promise;
        canvasRefs.current[pageNum - 1] = canvas;
        setNumPages(pageNum);
  
        pageContainer.appendChild(canvas);
        container.appendChild(pageContainer);
      } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
      }
    }
  };

  const handleDrag = (e) => {
    const container = document.querySelector('.pdfCont');
    if (!container) return;
  
    const containerRect = container.getBoundingClientRect();
    const mouseY = e.clientY;
  
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  
    const distanceFromTop = mouseY - containerRect.top;
    const distanceFromBottom = containerRect.bottom - mouseY;
  
    if (distanceFromTop < scrollThreshold) {
      scrollInterval.current = setInterval(() => {
        container.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
      }, 16);
    } else if (distanceFromBottom < scrollThreshold) {
      scrollInterval.current = setInterval(() => {
        container.scrollBy({ top: scrollSpeed, behavior: 'auto' });
      }, 16);
    }
  };

  const handleDragEnd = (event, type) => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
    handleDrop(event);
  };

  const handleDragStart = (type) => {
    setDragging(type);
    setXval(null);
    setYval(null);
    setWidthBox(null);
    setHeightBox(null);
  };

 function generateUniqueId() {
  return 'box_' + Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


function drawTextBoxAbs(
  text, xPercent, yPercent, boxId, removeSignatureData, onPositionUpdate
) {
  const device = detectDevice();
  const div = document.createElement("div");
  div.setAttribute('data-box-id', boxId);

  div.style.position = "absolute";
  div.style.zIndex = "999";
  div.style.cursor = "move";
  div.style.userSelect = "none";
  div.style.WebkitUserSelect = "none";
  div.style.touchAction = "none";

  const contentDiv = document.createElement("div");
  contentDiv.style.backgroundColor = "#EBF5FF";
  contentDiv.style.color = "black";
  contentDiv.style.font = device.isMobile ? "500 12px Arial": "500 16px Arial";
  contentDiv.style.textAlign = "center";
  contentDiv.style.display = "flex";
  contentDiv.style.alignItems = "center";
  contentDiv.style.justifyContent = "center";
  contentDiv.style.minWidth = device.isMobile ? "100px" : "160px";
  contentDiv.style.minHeight = device.isMobile ? "30px" : "40px";
  contentDiv.style.position = "relative";
  contentDiv.textContent = text;

  // Create resize handles
  const corners = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map(position => {
    const handle = document.createElement('div');
    handle.className = `resize-handle ${position}`;
    handle.style.position = 'absolute';
    handle.style.width = device.isMobile ? '12px' : '8px';
    handle.style.height = device.isMobile ? '12px' : '8px';
    handle.style.backgroundColor = '#4A90E2';
    handle.style.border = '1px solid #2171CC';
    handle.style.borderRadius = '50%';
    handle.style.zIndex = '1000';
    handle.style.touchAction = 'none';
    handle.style.display = 'none';

    switch(position) {
      case 'nw':
        handle.style.top = '-4px';
        handle.style.left = '-4px';
        handle.style.cursor = 'nw-resize';
        break;
      case 'ne':
        handle.style.top = '-4px';
        handle.style.right = '-4px';
        handle.style.cursor = 'ne-resize';
        break;
      case 'sw':
        handle.style.bottom = '-4px';
        handle.style.left = '-4px';
        handle.style.cursor = 'sw-resize';
        break;
      case 'se':
        handle.style.bottom = '-4px';
        handle.style.right = '-4px';
        handle.style.cursor = 'se-resize';
        break;
      case 'n':
        handle.style.top = '-4px';
        handle.style.left = '50%';
        handle.style.transform = 'translateX(-50%)';
        handle.style.cursor = 'n-resize';
        break;
      case 's':
        handle.style.bottom = '-4px';
        handle.style.left = '50%';
        handle.style.transform = 'translateX(-50%)';
        handle.style.cursor = 's-resize';
        break;
      case 'e':
        handle.style.right = '-4px';
        handle.style.top = '50%';
        handle.style.transform = 'translateY(-50%)';
        handle.style.cursor = 'e-resize';
        break;
      case 'w':
        handle.style.left = '-4px';
        handle.style.top = '50%';
        handle.style.transform = 'translateY(-50%)';
        handle.style.cursor = 'w-resize';
        break;
    }

    return handle;
  });

  corners.forEach(handle => contentDiv.appendChild(handle));

  const closeIcon = document.createElement("span");
  closeIcon.textContent = "×";
  closeIcon.style.position = "absolute";
  closeIcon.style.top = "-9px";
  closeIcon.style.right = "5px";
  closeIcon.style.cursor = "pointer";
  closeIcon.style.color = "red";
  closeIcon.style.fontSize = "26px";
  closeIcon.style.display = "none";
  closeIcon.style.backgroundColor = "white";
  closeIcon.style.borderRadius = "50%";
  closeIcon.style.width = "20px";
  closeIcon.style.height = "20px";
  closeIcon.style.lineHeight = "20px";
  closeIcon.style.textAlign = "center";
  closeIcon.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  closeIcon.style.touchAction = "manipulation";
  closeIcon.style.zIndex = "1001";

  let closeIconTimeout;

  function handleCloseClick(event) {
    event.preventDefault();
    event.stopPropagation();
    removeSignatureData(boxId);
    div.remove();
  }

  function showHandles() {
    corners.forEach(handle => handle.style.display = 'block');
  }

  function hideHandles() {
    corners.forEach(handle => handle.style.display = 'none');
  }

  function constrainPosition(left, top, width, height, containerRect) {
    // Make sure we don't position elements outside the canvas boundaries
    const maxX = containerRect.width - width;
    const maxY = containerRect.height - height;
    
    // Ensure minimum positions are at least 0
    const constrainedLeft = Math.max(0, Math.min(maxX, left));
    const constrainedTop = Math.max(0, Math.min(maxY, top));
    
    // If maxX or maxY is negative (element larger than container), keep element at 0
    return {
      left: maxX < 0 ? 0 : constrainedLeft,
      top: maxY < 0 ? 0 : constrainedTop
    };
  }

  function handleResize(e, handle) {
    e.preventDefault();
    e.stopPropagation();

    const canvas = div.parentElement.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const startWidth = contentDiv.offsetWidth;
    const startHeight = contentDiv.offsetHeight;
    const startLeft = div.offsetLeft;
    const startTop = div.offsetTop;
    const position = handle.className.split(' ')[1];

    function onMove(moveEvent) {
      moveEvent.preventDefault();
      
      const currentX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const dx = currentX - startX;
      const dy = currentY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      switch(position) {
        case 'se':
          newWidth = Math.max(startWidth + dx, device.isMobile ? 80 : 160);
          newHeight = Math.max(startHeight + dy, device.isMobile ? 20 : 40);
          break;
        case 'sw':
          newWidth = Math.max(startWidth - dx, device.isMobile ? 80 : 160);
          newHeight = Math.max(startHeight + dy, device.isMobile ? 20 : 40);
          newLeft = startLeft + dx;
          break;
        case 'ne':
          newWidth = Math.max(startWidth + dx, device.isMobile ? 80 : 160);
          newHeight = Math.max(startHeight - dy, device.isMobile ? 20 : 40);
          newTop = startTop + dy;
          break;
        case 'nw':
          newWidth = Math.max(startWidth - dx, device.isMobile ? 80 : 160);
          newHeight = Math.max(startHeight - dy, device.isMobile ? 20 : 40);
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          break;
        case 'n':
          newHeight = Math.max(startHeight - dy, device.isMobile ? 20 : 40);
          newTop = startTop + dy;
          break;
        case 's':
          newHeight = Math.max(startHeight + dy, device.isMobile ? 20 : 40);
          break;
        case 'e':
          newWidth = Math.max(startWidth + dx, device.isMobile ? 80 : 160);
          break;
        case 'w':
          newWidth = Math.max(startWidth - dx, device.isMobile ? 80 : 160);
          newLeft = startLeft + dx;
          break;
      }

      // Apply constraints
      const constrained = constrainPosition(newLeft, newTop, newWidth, newHeight, rect);
      newLeft = constrained.left;
      newTop = constrained.top;

      // Update element style
      contentDiv.style.width = `${newWidth}px`;
      contentDiv.style.height = `${newHeight}px`;
      div.style.left = `${newLeft}px`;
      div.style.top = `${newTop}px`;

      xPercent = (newLeft / rect.width) * 100;
      yPercent = (newTop / rect.height) * 100;

      if (onPositionUpdate) {
        onPositionUpdate(boxId, { 
          xPercent, 
          yPercent,
          width: newWidth,
          height: newHeight
        });
      }
    }

    function onEnd() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  }

  corners.forEach(handle => {
    if (device.isMobile) {
      handle.addEventListener('touchstart', (e) => handleResize(e, handle), { passive: false });
    } else {
      handle.addEventListener('mousedown', (e) => handleResize(e, handle));
    }
  });

  function handleMouseDrag(event) {
    if (event.target === closeIcon) return;
    event.preventDefault();
    
    const canvas = div.parentElement.querySelector("canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const startX = event.clientX - div.offsetLeft;
    const startY = event.clientY - div.offsetTop;

    function onMouseMove(e) {
      const newLeft = e.clientX - startX;
      const newTop = e.clientY - startY;
      
      const constrained = constrainPosition(newLeft, newTop, div.offsetWidth, div.offsetHeight, rect);
      
      div.style.left = `${constrained.left}px`;
      div.style.top = `${constrained.top}px`;
      
      xPercent = (parseInt(div.style.left) / rect.width) * 100;
      yPercent = (parseInt(div.style.top) / rect.height) * 100;
      
      if (onPositionUpdate) {
        onPositionUpdate(boxId, { xPercent, yPercent });
      }
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function handleTouchDrag(event) {
    if (event.target === closeIcon) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    const canvas = div.parentElement.querySelector("canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const startX = touch.clientX - div.offsetLeft;
    const startY = touch.clientY - div.offsetTop;

    function onTouchMove(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const newLeft = touch.clientX - startX;
      const newTop = touch.clientY - startY;
      
      const constrained = constrainPosition(newLeft, newTop, div.offsetWidth, div.offsetHeight, rect);
      
      div.style.left = `${constrained.left}px`;
      div.style.top = `${constrained.top}px`;
      
      xPercent = (parseInt(div.style.left) / rect.width) * 100;
      yPercent = (parseInt(div.style.top) / rect.height) * 100;
      
      if (onPositionUpdate) {
        onPositionUpdate(boxId, { xPercent, yPercent });
      }
    }

    function onTouchEnd() {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    }

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }

  // Event listeners for showing/hiding handles and close icon
  if (device.isMobile) {
    div.addEventListener("touchstart", () => {
      if (closeIconTimeout) clearTimeout(closeIconTimeout);
      closeIcon.style.display = "block";
      showHandles();
      closeIconTimeout = setTimeout(() => {
        closeIcon.style.display = "none";
        hideHandles();
      }, 3000);
    });
    
    div.addEventListener("touchstart", handleTouchDrag, { passive: false });
  } else {
    div.addEventListener("mousedown", handleMouseDrag);
    
    div.addEventListener("mouseenter", () => {
      closeIcon.style.display = "block";
      showHandles();
    });
    
    div.addEventListener("mouseleave", () => {
      if (!contentDiv.contains(document.activeElement)) {
        closeIcon.style.display = "none";
        hideHandles();
      }
    });
  }

  closeIcon.addEventListener("click", handleCloseClick);
  closeIcon.addEventListener("touchend", handleCloseClick);

  function updatePosition(canvas) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const left = (xPercent / 100) * rect.width;
    const top = (yPercent / 100) * rect.height;
    
    const constrained = constrainPosition(left, top, div.offsetWidth, div.offsetHeight, rect);
    div.style.left = `${constrained.left}px`;
    div.style.top = `${constrained.top}px`;
  }

  // Handle window resize
  const debouncedResize = debounce(() => {
    const canvas = div.parentElement.querySelector("canvas");
    updatePosition(canvas);
  }, 16);

  window.addEventListener("resize", debouncedResize);

  div.appendChild(contentDiv);
  div.appendChild(closeIcon);
  document.body.appendChild(div);
  updatePosition(div.parentElement.querySelector("canvas"));

  return div;
}


const handleDrop = (event) => {
  event.preventDefault();

  let clientX, clientY;
  if (event.type === 'touchend') {
    const touch = event.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const dropTarget = document.elementFromPoint(clientX, clientY);
  if (!dropTarget || !dropTarget.closest('canvas')) {
    return;
  }

  const canvas = dropTarget.closest('canvas');
  const canvasId = canvas.dataset.id;
  setCurrentPage(canvasId);

  const rect = canvas.getBoundingClientRect();
  
  // Calculate drop position, but constrain it within canvas bounds
  let dropX = clientX - rect.left;
  let dropY = clientY - rect.top;
  
  // Make sure dropX and dropY are within bounds
  dropX = Math.max(0, Math.min(rect.width, dropX));
  dropY = Math.max(0, Math.min(rect.height, dropY));

  // Calculate the initial element size based on device
  const initialWidth = device.isMobile ? 100 : 160;
  const initialHeight = device.isMobile ? 30 : 40;
  
  // Adjust dropX/dropY if they would place the element outside bounds
  if (dropX + initialWidth > rect.width) {
    dropX = rect.width - initialWidth;
  }
  
  if (dropY + initialHeight > rect.height) {
    dropY = rect.height - initialHeight;
  }

  // Ensure we never have negative positions
  dropX = Math.max(0, dropX);
  dropY = Math.max(0, dropY);

  const boxId = generateUniqueId();
    const createAndAddElement = (type, setPosition, addFunction) => {
      let ele = drawTextBoxAbs(
        type,
        (dropX / rect.width) * 100, // Store as percentage
        (dropY / rect.height) * 100, // Store as percentage
        boxId,
        (boxIdToRemove) => {
          setPosition((prevPositions) =>
            prevPositions.filter((pos) => pos.boxId !== boxIdToRemove)
          );
        },
        (boxId, newPosition) => {
          setPosition((prevPositions) =>
            prevPositions.map((pos) =>
              pos.boxId === boxId
                ? { ...pos, ...newPosition }
                : pos
            )
          );
        }
      );

      canvas.parentElement.appendChild(ele);
      // adjustElementPosition(ele, rect);
      
      addFunction(
        dropX / rect.width, // Store percentage X
        dropY / rect.height, // Store percentage Y
        ele.offsetWidth,
        ele.offsetHeight,
        canvasId,
        boxId
      );
    };

    if (dragging === "signature") {
      createAndAddElement("Signature", setSignaturPos, addSignature);
    } else if (dragging === "date") {
      createAndAddElement("Date", setDatePos, addDate);
    } else if (dragging === "fullname") {
      createAndAddElement("Full Name", setNamePos, addName);
    }
  }

function addSignature(x, y, width, height, canvasId, boxId) {
  setSignaturPos(prevPositions => {
    const newPositions = [...prevPositions, {
      x,
      y,
      xPercent: x * 100, // Convert to percentage
      yPercent: y * 100, // Convert to percentage
      width,
      height,
      canvasId,
      boxId
    }];
    return newPositions;
  });
}

function addDate(x, y, width, height, canvasId, boxId) {
  setDatePos(prevPositions => {
    const newPositions = [...prevPositions, {
      x,
      y,
      xPercent: x * 100, // Convert to percentage
      yPercent: y * 100, // Convert to percentage
      width,
      height,
      canvasId,
      boxId
    }];
    return newPositions;
  });
}

function addName(x, y, width, height, canvasId, boxId) {
  setNamePos(prevPositions => {
    const newPositions = [...prevPositions, {
      x,
      y,
      xPercent: x * 100, // Convert to percentage
      yPercent: y * 100, // Convert to percentage
      width,
      height,
      canvasId,
      boxId
    }];
    return newPositions;
  });
}
return (
  <>
  <GlobalStyles
  styles={{
    ".pdfCont": {
      WebkitOverflowScrolling: 'auto',
      overflowX: 'visible',
      overflowY: 'visible',
      whiteSpace: "normal",
      display: "block",
      maxWidth: '100%',
      ...(isMobile && {
        maxHeight: 'none',
        overflowX: "visible",
        overflowY: "visible",
        width: "100%",
      })
    },
  }}

/>

<Box style={{ minHeight: '100vh', width: '100%' }}>
    <Box
      style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100, 
        backgroundColor: '#fff', 
        padding: isMobile ? '16px' : '24px 90px', 
        boxShadow: '0px -4px 6px rgba(0, 0, 0, 0.1)', 
      }}
    >
   <Grid
      container
      spacing={isMobile ? 1 : 2}
      direction={isMobile ? 'row' : 'row'}
      justifyContent="space-between"
      alignItems={isMobile ? 'stretch' : 'center'}
    >
      <Grid size={{ xs: 12, md: 8 }}>
        
      <Box
      style={{
        display: 'flex',
        flexDirection: device.isMobile ? 'row' : 'row',
        gap: device.isMobile ? '8px' : '0',
      }}
    >
       
       {[
  { id: "signature", icon: PenIcon, label: "SIGNATURE", iconSize: device.isMobile ? '16px' : '20px' },
  { id: "date", icon: calendaricon, label: "DATE", iconSize: device.isMobile ? '12px' : '15px' },
  { id: "fullname", icon: peoplewitheditIcon, label: "FULL NAME", iconSize: device.isMobile ? '16px' : '20px' }
].map(({ id, icon, label, iconSize }) => (
  <Button
    key={id}
    draggable={!device.isMobile}
    onDragStart={(e) => {
      if (device.isSafari) {
        e.dataTransfer.setData('text/plain', id);
      }
      handleDragStart(id);
    }}
    onDrag={(e) => {
      if (!device.isMobile) {
        handleDrag(e);
      }
    }}
    onDragEnd={(event) => {
      if (!device.isMobile) {
        handleDragEnd(event, id);
      }
    }}
    onTouchStart={(e) => {
      if (device.isMobile) {
        e.preventDefault();
        handleDragStart(id);
        e.currentTarget.style.opacity = '0.7';
      }
    }}
    onTouchMove={(e) => {
      if (device.isMobile) {
        e.preventDefault();
        const touch = e.touches[0];
        handleDrag({
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => {}
        });
      }
    }}
    onTouchEnd={(e) => {
      if (device.isMobile) {
        e.preventDefault();
        e.currentTarget.style.opacity = '1';
        handleDragEnd(e, id);
      }
    }}
    style={{
      ...buttonStyle,
      touchAction: device.isMobile ? 'none' : 'auto',
      WebkitTouchCallout: device.isMobile ? 'none' : 'auto',
      WebkitUserSelect: device.isMobile ? 'none' : 'auto'
    }}
  >
    <img 
      src={icon} 
      alt={`${label} Icon`} 
      style={{ 
        width: iconSize,
        WebkitUserDrag: 'none',
        userDrag: 'none',
        marginRight: '5px',
        pointerEvents: device.isMobile ? 'none' : 'auto'
      }} 
    />
    {!device.isMobile ? (
      <Tooltip
        title="Hold and drag this field to where you want it placed."
        enterDelay={0}
        leaveDelay={0}
        disableTouchListener={true}
        disableHoverListener={device.isMobile}
      >
        <span>{label}</span>
      </Tooltip>
    ) : (
      <span>{label}</span>
    )}
  </Button>
))}
    </Box>

        {isMobile && (
          <Typography
            style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#888',
              textAlign: 'center'
            }}
          >
            Hold and drag these fields to where you want them placed.
          </Typography>
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Box
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'row',
            justifyContent: 'flex-end',
            gap: isMobile ? '8px' : '0',
          }}
        >
          <Button
            variant="outlined"
            style={actionButtonStyle}
            onClick={onGoBack}
          >
            GO BACK
          </Button>
          <Button
            variant="contained"
            style={{borderRadius: '2px',
              width: isMobile ? '100%' : 'auto',
              marginBottom: isMobile ? '8px' : '0',padding:isMobile ? '' : '6px 24px'}}
            onClick={handleSendClick}
            disabled={totalFields === 0}
          >
            SEND
          </Button>
        </Box>
      </Grid>
    </Grid>
    </Box>

    <Box
    className="pdfCont"
    ref={pdfContainerRef}
    style={{
      WebkitOverflowScrolling: 'auto',
      overflowX: 'visible',
      overflowY: 'visible',
      position: 'relative',
      ...(isMobile && {
        overflowY: 'visible',
        maxHeight: 'none',
      }),
    }}
  >
    <Box
      style={{
        marginBottom: '16px',
        display: "flex",
        justifyContent: isMobile ? "" : "center",
        position: 'relative',
        width: '100%' ,
        backgroundColor:'#F8F8F8'
      }}
    >
      <Box
        ref={canvasContainerRef}
        style={{
          marginTop: "20px",
          backgroundColor: "#F8F8F8",
          width: isMobile ? "max-content" : "max-content",
        }}
      />
        {clickPosition && (
          <Box
            style={{
              position: "absolute",
              left: `${clickPosition.x}px`,
              top: `${clickPosition.y}px`,
              backgroundColor: "rgba(0,0,0,0.1)",
              padding: isMobile ? "3px" : "5px",
              border: "1px solid #000",
              maxWidth: isMobile ? "90%" : "auto",
            }}
          >
            {canvasSignature ? (
              <img 
                src={canvasSignature} 
                alt="Signature"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            ) : (
              <Typography style={{ fontSize: isMobile ? '14px' : '16px' }}>
                {digitalSignature}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>

    <ConfirmationDialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      onConfirm={handleconfirmClick}
      recipientEmail={email}
      fieldsCount={totalFields}
      buttonDisabled={disabled}
    />
  </Box>
</>
);
}; 


export default PDFPreviewComponent;