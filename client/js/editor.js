
// import Quill from 'quill'
import {Quill} from '../js/sentiment_blots.js'
import docsave from './docsave.js'
import Chance from 'chance'

const chance = new Chance()

const Block = Quill.import('blots/block')

class Header extends Block {
  static formats(domNode) {
    if (!domNode.id) {
      let time = '' + Date.now()
      domNode.id = `th-${chance.word({length: 3}) + time.slice(-3)}`
    }
    return this.tagName.indexOf(domNode.tagName) + 1
  }
}

Header.blotName = 'header'
Header.tagName = ['H1', 'H2']

Quill.register('formats/header', Header, true)

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
  // Toolbar config
  TOOLBAR_CONFIG: {
    container: [
      ['bold', 'italic'],
      [{header: 1}, {header: 2}],
      ['blockquote', 'code-block'],
      ['image']
    ]
  },
  makeQuill() {
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: this.TOOLBAR_CONFIG
      },
      placeholder: 'Tesis Editor',
      theme: 'bubble'
    })
  },

  quillOn(context, doc) {
    this.quill.on('text-change', () => {
      let text = this.quill.getText()
      let stats = this.textStats(text)
      context.time = stats.display
      context.count = stats.length

      docsave.docData.currentDoc.doc = text;
    })
  },

  changeQuill(data) {
    data = JSON.parse(data) || ''; // This allows us to delete the entire thing with an empty string
    this.quill.setContents(data, 'user');
  }
}
