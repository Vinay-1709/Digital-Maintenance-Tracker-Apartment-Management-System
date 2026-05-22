import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, contact_info, created_at FROM users');
        res.send(users);
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const [users] = await pool.query<RowDataPacket[]>('SELECT id, name, email, role, contact_info, created_at FROM users WHERE id = ?', [req.params.id]);
        if (users.length === 0) {
            res.status(404).send({ errors: [{ message: 'User not found' }] });
            return;
        }
        res.send(users[0]);
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, contact_info FROM users WHERE role = ?', [req.params.role]);
        res.send(users);
    } catch (err) {
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
