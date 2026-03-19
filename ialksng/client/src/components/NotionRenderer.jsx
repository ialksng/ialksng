const getText = (richText) =>
  richText?.map((t) => t.plain_text).join("") || "";

function NotionRenderer({ content }) {
  return (
    <div style={{ maxWidth: "800px", margin: "auto", color: "white" }}>
      {content.map((block, i) => {
        switch (block.type) {
          case "heading_1":
            return <h1 key={i}>{getText(block.heading_1.rich_text)}</h1>;

          case "heading_2":
            return <h2 key={i}>{getText(block.heading_2.rich_text)}</h2>;

          case "heading_3":
            return <h3 key={i}>{getText(block.heading_3.rich_text)}</h3>;

          case "paragraph":
            return <p key={i}>{getText(block.paragraph.rich_text)}</p>;

          case "bulleted_list_item":
            return <li key={i}>{getText(block.bulleted_list_item.rich_text)}</li>;

          case "numbered_list_item":
            return <li key={i}>{getText(block.numbered_list_item.rich_text)}</li>;

          case "code":
            return (
              <pre key={i} style={{ background: "#111", padding: "10px" }}>
                <code>{getText(block.code.rich_text)}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default NotionRenderer;