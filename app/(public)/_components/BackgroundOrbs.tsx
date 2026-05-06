export function BackgroundOrbs() {
  return (
    <>
      <div
        className='absolute rounded-full'
        style={{
          width: 560,
          height: 560,
          top: '-15%',
          left: '-8%',
          background: 'oklch(0.78 0.17 60 / 0.22)',
          filter: 'blur(110px)',
          animation: 'orb-drift 30s ease-in-out infinite',
        }}
      />
      {/* Deep amber orb — bottom-right */}
      <div
        className='absolute rounded-full'
        style={{
          width: 420,
          height: 420,
          bottom: '0%',
          right: '-6%',
          background: 'oklch(0.65 0.19 45 / 0.18)',
          filter: 'blur(90px)',
          animation: 'orb-drift 24s ease-in-out infinite reverse',
          animationDelay: '-10s',
        }}
      />
      {/* Light golden orb — top-right */}
      <div
        className='absolute rounded-full'
        style={{
          width: 280,
          height: 280,
          top: '15%',
          right: '8%',
          background: 'oklch(0.88 0.15 72 / 0.15)',
          filter: 'blur(75px)',
          animation: 'orb-drift 20s ease-in-out infinite',
          animationDelay: '-6s',
        }}
      />
    </>
  );
}
