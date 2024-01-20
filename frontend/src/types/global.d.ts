
type Sensor = {
    id: string;
    name: string;
    tags: string[];
    description: string;
    unit: string;
    allowedUsers: string[];
    location: {
        latitude: double;
        longitude: double;
        altitude: number;
    },
    createdAt: string;
    updatedAt: string;
};
