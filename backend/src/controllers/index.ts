import {Request, Response} from "express";

const apiWorks = async (req: Request, res: Response) => {
    res.status(200).json({
        message: 'API is working!'
    });
};

export const apiController = {
    apiWorks
};
