const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
//Besoin du package de cryptage npm install --save bcrypt
//+ package de token npm install --save jsonwebtoken

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
    //500 = erreur serveur
};

exports.login = (req, res, next) => {
    const JWT_TOKEN = process.env.JWT_TOKEN;
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: "Paire login/mot de passe incoreccte" });
        }
        bcrypt.compare(req.body.password, user.password)
        .then( valid => {
            if (!valid) {
                return res.status(401).json({ message: "Paire login/mot de passe incoreccte" })
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    JWT_TOKEN,
                    { expiresIn: "24h" }
                )
            });    
        })
        .catch(error => res.status(500).json({ error }));  
    })
    .catch(error => res.status(500).json({ error }));
};