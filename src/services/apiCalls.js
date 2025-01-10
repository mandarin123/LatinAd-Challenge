import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.dev.publinet.io/displays',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    }
});

const methodGet = async (url, params = {}) => {
    try {
        const transformedParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((val, index) => {
                    transformedParams.append(`${key}[${index}]`, val);
                });
            } else if (value !== undefined) {
                transformedParams.append(key, value.toString());
            }
        });

        const response = await api.get(`${url}?${transformedParams.toString()}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

const handleApiError = (error) => {
    if (error.response) {
        return {
            status: error.response.status,
            message: error.response.data.message || 'Error en la petición',
            data: error.response.data
        };
    }
    return {
        status: 500,
        message: 'Error de conexión',
        error: error.message
    };
};

export const searchDisplays = async ({
    date_from,
    date_to,
    lat_sw,
    lng_sw,
    lat_ne,
    lng_ne,
    page,
    per_page,
    search,
    location_type,
    price_min,
    price_max,
    size_type
}) => {
    return methodGet('/searchTest', {
        date_from,
        date_to,
        lat_sw,
        lng_sw,
        lat_ne,
        lng_ne,
        page,
        per_page,
        search,
        location_type,
        price_min,
        price_max,
        size_type
    });
};

export {
    methodGet
}; 