import FileSaver from 'file-saver'

function saveFile(data = '', filename = 'download.txt') {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }

  const blob = new window.Blob([data], { type: 'text/plain;charset=utf-8' })

  FileSaver.saveAs(blob, filename)
}

export function makeBlob(mime, str) {
  str = typeof str === 'object' ? JSON.stringify(str) : str
  if (str === null) {
    return ''
  }
  const blob = new Blob([str], {
    type: mime,
  })
  return window.URL.createObjectURL(blob)
}

export default saveFile
