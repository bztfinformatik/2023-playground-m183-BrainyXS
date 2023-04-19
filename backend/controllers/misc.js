const {HTTP_STATUS_OK, HTTP_STATUS_CREATED} = require("../util/const");
const bcrypt = require("bcrypt");
const {User} = require("../models/main");

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

        User.create({
            username: content.username,
            pwd: hash,
            email: content.email,
            profileImageUrl: content.profileImageUrl
        }).then(u => {
            res.status(201).json(u.toJSON())
        });
    });
}

exports.postMessage = (req, res, next) => {
    const header = req.body.header;
    const content = req.body.content;

    res.status(HTTP_STATUS_CREATED).json({
        statusmessage: "Message posted successfully",
        post: {id: new Date().toISOString(), header: header, content: content},
    });
};
