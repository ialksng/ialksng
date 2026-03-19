import React from "react";

// Helper: Processes bold, italic, code, and links!
const renderRichText = (richTextArray) => {
  if (!richTextArray) return null;

  return richTextArray.map((textObj, i) => {
    let style = {};

    if (textObj.annotations?.bold) style.fontWeight = "bold";
    if (textObj.annotations?.italic) style.fontStyle = "italic";
    if (textObj.annotations?.underline) style.textDecoration = "underline";
    if (textObj.annotations?.strikethrough) style.textDecoration = "line-through";
    if (textObj.annotations?.code) {
      style.background = "#333";
      style.color = "#EB5757";
      style.padding = "2px 6px";
      style.borderRadius = "4px";
      style.fontFamily = "monospace";
    }

    const textContent = textObj.plain_text || "";

    let linkUrl = textObj.href;
    if (!linkUrl && (textContent.startsWith("http://") || textContent.startsWith("https://"))) {
      linkUrl = textContent.trim();
    }

    if (linkUrl) {
      return (
        <a 
          key={i} 
          href={linkUrl} 
          target="_blank" 
          rel="noreferrer" 
          style={{ ...style, color: "#3ea8ff", textDecoration: "underline" }}
        >
          {textContent}
        </a>
      );
    }

    return <span key={i} style={style}>{textContent}</span>;
  });
};

// NEW HELPER: Extracts the correct URL for images and videos from Notion API
const getMediaUrl = (block, type) => {
  const mediaObj = block[type];
  if (!mediaObj) return null;
  // Notion returns either an 'external' URL (hosted elsewhere) or a 'file' URL (hosted by Notion)
  return mediaObj.type === "external" ? mediaObj.external.url : mediaObj.file.url;
};

function NotionRenderer({ content }) {
  if (!Array.isArray(content) || content.length === 0) {
    return <p style={{ textAlign: "center", color: "gray", marginTop: "40px" }}>No content available to display.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", color: "white", paddingBottom: "50px" }}>
      {content.map((block, i) => {
        switch (block.type) {
          case "heading_1":
            return <h1 key={i} style={{ marginTop: "24px", marginBottom: "16px" }}>{renderRichText(block.heading_1?.rich_text)}</h1>;

          case "heading_2":
            return <h2 key={i} style={{ marginTop: "24px", marginBottom: "14px" }}>{renderRichText(block.heading_2?.rich_text)}</h2>;

          case "heading_3":
            return <h3 key={i} style={{ marginTop: "20px", marginBottom: "12px" }}>{renderRichText(block.heading_3?.rich_text)}</h3>;

          case "paragraph":
            return (
              <p key={i} style={{ marginBottom: "12px", lineHeight: "1.6", minHeight: "24px" }}>
                {renderRichText(block.paragraph?.rich_text)}
              </p>
            );

          case "bulleted_list_item":
            return <li key={i} style={{ marginLeft: "20px", marginBottom: "8px", lineHeight: "1.6" }}>{renderRichText(block.bulleted_list_item?.rich_text)}</li>;

          case "numbered_list_item":
            return <li key={i} style={{ marginLeft: "20px", marginBottom: "8px", lineHeight: "1.6" }}>{renderRichText(block.numbered_list_item?.rich_text)}</li>;

          case "code":
            return (
              <pre key={i} style={{ background: "#111", padding: "16px", borderRadius: "8px", overflowX: "auto", marginBottom: "16px", border: "1px solid #333" }}>
                <code>{renderRichText(block.code?.rich_text)}</code>
              </pre>
            );
            
          case "divider":
            return <hr key={i} style={{ border: "none", borderTop: "1px solid #444", margin: "24px 0" }} />;

          case "quote":
            return (
              <blockquote key={i} style={{ borderLeft: "4px solid #fff", margin: "16px 0", paddingLeft: "16px", fontStyle: "italic", color: "#ccc" }}>
                 {renderRichText(block.quote?.rich_text)}
              </blockquote>
            );

          // ======== NEW MEDIA CASES ========

          case "image": {
            const imageUrl = getMediaUrl(block, "image");
            if (!imageUrl) return null;
            return (
              <img 
                key={i} 
                src={imageUrl} 
                alt="Notion block" 
                style={{ maxWidth: "100%", borderRadius: "8px", margin: "16px 0", display: "block" }} 
              />
            );
          }

          case "video": {
            const videoUrl = getMediaUrl(block, "video");
            if (!videoUrl) return null;

            // Handle YouTube links securely using iframes
            if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
              let videoId = "";
              if (videoUrl.includes("youtu.be")) {
                videoId = videoUrl.split("/").pop();
              } else {
                videoId = new URLSearchParams(new URL(videoUrl).search).get("v");
              }
              
              return (
                <iframe 
                  key={i}
                  width="100%" 
                  height="400" 
                  src={`https://www.youtube.com/embed/${videoId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ borderRadius: "8px", margin: "16px 0" }}
                ></iframe>
              );
            }

            // Standard video (e.g. mp4 file uploaded directly to Notion)
            return (
              <video key={i} controls style={{ width: "100%", borderRadius: "8px", margin: "16px 0" }}>
                <source src={videoUrl} />
                Your browser does not support the video tag.
              </video>
            );
          }

          case "embed": {
            const embedUrl = block.embed?.url;
            if (!embedUrl) return null;
            return (
              <iframe 
                key={i} 
                src={embedUrl} 
                style={{ width: "100%", height: "400px", borderRadius: "8px", border: "none", margin: "16px 0" }} 
                allowFullScreen 
              />
            );
          }

          default:
            return null; // Ignore unknown block types safely
        }
      })}
    </div>
  );
}

export default NotionRenderer;