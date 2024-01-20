import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import {TokenPayload} from "../types/global";
import * as process from "process";

/**
 * generates JWT used for local testing
 *
 * @param payload the expected token payload
 */
export function generateToken(payload: TokenPayload) {
    const jwtSecret = process.env.JWT_SECRET || '';

    const signInOptions: SignOptions = {
        expiresIn: '1y'
    };

    return sign(payload, jwtSecret, signInOptions);
};



/**
 * checks if JWT token is valid
 *
 * @param token the expected token string
 */
export function validateToken(token: string): Promise<TokenPayload> {
    const jwtSecret = process.env.JWT_SECRET || '';

    return new Promise((resolve, reject) => {
        verify(token, jwtSecret, (error, decoded) => {
            if (error) return reject(error);

            resolve(decoded as TokenPayload);
        })
    });
}
