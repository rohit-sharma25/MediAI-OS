import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/40" />
      {/* Cyber-medical grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-15" />
    </div>
  );
}
