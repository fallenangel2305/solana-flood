// components/FloodMap.tsx

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

const FloodMap = () => {
  return (
    <LeafletMap />
  );
};

export default FloodMap;
