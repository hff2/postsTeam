const http = require('http')
const { HEADERS, REQUEST_METHOD } = require('./constant')

const Post = require('./models/post')

const mongoose = require('mongoose');
mongoose
    .connect("mongodb://localhost:27017/postsTeam")
    .then(() => console.log('資料庫連接成功'))

const requestListener = async (req, res) => {

}

const server = http.createServer(requestListener)
server.listen(4000)