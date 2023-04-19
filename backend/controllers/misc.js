const {HTTP_STATUS_OK, HTTP_STATUS_CREATED} = require("../util/const");
const bcrypt = require("bcrypt");
const {User} = require("../models/main");
const jwt = require('jsonwebtoken');

exports.getHelloWorld = (req, res, next) => {
    console.log("Hello world requested");
    res.status(200).json({
        message: "Hello World",
    });
};

exports.default = (req, res, next) => {
    res.status(HTTP_STATUS_OK).json({});
};

exports.postUser = async (req, res, next) => {
    const content = req.body;
    await bcrypt.hash(content.password, 10, function (err, hash) {
        console.log(hash);
        User.create({
            username: content.username,
            pwd: hash,
            email: content.email,
            profileImageUrl: content.profileImageUrl
        }).then(u => {
            let json = u.toJSON()
            delete json.pwd;
            res.status(201).json(json)
        });
    });
}

exports.loginUser = async (req, res, next) => {
    const username = req.body.username;
    const plainPwd = req.body.password;

    const user = await User.findOne({
        where: {
            username: username
        }
    });
    console.log(user);

    if (user != null && bcrypt.compareSync(plainPwd, user.pwd))
    {
        const token = jwt.sign({
            sub: user.id
        }, 'GURKENSALAMIAUFLAUF', { expiresIn: '3h'});
        const decoded = jwt.verify(token, 'GURKENSALAMIAUFLAUF');
        console.log(token);
        res.status(200).json({token: token, expires: decoded.exp})
    }
    else {
        res.status(403).json({});
    }
}

exports.postMessage = (req, res, next) => {
    const header = req.body.header;
    const content = req.body.content;

    res.status(HTTP_STATUS_CREATED).json({
        statusmessage: "Message posted successfully",
        post: {id: new Date().toISOString(), header: header, content: content},
    });
};
