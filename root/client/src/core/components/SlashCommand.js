import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

const SlashCommand = Extension.create({
  name: "slash-command",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        char: "/",

        items: ({ query }) => {
          return [
            {
              title: "Heading 1",
              command: ({ editor }) =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
            },
            {
              title: "Bullet List",
              command: ({ editor }) =>
                editor.chain().focus().toggleBulletList().run()
            }
          ].filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        },

        command: ({ editor, props }) => {
          props.command({ editor });
        }
      })
    ];
  }
});

export default SlashCommand;