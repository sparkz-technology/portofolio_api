// utils/transformErrors.js
export default function transformErrors(details) {
    if (!details || !Array.isArray(details)) {
      return [];
    }
  
    return details.map((detail) => ({
      field: detail.path && detail.path[0],
      message: detail.message ? detail.message.replace(/['"]/g, '') : ''
    }));
  }
  