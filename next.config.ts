import type { NextConfig } from 'next';

const config: NextConfig = {
  devIndicators: false,
  // Produces a minimal Node.js server that can be copied into the production
  // Docker image without bringing the full source tree or development tools.
  output: 'standalone',
};

export default config;
