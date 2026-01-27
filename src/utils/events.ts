export const NEXUS_EVENTS = {
  SESSION_REFRESHING: 'nexus:session-refreshing',
  TOKEN_UPDATED: 'nexus:token-updated',
  USER_UPDATED: 'nexus:user-updated',
  SESSION_EXPIRED: 'nexus:session-expired',
};

/**
 * Utilidad para emitir eventos al bus global (window)
 */
export const emitNexusEvent = (eventName: string, detail?: unknown) => {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
};
