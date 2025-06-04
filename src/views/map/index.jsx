import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SERVER_URL } from 'src/settings';
import './style.css'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas/states-10m.json'; // GeoJSON for the USA map

const MapViewer = () => {
  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [device, setDevice] = useState('');

  const handlePdfLoad = () => setPdfLoaded(true);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setPdfLoaded(false);
  };

  const checkDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) return 'Android';
    if (/iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream) return 'iOS';
    return 'Unknown';
  };

  const handleStateClick = geo => {
    const name = geo.properties.name;
    setSelectedState(name);
    const deviceType = checkDeviceType();
    setDevice(deviceType);

    handleOpen();
    if (deviceType === 'Android' || deviceType === 'iOS') {
      setTimeout(() => handleClose(), 4000);
    }

    if (deviceType === 'iOS') {
      const url = `${SERVER_URL}CertificateSyllabus/${name}.pdf`;
      window.open(url, '_blank');
    }
  };

  const handleStateHover = (geo, evt) => {
    const name = geo.properties.name;
    setHoveredState(name);
    setHoverInfo({
      name,
      x: evt.clientX,
      y: evt.clientY
    });
  };

  const handleStateLeave = () => setHoveredState(null);

  useEffect(() => {
    setDevice(checkDeviceType());
  }, []);

  return (
    <>
      <div className='map-container'>
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleStateClick(geo)}
                  onMouseEnter={evt => handleStateHover(geo, evt)}
                  onMouseLeave={handleStateLeave}
                  style={{
                    default: { fill: '#538ecd', outline: 'none' },
                    hover: { fill: '#2872C1', outline: 'none', cursor: 'pointer' },
                    pressed: { fill: '#1A4F85', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
        {hoveredState && hoverInfo && (
          <div
            style={{
              position: "fixed",
              left: hoverInfo.x + 5,
              top: hoverInfo.y + 5,
              backgroundColor: "#FFFFFF",
              border: "1px solid #CCC",
              padding: "8px",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
              color: "#333",
              fontSize: "14px",
            }}
          >
            {hoverInfo.name}
          </div>
        )}
      </div>
      <Dialog open={open} onClose={handleClose} fullScreen maxWidth="xl">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">State Information: {selectedState}</Typography>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ background: '#F9F9F9'}}>
          {!pdfLoaded && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
            >
              <CircularProgress />
            </div>
          )}
          <iframe
            src={SERVER_URL + `CertificateSyllabus/${selectedState}.pdf`}
            onLoad={handlePdfLoad}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapViewer;
