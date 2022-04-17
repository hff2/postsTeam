const http = require('http')
const { HEADERS, REQUEST_METHOD } = require('./constant')

const Post = require('./models/post')

const mongoose = require('mongoose');
mongoose
    .connect("mongodb://localhost:27017/postsTeam")
    .then(() => console.log('資料庫連接成功'))

const requestListener = async (req, res) => {
    if (req.url == '/posts' && req.method == 'GET') {
        const posts = await Post.find();
        res.writeHead(200, HEADERS);
        res.write(JSON.stringify({
            "status": "success",
            data: posts
        }));
        res.end();
    } else if (req.url.startsWith('/posts?keyword=') && req.method == 'GET') {
        console.log(req)
        const keyword = req.url.split('=').pop();
        // 編碼處理
        const newKeyword = decodeURI(keyword)
        const posts = await Post.find({
            content: {
                $regex: newKeyword
            }
        });
        console.log(posts)
        res.writeHead(200, HEADERS);
        res.write(JSON.stringify({
            "status": "success",
            data: posts
        }));
        res.end();
    }
}

const server = http.createServer(requestListener)
server.listen(4000)