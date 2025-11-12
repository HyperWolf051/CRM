/**
 * MinimalThemeWrapper Component
 * 
 * Applies the minimal human-crafted UI theme to child components.
 * This wrapper adds the 'minimal-theme' class which triggers CSS overrides
 * for a more understated, professional aesthetic.
 */

export default function MinimalThemeWrapper({ children }) {
  return (
    <div className="minimal-theme">
      {children}
    </div>
  );
}
