/**
 * Clipboard Manager for Circuit Components
 * Handles copy/paste operations with position offset
 */
export class ClipboardManager {
  constructor() {
    this.clipboard = null;
  }

  copy(components) {
    if (!components || components.length === 0) return;

    // Deep clone to avoid reference issues
    this.clipboard = JSON.parse(JSON.stringify(components));
  }

  paste(currentComponents, offset = { x: 20, y: 20 }) {
    if (!this.clipboard) return [];

    // Generate new IDs and offset positions
    const newComponents = this.clipboard.map((comp) => {
      return {
        ...comp,
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: comp.x + offset.x,
        y: comp.y + offset.y,
        selected: true, // Select pasted items
      };
    });

    return newComponents;
  }

  hasContent() {
    return this.clipboard !== null && this.clipboard.length > 0;
  }
}

export const clipboardManager = new ClipboardManager();
