import { useEffect, useState } from 'react';
import { NEXUS_EVENTS } from '../utils/events';

const GlobalLoading = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Se cambia 'any' por un tipo genérico de evento o CustomEvent
    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsVisible(detail);
    };

    window.addEventListener(NEXUS_EVENTS.SESSION_REFRESHING, handleToggle);
    return () =>
      window.removeEventListener(NEXUS_EVENTS.SESSION_REFRESHING, handleToggle);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="nexus-global-overlay">
      <div className="nexus-global-spinner" />
      <p className="nexus-loading-text">Actualizando sesión segura...</p>
      <p className="nexus-loading-subtext">Verdugo Nexus</p>
    </div>
  );
};

export default GlobalLoading;
