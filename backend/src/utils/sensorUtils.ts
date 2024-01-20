import {Sensor, SensorModel} from "../models/sensor";
import {ADMIN} from "../types/entityTypes";

const userIsAllowed = async (sensorId: string, userId: string, entityType: string): Promise<boolean> =>
    entityType === ADMIN || !!(await SensorModel.findOne({_id: sensorId, allowedUsers: userId}));

export {userIsAllowed};
