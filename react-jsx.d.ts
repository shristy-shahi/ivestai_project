import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      linearGradient: React.SVGProps<SVGLinearGradientElement>;
      stop: React.SVGProps<SVGStopElement>;
    }
  }
}
