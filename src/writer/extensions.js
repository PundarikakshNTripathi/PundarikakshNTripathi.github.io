import { Extension, InputRule, textblockTypeInputRule } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';

// Smart quotes and dashes for prose, but never inside inline code or an unclosed $$…$$ that the
// math input rule is about to turn into LaTeX (otherwise ^2 becomes ² and -- becomes an em dash).
const insideMathOrCode = (state, pos) => {
  const $pos = state.doc.resolve(pos);
  if ($pos.parent.type.spec.code || $pos.marks().some((m) => m.type.name === 'code')) return true;
  const before = $pos.parent.textBetween(0, $pos.parentOffset, '\n', '\n');
  return (before.match(/\$\$/g) || []).length % 2 === 1;
};

export const SafeTypography = Typography.extend({
  addInputRules() {
    return this.parent().map(
      (rule) =>
        new InputRule({
          find: rule.find,
          handler: (props) => (insideMathOrCode(props.state, props.range.from) ? null : rule.handler(props)),
        })
    );
  },
});

// Typing right after a link shouldn't keep extending it.
export const WriterLink = Link.extend({ inclusive: () => false });

// Medium habit: "# " starts a section heading (the post title is the only h1).
export const HashHeading = Extension.create({
  name: 'hashHeading',
  addInputRules() {
    return [textblockTypeInputRule({ find: /^#\s$/, type: this.editor.schema.nodes.heading, getAttributes: { level: 2 } })];
  },
});

// Insert a block without ever replacing a selected image or embed, and leave a text cursor
// in a fresh paragraph after it so typing carries on instead of deleting what was inserted.
export function insertBlock(editor, node) {
  const { selection } = editor.state;
  const at = selection.node ? selection.to : null;
  const content = [node, { type: 'paragraph' }];
  const chain = editor.chain().focus();
  if (at != null) chain.insertContentAt(at, content);
  else chain.insertContent(content);
  return chain
    .command(({ tr }) => {
      if (tr.selection.node || !tr.selection.$from.parent.isTextblock) {
        tr.setSelection(TextSelection.near(tr.doc.resolve(tr.selection.to), 1));
      }
      return true;
    })
    .run();
}
