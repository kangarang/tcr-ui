// import FileSaver from 'file-saver'

function saveFile(data = '', filename = 'download.txt') {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  console.log('data', data)

//   const blob = new window.Blob([data], {type: 'text/plain;charset=utf-8'})

//   FileSaver.saveAs(blob, filename)
}

export default saveFile
