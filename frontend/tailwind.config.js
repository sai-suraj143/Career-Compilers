module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 25px 80px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(96, 165, 250, 0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.18), transparent 25%)',
      },
      colors: {
        surface: '#0B1120',
        panel: '#111827',
        border: '#1F2937',
      },
    },
  },
  plugins: [],
};
