export const cme_colors = {
    compliant:'#008000',
    compliantLight:'#DFF7DF',
    nonCompliant:'#D32F2F',
    nonCompliantLight:'#FFF0F0',
    primary:'#2872C1',
    dark:'#000000',
    darkLight:'#F2F2F2',
}


export const scrollToTopButtonStyle = {
    position: 'fixed',
    bottom: '21px',    // Position at the bottom of the screen
    right: '105px',     // Position at the right side of the screen
    fontSize: '18px',
    cursor: 'pointer',
    zIndex: 1000,      // Make sure the button stays on top of other elements
    transition: 'all 0.3s ease',
    ':hover': {
        transform: 'translateY(-5px)',  // Lifts the button on hover
        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)', // Increase the shadow for a lifted effect
      },
  };