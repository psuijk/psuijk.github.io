import { visit } from 'unist-util-visit';

const altTexts = {
  'chonker-new-usecase.png': 'Chonker Playground — Create new use case screen with AI generate vs manual setup',
  'chonker-schema-editor.png': 'Chonker Playground — Schema editor with nested fields wizard',
  'chonker-usecase-edit.png': 'Chonker Playground — Use case edit view with model configuration',
};

export function rehypeScreenshots() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'raw' || node.type === 'html') {
        const match = node.value?.match(/<!--\s*screenshot:\s*([\w.-]+)\s*-->/);
        if (match) {
          const filename = match[1];
          const alt = altTexts[filename] || filename;
          node.type = 'raw';
          node.value = `<img src="/images/chonker/${filename}" alt="${alt}" loading="lazy" />`;
        }
      }
    });
  };
}
