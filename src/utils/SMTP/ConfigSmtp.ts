/**
 * Credentials and som info from SMTP server:
 * 
 * host: 'smtp.example.com', // reemplaza con tu servidor SMTP
 * port: 587,
 * secure: false, // true para 465, false para otros puertos
 * auth: {
 *     user: 'user@example.com', // reemplaza con tu usuario
 *     pass: 'password' // reemplaza con tu contraseña
 * }
 */
class configSMTP {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    tls: { rejectUnauthorized: boolean; };

    constructor(host:string,port:number,secure:boolean,user:string,pass:string) {
        this.host = host;
        this.port = port;
        this.secure = secure;
        this.auth = {
            user: user,
            pass: pass
        };
        this.tls = {
            rejectUnauthorized: false
        }
    }
    
}
export default configSMTP;