const getText = (richText) =>
  richText?.map((t) => t.plain_text).join("") || "";

function NotionRenderer({ content }) {
  // Prevent crash if content somehow isn't an array
  if (!Array.isArray(content) || content.length === 0) {
    return <p style={{ textAlign: "center", color: "gray", marginTop: "40px" }}>No content available to display.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", color: "white", paddingBottom: "50px" }}>
      {content.map((block, i) => {
        switch (block.type) {
          case "heading_1":
            return <h1 key={i}>{getText(block.heading_1?.rich_text)}</h1>;

          case "heading_2":
            return <h2 key={i}>{getText(block.heading_2?.rich_text)}</h2>;

          case "heading_3":
            return <h3 key={i}>{getText(block.heading_3?.rich_text)}</h3>;

          case "paragraph":
            return <p key={i} style={{ marginBottom: "12px", lineHeight: "1.6" }}>{getText(block.paragraph?.rich_text)}</p>;

          case "bulleted_list_item":
            return <li key={i} style={{ marginLeft: "20px", marginBottom: "8px" }}>{getText(block.bulleted_list_item?.rich_text)}</li>;

          case "numbered_list_item":
            return <li key={i} style={{ marginLeft: "20px", marginBottom: "8px" }}>{getText(block.numbered_list_item?.rich_text)}</li>;

          case "code":
            return (
              <pre key={i} style={{ background: "#111", padding: "15px", borderRadius: "8px", overflowX: "auto", marginBottom: "15px" }}>
                <code>{getText(block.code?.rich_text)}</code>
              </pre>
            );

          default:
            return null; // Ignore unsupported block types safely
        }
      })}
    </div>
  );
}

export default NotionRenderer;