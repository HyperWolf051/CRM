// Z-Index Management System
// This ensures consistent layering across the entire application

export const zIndex = {
  // Base layers
  base: 0,
  content: 10,
  
  // Navigation layers
  sidebar: 100,
  sidebarOverlay: 90,
  topbar: 200,
  
  // Interactive elements
  dropdown: 300,
  tooltip: 400,
  
  // Overlays and modals
  overlay: 500,
  modal: 600,
  notification: 700,
  toast: 800,
  
  // Critical system elements
  loading: 900,
  error: 1000
};

// Helper function to get z-index value
export const getZIndex = (layer) => zIndex[layer] || zIndex.base;

// CSS custom properties for z-index
export const zIndexCSS = `
  :root {
    --z-base: ${zIndex.base};
    --z-content: ${zIndex.content};
    --z-sidebar: ${zIndex.sidebar};
    --z-sidebar-overlay: ${zIndex.sidebarOverlay};
    --z-topbar: ${zIndex.topbar};
    --z-dropdown: ${zIndex.dropdown};
    --z-tooltip: ${zIndex.tooltip};
    --z-overlay: ${zIndex.overlay};
    --z-modal: ${zIndex.modal};
    --z-notification: ${zIndex.notification};
    --z-toast: ${zIndex.toast};
    --z-loading: ${zIndex.loading};
    --z-error: ${zIndex.error};
  }
`;