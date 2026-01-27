import React from 'react';

export const ErrorMaster = () => (
  <div className="error-master-container">
    <h1 className="error-master-title">Oops!</h1>
    <p className="error-master-text">
      La plataforma ha experimentado un inconveniente técnico inesperado.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="nexus-btn-primary"
    >
      Recargar Aplicación
    </button>
  </div>
);
