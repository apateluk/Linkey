export function register() {
    const requiredVariables = ['ADMIN_EMAILS', 
                                'DATABASE_URL', 
                                'DIRECT_URL', 
                                'NUKI_API_URL', 
                                'NUKI_SMARTLOCK_ID', 
                                'NUKI_API_KEY', 
                                'SERVER_ADDRESS', 
                                'AUTH_SECRET', 
                                'AUTH_URL', 
                                'AUTH_GOOGLE_ID', 
                                'AUTH_GOOGLE_SECRET'
                            ];
    try {
        requiredVariables.forEach((variable) => {
            if (!process.env[variable]) {
                console.error(`Error: The ${variable} environment variable is empty or undefined`);
                throw new Error(`The ${variable} environment variable is empty or undefined`);
            }
        });
    } catch (error) {
        console.error(error.message);
    }
}
