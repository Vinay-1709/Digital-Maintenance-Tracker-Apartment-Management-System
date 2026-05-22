import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    password_hash: string;
    role: string;
    name: string;
}

export const register = async (req: Request, res: Response) => {
 

    const { name, email, password, role, contact_info } = req.body;

    try {
        const [existingUsers] = await pool.query<User[]>('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            res.status(400).json({ errors: [{ message: 'Email already in use' }] });
            return;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO users (name, email, password_hash, role, contact_info) VALUES (?, ?, ?, ?, ?)',
            [name, email, passwordHash, role, contact_info]
        );

        const userJwt = jwt.sign(
            {
                id: result.insertId,
                email,
                role
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.status(201).send({ token: userJwt, user: { id: result.insertId, name, email, role } });
    } catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query<User[]>('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            res.status(400).json({ errors: [{ message: 'Invalid credentials' }] });
            return;
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            res.status(400).json({ errors: [{ message: 'Invalid credentials' }] });
            return;
        }

        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.status(200).send({ token: userJwt, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).send({ errors: [{ message: 'Server error' }] });
    }
};
