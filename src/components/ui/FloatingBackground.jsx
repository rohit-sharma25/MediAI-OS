import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/* Cyber-medical grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
    </div>
  );
}
