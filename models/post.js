const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, '貼文姓名未填寫']
        },
        userPhoto: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        content: {
            type: String,
            required: [true, '貼文內容未填寫']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
    },
    {
        versionKey: false
    }
);

const Post = mongoose.model('post', postSchema)

module.exports = Post;