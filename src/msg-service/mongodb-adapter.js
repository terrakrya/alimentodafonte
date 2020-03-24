const mongoose = require('mongoose');
const Message = mongoose.model('Message');

class MongodbAdapter {
    async addMessage(message) {
        const newMessage = new Message(message);

        try {
            await newMessage.save();

            return true;
        } catch (err) {
            console.log(err.message);

            return false;
        }
    }

    async getRoomMessages(room, threshold, limit) {
        const filter = { room };

        if (threshold) { // Does it work?
            filter._id = { $lt: mongoose.Types.ObjectId(threshold) };
        }

        const messages = await Message.find(filter, null, { limit: limit + 1, sort: { 'createdAt': 'desc' } }).exec();

        messages.reverse();

        let hasMore = false;
        let messageRef = null;
        if (messages.length > 10) {
            messages.shift();
            messageRef = messages[0]._id;
            hasMore = true;
        }

        return {
            messages,
            hasMore,
            messageRef,
        };
    }
}

module.exports = new MongodbAdapter;