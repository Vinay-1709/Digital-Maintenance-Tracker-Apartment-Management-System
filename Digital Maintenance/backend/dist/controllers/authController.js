"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const database_1 = __importDefault(require("../config/database"));
const register = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { name, email, password, role, contact_info } = req.body;
    try {
        const [existingUsers] = await database_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            res.status(400).json({ errors: [{ message: 'Email already in use' }] });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const [result] = await database_1.default.query('INSERT INTO users (name, email, password_hash, role, contact_info) VALUES (?, ?, ?, ?, ?)', [name, email, passwordHash, role, contact_info]);
        const userJwt = jsonwebtoken_1.default.sign({
            id: result.insertId,
            email,
            role
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).send({ token: userJwt, user: { id: result.insertId, name, email, role } });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await database_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            res.status(400).json({ errors: [{ message: 'Invalid credentials' }] });
            return;
        }
        const user = users[0];
        const passwordMatch = await bcrypt_1.default.compare(password, user.password_hash);
        if (!passwordMatch) {
            res.status(400).json({ errors: [{ message: 'Invalid credentials' }] });
            return;
        }
        const userJwt = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).send({ token: userJwt, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.login = login;
