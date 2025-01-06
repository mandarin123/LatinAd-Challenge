import axios from 'axios';

// Configuración base de axios con la URL correcta
const api = axios.create({
    baseURL: 'https://api.dev.publinet.io/displays',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': 'https://latinad.com/',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
});

// Método GET genérico con manejo de arrays en parámetros
const methodGet = async (url, params = {}) => {
    try {
        // Transformamos los parámetros array al formato correcto
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

// Función principal de búsqueda que coincide con la documentación
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