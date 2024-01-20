export const googleMapToken: string = import.meta.env.VITE_APP_MAPS_TOKEN || '';

export const isDev: boolean = !import.meta.env.NODE_ENV || import.meta.env.NODE_ENV === 'development';
