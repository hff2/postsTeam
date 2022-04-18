const http = require('http')
const { HEADERS, REQUEST_METHOD } = require('./constant')

const Post = require('./models/post')

const mongoose = require('mongoose');
mongoose
    .connect("mongodb://localhost:27017/postsTeam")
    .then(() => console.log('資料庫連接成功'))

const requestListener = async (req, res) => {

    let body = '';
    req.on('data', chunk => body += chunk);

    if (req.url == '/posts' && req.method == 'GET') {
        const posts = await Post.find();
        res.writeHead(200, HEADERS);
        res.write(JSON.stringify({
            "status": "success",
            data: posts
        }));
        res.end();
    } else if (req.url.startsWith('/posts?keyword=') && req.method == 'GET') {
        try {
            const keyword = req.url.split('=').pop();
            // 編碼處理
            const newKeyword = decodeURI(keyword)
            const posts = await Post.find({
                content: {
                    $regex: newKeyword
                }
            });
            res.writeHead(200, HEADERS);
            res.write(JSON.stringify({
                "status": "success",
                data: posts
            }));
            res.end();
        } catch (error) {
            res.writeHead(400, HEADERS);
            res.write(JSON.stringify({
                "status": "false",
                "message": "格式錯誤",
                "error": error
            }));
            res.end();
        }
    } else if (req.url == '/posts' && req.method == 'POST') {
        req.on('end', async() => {
            try {
                const data = JSON.parse(body);
                const newPost = await Post.create(
                    {
                        userName: data.userName,
                        userPhoto: data.userPhoto,
                        image: data.image,
                        content: data.content,
                    }
                )
                res.writeHead(200, HEADERS);
                res.write(JSON.stringify({
                    "status": "success",
                    data: newPost
                }));
                res.end();
            } catch (error) {
                res.writeHead(400, HEADERS);
                res.write(JSON.stringify({
                    "status": "false",
                    "message": "欄位錯誤",
                    "error": error.errors
                }));
                res.end();
            }
        });
    } else if (req.method == 'OPTIONS') {
        res.writeHead(200, HEADERS);
        res.end();
    } else {
        res.writeHead(404, HEADERS);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由",
        }));
        res.end();
    }
}

const server = http.createServer(requestListener)
server.listen(4000)