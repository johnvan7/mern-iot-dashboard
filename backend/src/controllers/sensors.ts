import {Request, Response} from "express";
import mongoose from "mongoose";
import {ReqWithAuth, TokenPayload} from "../types/global";
import {ADMIN, SENSOR} from "../types/entityTypes";
import {SensorModel} from "../models/sensor";
import {generateToken} from "../utils/jwtUtils";
import {userIsAllowed} from "../utils/sensorUtils";
import {UserModel} from "../models/user";

const getById = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {reqToken} = req.query;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'Invalid id',
        });
    }

    const authEntityId = (req as ReqWithAuth).auth.entityId;
    const authEntityType = (req as ReqWithAuth).auth.entityType;

    interface Query {
        _id: string,
        allowedUsers?: string
    }

    const query: Query = {
        _id: id,
    };

    if (authEntityType !== ADMIN) {
        query.allowedUsers = authEntityId;
    }

    try {
        const doc = await SensorModel.findOne(query);
        if (!doc) {
            return res.status(400).json({
                message: 'Sensor not found or forbidden',
            });
        }

        let token: string | undefined = undefined;

        if (!!reqToken){
            const payload: TokenPayload = {
                entityType: doc.entityType,
                entityId: doc._id.toString()
            };
            token = generateToken(payload);
        }

        return res.status(200).json({
            id: doc._id,
            name: doc.name,
            tags: doc.tags,
            description: doc.description,
            unit: doc.unit,
            allowedUsers: doc.allowedUsers,
            location: doc.location,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const getAll = async (req: Request, res: Response) => {
    const authEntityId = (req as ReqWithAuth).auth.entityId;
    const authEntityType = (req as ReqWithAuth).auth.entityType;

    interface Query {
        allowedUsers?: string
    }

    const query: Query = { };

    if (authEntityType !== ADMIN) {
        query.allowedUsers = authEntityId;
    }

    try {
        const docs = await SensorModel.find(query);
        return res.status(200).json(docs.map((doc) => ({
            id: doc._id,
            name: doc.name,
            tags: doc.tags,
            description: doc.description,
            unit: doc.unit,
            allowedUsers: doc.allowedUsers,
            location: doc.location,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        })));
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const createOrUpdate = async (req: Request, res: Response) => {
    let _id = req.body.id;
    const {name, tags, description, unit, location, reqToken} = req.body;

    const authEntityId = (req as ReqWithAuth).auth.entityId;
    const authEntityType = (req as ReqWithAuth).auth.entityType;
    const isNew = _id === undefined;

    if (!isNew) {
        if (!await userIsAllowed(_id, authEntityId, authEntityType)) {
            return res.status(403).json({
                message: 'User not allowed'
            });
        }
    } else {
        _id = new mongoose.Types.ObjectId();
    }

    SensorModel.findOneAndUpdate({_id}, {
        $setOnInsert: {
            entityType: SENSOR,
            allowedUsers: [authEntityId]
        }, $set: {
            name,
            tags,
            description,
            unit,
            location
        }
    }, {upsert: true, new: true}, (err, doc) => {

        if (err) {
            console.log(err.message);
            return res.status(500).json({
                message: 'Server error'
            });
        }

        if (!doc) {
            return res.status(400).json({
                message: 'Invalid body'
            });
        }

        let token: string | undefined = undefined;

        if (isNew || !!reqToken){
            const payload: TokenPayload = {
                entityType: doc.entityType,
                entityId: doc._id.toString()
            };
            token = generateToken(payload);
        }

        return res.status(200).json({
            id: doc._id,
            name: doc.name,
            tags: doc.tags,
            description: doc.description,
            unit: doc.unit,
            allowedUsers: doc.allowedUsers,
            location: doc.location,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            token
        });

    });
};

const deleteById = async (req: Request, res: Response) => {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'Invalid id',
        });
    }

    const authEntityId = (req as ReqWithAuth).auth.entityId;
    const authEntityType = (req as ReqWithAuth).auth.entityType;

    interface Query {
        _id: string,
        allowedUsers?: string
    }

    const query: Query = {
        _id: id,
    };

    if (authEntityType !== ADMIN) {
        query.allowedUsers = authEntityId;
    }

    try {
        const queryRes = await SensorModel.deleteOne(query);
        if(queryRes.deletedCount > 0){
            return res.status(200).json({
                message: 'Sensor deleted',
            });
        } else {
            return res.status(400).json({
                message: 'Sensor not found or forbidden',
            });
        }
    } catch (error) {
        console.log(JSON.stringify(error));
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const addAllowedUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {userId} = req.body;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId) || id === userId) {
        return res.status(400).json({
            message: 'Invalid id',
        });
    }

    const userIdAuth = (req as ReqWithAuth).auth.entityId;
    const authEntityType = (req as ReqWithAuth).auth.entityType;

    try {
        const userExists = !!(await UserModel.findOne({_id: userId}));

        if (!userExists) {
            return res.status(404).json({
                message: 'User not found',
            });
        }


        if (!await userIsAllowed(id, userIdAuth, authEntityType)) {
            return res.status(403).json({
                message: 'Forbidden',
            });
        }

        const doc = await SensorModel.findOneAndUpdate(
            {_id: id},
            {$addToSet: {allowedUsers: userId}},
            {new: true}
        );

        if (!doc) {
            return res.status(404).json({
                message: 'Not found',
            });
        }

        return res.status(200).json({
            message: 'User added',
        });
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

const deleteAllowedUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {userId} = req.body;

    const userIdAuth = (req as ReqWithAuth).auth.entityId;
    const authEntityType = (req as ReqWithAuth).auth.entityType;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId) || id === userId) {
        return res.status(400).json({
            message: 'Invalid id',
        });
    }

    try {
        if (!await userIsAllowed(id, userIdAuth, authEntityType)) {
            return res.status(403).json({
                message: 'Forbidden',
            });
        }

        const doc = await SensorModel.findOneAndUpdate(
            {_id: id},
            {$pull: {allowedUsers: userId}},
            {new: true}
        );

        if (!doc) {
            return res.status(404).json({
                message: 'Not found',
            });
        }

        return res.status(200).json({
            message: 'User removed',
        });
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};

export const sensorsController = {
    getById,
    getAll,
    createOrUpdate,
    deleteById,
    addAllowedUser,
    deleteAllowedUser
};
