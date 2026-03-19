import React from "react";

// NEW HELPER: Processes bold, italic, code, and links!
const renderRichText = (richTextArray) => {
  if (!richTextArray) return null;

  return richTextArray.map((textObj, i) => {
    let style = {};

    // 1. Apply Notion formatting (Annotations)
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

    // 2. Determine if it's a link (Check Notion's href OR force it if it starts with http)
    let linkUrl = textObj.href;
    if (!linkUrl && (textContent.startsWith("http://") || textContent.startsWith("https://"))) {
      linkUrl = textContent.trim();
    }

    // 3. Render Link
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

    // 4. Otherwise, return normal formatted text
    return (
      <span key={i} style={style}>
        {textContent}
      </span>
    );
  });
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
            // Notion sends empty paragraphs as blank lines, so we preserve that height
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

          default:
            return null;
        }
      })}
    </div>
  );
}

export default NotionRenderer;