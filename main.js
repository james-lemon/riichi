import express from 'express'
import fs from 'fs'

const app = express()

app.get('/', (reg, res) => {
  fs.readFile('./View/Game.html', 'utf8', function(err, data) {
    res.send(data);
  })
  res.send('Hello world')
})

app.route('/riichiLib.js')
  .get(function (req, res) {
    fs.readFile('./riichiLib.js', 'utf8', function(err, data) {
      res.send(data)
    })
  })

app.listen(3000, () => console.log('Arming Ponnya'))