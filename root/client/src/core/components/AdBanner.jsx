import React, { useEffect } from 'react';

const AdBanner = ({ dataAdSlot, dataAdFormat = "auto", fullWidthResponsive = "true" }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense Error:", error);
    }
  }, []);

  return (
    <div style={{ margin: '20px 0', textAlign: 'center', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4303485576958542" 
        data-ad-slot={dataAdSlot}                
        data-ad-format={dataAdFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default AdBanner;