// Lista de correos electrónicos autorizados como administradores
export const adminEmails = [
    'admin@limpieza.com',
    'coordinador@limpieza.com',
    // Agrega aquí más correos de administradores
];

// Función para verificar si un email está autorizado como admin
export const isAuthorizedAdmin = (email) => {
    return adminEmails.includes(email.toLowerCase());
};