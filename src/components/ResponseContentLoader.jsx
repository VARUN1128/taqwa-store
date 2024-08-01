import React, { useState, useEffect, useRef } from 'react';
import ContentLoader from 'react-content-loader';

const ResponsiveContentLoader = () => {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const ref = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <ContentLoader viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} speed={2} width={dimensions.width} height={dimensions.height}>
        <rect x="0" y="0" rx="5" ry="5" width={dimensions.width} height={dimensions.height} />
      </ContentLoader>
    </div>
  );
};

export default ResponsiveContentLoader;