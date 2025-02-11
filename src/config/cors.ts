import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    
    origin: function(origin, callback) {
        console.log('Solicitud desde origen:', origin);
        const whiteList = [process.env.FRONTEND_URL]

        if (process.argv[2] === '--api') {
            whiteList.push(undefined)
        }

        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            console.error(`CORS rechazado para: ${origin}`);
            callback(new Error('Error de CORS'))
        }
    }
}