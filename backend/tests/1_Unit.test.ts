import {TokenPayload} from "../src/types/global";
import {USER} from "../src/types/entityTypes";
import {ObjectId} from "mongodb";
import {generateToken, validateToken} from "../src/utils/jwtUtils";

describe("jwtUtils test", () => {
    let sharedToken: string;
    let sharedSamplePayload: TokenPayload;

    test("generateToken test", () => {
        sharedSamplePayload = {
            entityType: USER,
            entityId: new ObjectId().toString()
        };

        sharedToken = generateToken(sharedSamplePayload);
        expect(sharedToken).toBeTruthy();
    });

    test("validateToken test", async () => {
        const decodedPayload = await validateToken(sharedToken);

        expect(decodedPayload).toBeTruthy();
        expect(decodedPayload).toHaveProperty('entityType');
        expect(decodedPayload).toHaveProperty('entityId');
        expect(decodedPayload.entityType).toEqual(USER);
        expect(decodedPayload.entityId).toEqual(sharedSamplePayload.entityId);
    });
});
