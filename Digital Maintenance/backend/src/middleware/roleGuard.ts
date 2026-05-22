import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.currentUser) {
            res.status(401).send({ errors: [{ message: 'Not authorized' }] });
            return;
        }

        if (!roles.includes(req.currentUser.role)) {
            res.status(403).send({ errors: [{ message: 'Forbidden' }] });
            return;
        }

        next();
    };
};
