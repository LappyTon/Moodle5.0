const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }],
    grades: {
        math: [{ type: Number }],
        physics: [{ type: Number }],
        chemistry: [{ type: Number }],
    }
});

module.exports = model('User', UserSchema);
