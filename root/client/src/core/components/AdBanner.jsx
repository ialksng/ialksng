import React, { useEffect } from "react";

const AdBanner = ({
  dataAdSlot = "4143392198",
  dataAdFormat = "auto",
  fullWidthResponsive = "true",
}) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <div
      style={{
        margin: "2rem auto",
        width: "100%",
        minHeight: "100px",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
        }}
        data-ad-client="ca-pub-4303485576958542"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={fullWidthResponsive}
      ></ins>
    </div>
  );
};

export default AdBanner;