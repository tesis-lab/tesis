import Quill from 'quill'
import docsave from './docsave.js'

module.exports = {
  quill: '',
  doc: '',
  textStats(text) {
    let words = text.split(/[ \n\,\.]+/).filter(i => i !== '')
    let length = words.length

    let time = length / 190 * 60
    let min = Math.floor(time / 60)
    let sec = Math.floor(time % 60)

    return {
      display: (min < 1) ? `${sec} sec` : `${min} min`,
      time: Math.floor(time),
      length: length
    }
  },
  docSubscribe( quill, doc ) {
    doc.subscribe(function(err) {
      if (err) throw err
      if (!doc.data) {
        doc.create([{insert: quill.getText()}], 'rich-text')
      }
      quill.setContents(doc.data)
      quill.on('text-change', function(delta, oldDelta, source) {
        if (source !== 'user') return
        doc.submitOp(delta, {source: quill})
      })
      doc.on('op', function(op, source) {
        if (source === quill) return
        quill.updateContents(op)
      })
    })
  },

  makeQuill() {
    this.quill = new Quill('#editor', {
      placeholder: 'Filthy animals.',
      theme: 'bubble'
    })
  },

  quillOn(doc) {
    this.quill.on('text-change', () => {
      let text = this.quill.getText()
      let stats = this.textStats(text)
      this.time = stats.display
      this.count = stats.length

      docsave.docData.currentDoc.doc = text;
    })
  },

  changeQuill(data) {
    data = data || ''; // This allows us to delete the entire thing with an empty string
    this.makeQuill();
    this.quillOn(this.doc);
    this.quill.deleteText(0, this.quill.getLength());
    this.quill.insertText(0, data)
  }
}
