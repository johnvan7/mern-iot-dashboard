import {ADMIN} from "../types/entityTypes";
import {Sample} from "../models/sample";
import {userIsAllowed} from "./sensorUtils";

const filterSamplesByAllowedSensors = async (samples : any[], authEntityId: string, authEntityType: string): Promise<any[]> => {
    if (authEntityType === ADMIN) {
        return samples;
    }

    const filteredSamples = await Promise.all(samples.map(async (sample) => {
        const sensorId = sample.sensorId;
        const isAllowed = await userIsAllowed(sensorId, authEntityId, authEntityType);
        return isAllowed ? sample : null;
    }));

    return filteredSamples.filter((sample) => sample !== null) as Sample[];
};

export {filterSamplesByAllowedSensors};
