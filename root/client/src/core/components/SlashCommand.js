import Suggestion from "@tiptap/suggestion";

const SlashCommand = Suggestion({
  char: "/",
  startOfLine: true,

  items: ({ query }) => {
    return [
      {
        title: "Heading 1",
        command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run()
      },
      {
        title: "Heading 2",
        command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run()
      },
      {
        title: "Bullet List",
        command: (editor) => editor.chain().focus().toggleBulletList().run()
      },
      {
        title: "Numbered List",
        command: (editor) => editor.chain().focus().toggleOrderedList().run()
      },
      {
        title: "Image",
        command: (editor) => {
          const url = prompt("Image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }
      },
      {
        title: "YouTube",
        command: (editor) => {
          const url = prompt("YouTube URL");
          if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }
      },
      {
        title: "Table",
        command: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
      }
    ].filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  },

  command: ({ editor, props }) => {
    props.command(editor);
  },

  render: () => {
    let el;

    return {
      onStart: (props) => {
        el = document.createElement("div");
        el.className = "slash-menu";

        props.items.forEach(item => {
          const div = document.createElement("div");
          div.className = "slash-item";
          div.innerText = item.title;
          div.onclick = () => item.command(props.editor);
          el.appendChild(div);
        });

        document.body.appendChild(el);
      },

      onUpdate: (props) => {
        el.innerHTML = "";
        props.items.forEach(item => {
          const div = document.createElement("div");
          div.className = "slash-item";
          div.innerText = item.title;
          div.onclick = () => item.command(props.editor);
          el.appendChild(div);
        });
      },

      onExit: () => {
        if (el) el.remove();
      }
    };
  }
});

export default SlashCommand;