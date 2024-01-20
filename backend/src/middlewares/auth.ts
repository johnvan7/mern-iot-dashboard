import { Request, Response, NextFunction } from 'express';
import { validateToken } from './../utils/jwtUtils';
import {ReqWithAuth} from "../types/global";

/**
 * middleware to check whether entity has access to a specific endpoint
 *
 * @param allowedAccessTypes list of allowed access types of a specific endpoint
 */
export const authorize = (allowedEntityTypes: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwt = req.headers.authorization;

        // verify request has token
        if (!jwt) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // remove Bearer if using Bearer Authorization mechanism
        if (jwt.toLowerCase().startsWith('bearer')) {
            jwt = jwt.slice('bearer'.length).trim();
        }

        // verify token hasn't expired yet
        const decodedToken = await validateToken(jwt);

        const hasAccessToEndpoint = allowedEntityTypes.some(
            (at) => decodedToken.entityType === at
        );

        if (!hasAccessToEndpoint) {
            return res.status(401).json({ message: 'No enough privileges to access endpoint' });
        }

        (req as ReqWithAuth).auth = {
            entityId: decodedToken.entityId,
            entityType: decodedToken.entityType
        };

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Expired token' });
            return;
        }

        res.status(500).json({ message: 'Failed to authenticate' });
    }
};
