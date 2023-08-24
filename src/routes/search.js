const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'ini endpotint seacrh' })
})

module.exports = router