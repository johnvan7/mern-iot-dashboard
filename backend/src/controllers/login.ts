import {Request, Response} from "express";
import emailValidator from "email-validator";
import {randomDigits} from "crypto-secure-random-digit";
import {UserModel} from "../models/user";
import {USER} from "../types/entityTypes";
import moment from "moment/moment";
import {TokenPayload} from "../types/global";
import {generateToken} from "../utils/jwtUtils";

const loginOrSignup = async (req: Request, res: Response) => {
    const {email} = req.body;
    if (!email || !emailValidator.validate(email)) {
        return res.status(422).json({message: 'Invalid email'});
    }

    let secretLoginCode = randomDigits(6).join('');
    UserModel.findOneAndUpdate({email}, { $setOnInsert: {
            email,
            entityType: USER
        }, $set: {
            otp: secretLoginCode,
            otpExpire: moment().add(4, 'minutes')
        }}, { upsert: true, new: true}, (err, doc) => {
        if(err){
            return res.status(500).json(err.message);
        }
        console.log("opt:" + secretLoginCode);
        return res.status(200).json({
            message: 'Please confirm otp'
        });
    });
};

const confirm = async (req: Request, res: Response) => {
    const {email, otp} = req.body;
    const now = moment();

    if (!email || !emailValidator.validate(email)) {
        return res.status(422).json({message: 'Invalid email'});
    }

    if (!otp || otp.length !== 6) {
        return res.status(422).json({
            message: 'Invalid otp'
        });
    }

    UserModel.findOne({email}, (err: any, doc: any) => {
        if(err){
            return res.status(500).json(err.message);
        }
        if(!doc){
            return res.status(404).json({
                message: 'Not found'
            });
        }
        if(otp == (doc.otp as Number).toString()){
            const expire = moment(doc.otpExpire);
            const diffSeconds = moment.duration(expire.diff(now)).asSeconds();
            if(diffSeconds > 0){
                const payload: TokenPayload = {
                    entityType: doc.entityType,
                    entityId: doc._id
                };
                const token: string = generateToken(payload);
                UserModel.updateOne({email}, { $set: {
                        otpExpire: moment(),
                        emailVerified: true
                    }}, (err: any, doc: any) => {
                    if(err){
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json({
                        token
                    });
                });
            } else {
                return res.status(400).json({
                    message: 'Expired otp'
                });
            }
        } else {
            return res.status(400).json({
                message: 'Invalid otp'
            });
        }
    });
};

export const loginController = {
    loginOrSignup,
    confirm
};
