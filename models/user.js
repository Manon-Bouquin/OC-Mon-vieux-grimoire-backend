const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
//Besoin du package de mongoose npm install --save mongoose-unique-validator (--force)

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); 
//Avec ce modéle, on ne pourra pas avoir plusiquers user avec le mm email

module.exports = mongoose.model("User", userSchema);