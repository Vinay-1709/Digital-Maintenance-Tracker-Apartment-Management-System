"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFeedback = exports.updateStatus = exports.assignTechnician = exports.getRequestById = exports.getRequests = exports.createRequest = void 0;
const database_1 = __importDefault(require("../config/database"));
const express_validator_1 = require("express-validator");
const createRequest = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { category, description, address } = req.body;
    const media = req.file ? req.file.path : null;
    const residentId = req.currentUser.id;
    try {
        const [result] = await database_1.default.query('INSERT INTO requests (resident_id, category, description, address, media) VALUES (?, ?, ?, ?, ?)', [residentId, category, description, address, media]);
        res.status(201).send({ id: result.insertId, residentId, category, description, address, media, status: 'New' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.createRequest = createRequest;
const getRequests = async (req, res) => {
    try {
        let query = 'SELECT r.*, u.name as resident_name, t.name as technician_name FROM requests r JOIN users u ON r.resident_id = u.id LEFT JOIN users t ON r.technician_id = t.id';
        let params = [];
        if (req.currentUser.role === 'resident') {
            query += ' WHERE r.resident_id = ?';
            params.push(req.currentUser.id);
        }
        else if (req.currentUser.role === 'technician') {
            query += ' WHERE r.technician_id = ?';
            params.push(req.currentUser.id);
        }
        // Admin sees all
        query += ' ORDER BY r.created_at DESC';
        const [requests] = await database_1.default.query(query, params);
        res.send(requests);
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.getRequests = getRequests;
const getRequestById = async (req, res) => {
    try {
        const [requests] = await database_1.default.query('SELECT * FROM requests WHERE id = ?', [req.params.id]);
        if (requests.length === 0) {
            res.status(404).send({ errors: [{ message: 'Request not found' }] });
            return;
        }
        // Access control logic could be added here (e.g., resident can only see their own)
        res.send(requests[0]);
    }
    catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.getRequestById = getRequestById;
const assignTechnician = async (req, res) => {
    const { technicianId } = req.body;
    const requestId = req.params.id;
    try {
        await database_1.default.query('UPDATE requests SET technician_id = ?, status = ? WHERE id = ?', [technicianId, 'Assigned', requestId]);
        res.send({ message: 'Technician assigned successfully' });
    }
    catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.assignTechnician = assignTechnician;
const updateStatus = async (req, res) => {
    const { status } = req.body;
    const requestId = req.params.id;
    try {
        await database_1.default.query('UPDATE requests SET status = ? WHERE id = ?', [status, requestId]);
        res.send({ message: 'Status updated successfully' });
    }
    catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.updateStatus = updateStatus;
const addFeedback = async (req, res) => {
    const { rating, comment } = req.body;
    const requestId = req.params.id;
    try {
        await database_1.default.query('UPDATE requests SET feedback_rating = ?, feedback_comment = ? WHERE id = ?', [rating, comment, requestId]);
        res.send({ message: 'Feedback added successfully' });
    }
    catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
exports.addFeedback = addFeedback;
