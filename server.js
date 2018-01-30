const express = require('express')
const path = require('path')

const app = express()

app.use(function(req, res, next) {
  if (!req.secure && req.get('X-Forwarded-Proto') !== 'https') {
    res.redirect('https://' + req.get('Host') + req.url)
  } else next()
})

/* static route */
app.use(express.static(__dirname + '/build'))

/* config for browser history in react */
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')))

const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port
  console.log('app listening on port: ', port)
})
