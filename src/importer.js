class ImportHtml extends HTMLElement {
  srcPropName = 'src';

  constructor() {
    super();

    const markupSrc = this.getAttribute(this.srcPropName);
    const slotContent = this.hasChildNodes() ? this.innerHTML : null;

    if (!markupSrc) {
      throw Error(`missing ${this.srcPropName} attribute`);
    }

    if (!markupSrc) {
      return;
    }

    fetch(markupSrc)
      .then((response) => response.text())
      .then((markup) => {
        this.innerHTML = slotContent ? applySlots(markup, slotContent) : markup;
      });
  }
}

customElements.define('import-html', ImportHtml);

function applySlots(markup, slotContent) {
  const [openTag, closeTag] = ['<slot', '</slot>'];
  const slotIndices = [
    markup.indexOf(openTag),
    markup.lastIndexOf(closeTag) + closeTag.length,
  ];
  if (slotIndices.includes(-1)) {
    return markup;
  }
  const [slotStartIdx, slotEndIdx] = slotIndices;
  const slotSubstr = markup.substring(slotStartIdx, slotEndIdx);

  return markup.replace(slotSubstr, slotContent);
}
