import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { MAINTENANCE_CATEGORIES } from '../config/constants';

export const createRequest = async (req: Request, res: Response) => {

    const { category, description, address } = req.body;
    const media = req.file ? req.file.path : null;
    const residentId = req.currentUser!.id;

    try {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO requests (resident_id, category, description, address, media) VALUES (?, ?, ?, ?, ?)',
            [residentId, category, description, address, media]
        );

        res.status(201).send({ id: result.insertId, residentId, category, description, address, media, status: 'New' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const getRequests = async (req: Request, res: Response) => {
    try {
        let query = 'SELECT r.*, u.name as resident_name, t.name as technician_name FROM requests r JOIN users u ON r.resident_id = u.id LEFT JOIN users t ON r.technician_id = t.id';
        let params: any[] = [];

        if (req.currentUser!.role === 'resident') {
            query += ' WHERE r.resident_id = ?';
            params.push(req.currentUser!.id);
        } else if (req.currentUser!.role === 'technician') {
            query += ' WHERE r.technician_id = ?';
            params.push(req.currentUser!.id);
        }
        // Admin sees all

        query += ' ORDER BY r.created_at DESC';

        const [requests] = await pool.query(query, params);
        res.send(requests);
    } catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const getRequestById = async (req: Request, res: Response) => {
    try {
        const [requests] = await pool.query<RowDataPacket[]>('SELECT * FROM requests WHERE id = ?', [req.params.id]);
        if (requests.length === 0) {
            res.status(404).send({ errors: [{ message: 'Request not found' }] });
            return;
        }
        // Access control logic could be added here (e.g., resident can only see their own)
        res.send(requests[0]);
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const assignTechnician = async (req: Request, res: Response) => {
    const { technicianId } = req.body;
    const requestId = req.params.id;

    try {
        await pool.query('UPDATE requests SET technician_id = ?, status = ? WHERE id = ?', [technicianId, 'Assigned', requestId]);
        res.send({ message: 'Technician assigned successfully' });
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    const { status } = req.body;
    const requestId = req.params.id;

    try {
        await pool.query('UPDATE requests SET status = ? WHERE id = ?', [status, requestId]);
        res.send({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const addFeedback = async (req: Request, res: Response) => {
    const { rating, comment } = req.body;
    const requestId = req.params.id;

    try {
        await pool.query('UPDATE requests SET feedback_rating = ?, feedback_comment = ? WHERE id = ?', [rating, comment, requestId]);
        res.send({ message: 'Feedback added successfully' });
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        res.send(MAINTENANCE_CATEGORIES);
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
