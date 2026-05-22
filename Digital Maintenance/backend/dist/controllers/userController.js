"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByRole = exports.getUserById = exports.getAllUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllUsers = async (req, res) => {
    try {
        const [users] = await database_1.default.query('SELECT id, name, email, role, contact_info, created_at FROM users');
        res.send(users);
    }
    catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const [users] = await database_1.default.query('SELECT id, name, email, role, contact_info, created_at FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) {
            res.status(404).send({ errors: [{ message: 'User not found' }] });
            return;
        }
        res.send(users[0]);
    }
    catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.getUserById = getUserById;
const getUsersByRole = async (req, res) => {
    try {
        const [users] = await database_1.default.query('SELECT id, name, email, role, contact_info FROM users WHERE role = ?', [req.params.role]);
        res.send(users);
    }
    catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.getUsersByRole = getUsersByRole;
