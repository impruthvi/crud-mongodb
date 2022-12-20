const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dbConnect = require("../../mongodb");
var ObjectId = require('mongodb').ObjectId;

const User = dbConnect('user')

exports.register = async(req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    (await User).insertOne(req.body, function(err, newUser) {
        res.status(200).json({
            status: "success",
            data: {
                user: newUser,
            },
        });
    });
};

exports.login = async(req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if user exists && password is correct
    (await User).findOne({ email }, async function(err, user) {
        if (err) throw err;
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.status(200).json({
                status: "success",
                token,
                data: {
                    user: user,
                },
            });
        }
    });

};

exports.protect = async(req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check it user still exists
    const currentUser = await (await User).findOne({ _id: new ObjectId(decoded.id) });

    // GRANT ACCESS TO PROTECTED ROUTES
    req.user = currentUser;
    console.log(req);

    next();
};

exports.getOneUser = async(req, res) => {
    try {
        (await User).findOne({ _id: new ObjectId(req.params.id) }, function(err, user) {
            if (err) throw err;

            res.status(200).json({
                status: true,
                data: {
                    user,
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

exports.getAllUser = async(req, res) => {
    try {
        (await User).find({}).toArray(function(err, users) {
            res.status(200).json({
                status: true,
                data: {
                    users,
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

exports.updateUser = async(req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 12);
        }
        await (await User).findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: req.body }, { returnNewDocument: true }).then((user) => {
            res.status(200).json({
                status: true,
                data: user.value,
            });
        });

    } catch (err) {
        res.status(400).json({
            status: false,
            message: err,
        });
    }
};

exports.deleteUser = async(req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        (await User).findOneAndDelete({ _id: id });

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