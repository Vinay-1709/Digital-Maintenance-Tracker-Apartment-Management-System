"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (roles) => {
    return (req, res, next) => {
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
exports.checkRole = checkRole;
