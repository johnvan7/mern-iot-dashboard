import {Request} from "express";

type TokenPayload = {
    exp?: number;
    entityType: string;
    entityId: string;
};

type ReqWithAuth = Request & {
    auth: {
        entityId: string,
        entityType: string
    }
};

type GeoLocation = {
    latitude: string,
    longitude: string,
    altitude: number
};
