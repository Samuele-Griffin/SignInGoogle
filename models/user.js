const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let roles = {
    values: ['admin', 'user'],
    message: 'el {VALUE} es invalido, tiene que ser admin o user'
};

let userSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: [true, 'Se requiere de un nombre para el registro'],
    },
    email: {
        type: String,
        default: '',
        required: [true, 'Se requiere de un email para el registro'],
        unique: true,
    },
    password: {
        type: String,
        default: '',
        required: [true, 'Se requiere de una contraseña para el registro'],
    },
    google: {
        type: Boolean,
        required: [false],
        default: false,
    },
    status: {
        type: Boolean,
        required: [true],
        default: false,
    },
    role: {
        type: String,
        required: [true, 'Se requiere especificar el rol'],
        default: 'user',
        enum: roles,
    },
    img: {
        type: String,
        required: [false],
        default: '',
    }
});


userSchema.methods.json = function() {
    let catchUser = this;
    let objectUser = catchUser.toObject();
    delete objectUser.password;
    return objectUser;
}

userSchema.plugin(unique, { message: '{PATH} tiene que ser unico en la base de datos' });

module.exports = mongoose.model('User', userSchema);