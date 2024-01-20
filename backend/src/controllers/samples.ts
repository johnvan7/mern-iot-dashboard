import {Request, Response} from "express";
import {Sample, SampleModel} from "../models/sample";
import {ReqWithAuth} from "../types/global";
import {userIsAllowed} from "../utils/sensorUtils";
import {filterSamplesByAllowedSensors} from "../utils/sampleUtils";

const getById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!id) {
        return res.status(422).send();
    }

    SampleModel.findById(id, {}, async (err, doc) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (!doc) {
            return res.status(404).json({
                message: 'sample not found'
            });
        }

        const authEntityId = (req as ReqWithAuth).auth.entityId;
        const authEntityType = (req as ReqWithAuth).auth.entityType;

        const sensorId = doc!.sensorId;
        if(!await userIsAllowed(sensorId, authEntityId, authEntityType)) {
            return res.status(403).json({
                message: 'User not allowed'
            });
        }

        return res.status(200).json({
            id,
            value: doc!.value,
            sensorId,
            createdAt: doc!.createdAt
        } as Sample);
    })
};

const getAll = async (req: Request, res: Response) => {
    const {sensorId, minValue, maxValue, startDate, endDate} = req.query;

    interface Filter {
        sensorId?: string,
        value?: {
            $gte?: number,
            $lte?: number
        },
        createdAt?: {
            $gte?: Date,
            $lte?: Date
        }
    }

    const filters: Filter = {};

    if (sensorId) {
        filters.sensorId = sensorId as string;
    }
    if (minValue !== undefined) {
        filters.value = {
            ...(filters.value ?? {}),
            $gte: (minValue as any)
        };
    }
    if (maxValue !== undefined) {
        filters.value = {
            ...(filters.value ?? {}),
            $lte: maxValue as any
        };
    }
    if (startDate) {
        filters.createdAt = {
            ...(filters.createdAt ?? {}),
            $gte: startDate as any
        };
    }
    if (endDate) {
        filters.createdAt = {
            ...(filters.createdAt ?? {}),
            $lte: endDate as any
        };
    }

    SampleModel.find(filters).then(samples => {
        const authEntityId = (req as ReqWithAuth).auth.entityId;
        const authEntityType = (req as ReqWithAuth).auth.entityType;

        filterSamplesByAllowedSensors(samples, authEntityId, authEntityType)
            .then(filteredSamples => {
                const formattedSamples = filteredSamples.map(sample => ({
                    id: sample._id,
                    value: sample.value,
                    sensorId: sample.sensorId,
                    createdAt: sample.createdAt
                }));

                return res.status(200).json({
                    filters,
                    samples: formattedSamples
                });
            }).catch(err => {
            console.log(err.message);
            return res.status(500).json({
                message: 'Server error'
            });
        });
    }).catch(err => {
        console.log(err.message);
        return res.status(500).json({
            message: 'Server error'
        });
    });
};

const create = async (req: Request, res: Response) => {
    const {value} = req.body;

    if (!value) {
        return res.status(422).json({
            message: 'value is required'
        });
    }

    const authEntityId = (req as ReqWithAuth).auth.entityId;

    const sample = new SampleModel({value, sensorId: authEntityId});

    sample.save((err) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        return res.status(201).send();
    });
};

export const samplesController = {
    getById,
    getAll,
    create
};
