const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    messageService = require('./index');

router.get('/get-messages', async (req, res) => {
    const { room, threshold } = req.query;

    // TODO: if no room, error

    const result = await messageService.getRoomMessages(room, threshold);

    res.json(result);
});

module.exports = router;