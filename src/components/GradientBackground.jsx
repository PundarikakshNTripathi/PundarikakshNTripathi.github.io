import { memo } from 'react';

const GradientBackground = memo(function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-bg-primary" />
      
      {/* Lavender orb - top left */}
      <div
        className="animate-float absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, #c4a7e7 0%, transparent 70%)',
        }}
      />
      
      {/* Pink orb - right */}
      <div
        className="animate-float-delayed absolute -right-[5%] top-[30%] h-[500px] w-[500px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #f5c2e7 0%, transparent 70%)',
        }}
      />
      
      {/* Mauve orb - bottom */}
      <div
        className="animate-float-slow absolute -bottom-[10%] left-[30%] h-[700px] w-[700px] rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #cba6f7 0%, transparent 70%)',
        }}
      />

      {/* Small accent orb */}
      <div
        className="animate-float-delayed absolute top-[60%] left-[10%] h-[300px] w-[300px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, #f5c2e7 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(196, 167, 231, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(196, 167, 231, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise overlay */}
      <div className="noise-overlay" />
    </div>
  );
});

export default GradientBackground;
