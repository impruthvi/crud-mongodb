const multer = require('multer');
const path = require('path');
const dbConnect = require("../../mongodb");
var ObjectId = require('mongodb').ObjectId;
const Post = dbConnect('post')
const PostImage = dbConnect('post_image')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.uploadPostImages = upload.array('images');

exports.createPost = async(req, res) => {
    try {
        req.body.userId = req.user._id;
        (await Post).insertOne(req.body, function(err, post) {
            (req.files).map(async(file) => {
                (await PostImage).insertOne({ userId: req.user._id, postId: post._id, image: file.path });
            })
            res.status(201).json({
                status: true,
                data: {
                    post,
                },
            });
        })

    } catch (err) {
        res.status(400).json({
            status: false,
            message: err,
        });
    }
};

exports.getOnePost = async(req, res) => {
    try {
        (await Post).findOne({ _id: new ObjectId(req.params.id) }, function(err, post) {
            if (err) throw err;

            res.status(200).json({
                status: true,
                data: {
                    post,
                },
            });
        });

    } catch (err) {
        res.status(400).json({
            status: false,
            message: err,
        });
    }
};

exports.getAllPost = async(req, res) => {
    try {
        (await Post).find({}).toArray(function(err, users) {
            res.status(200).json({
                status: true,
                data: {
                    users,
                },
            });
        });;

    } catch (err) {
        res.status(400).json({
            status: false,
            message: err,
        });
    }
};

exports.updatePost = async(req, res) => {
    try {
        (await Post).findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: req.body }, { returnNewDocument: true }).then((post) => {
            res.status(200).json({
                status: true,
                data: post.value,
            });
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err,
        });
    }
};

exports.deletePost = async(req, res) => {
    try {
        (await Post).findOneAndDelete({ _id: new ObjectId(req.params.id) });

        res.status(200).json({
            status: true,
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err,
        });
    }
};