const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/signals', auth, async (req, res) => {
    try {
        res.render("signals")
    } catch (e) {
        console.log(e)
    }
})

module.exports = router