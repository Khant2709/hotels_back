export const validationQueryParam = (queryParam) => {
    return queryParam === null || typeof queryParam !== 'string' || !queryParam.trim()
};

export const validateResponseBD = (responseBD) => {
    return !responseBD || responseBD.length === 0
}

export const sendError = (res, status, errorMessage, isArray, errorParameters) => {
    return res.status(status).json({
        data: isArray ? [] : {},
        error: errorMessage,
        errorParameters: errorParameters
    });
};