export interface JWTPayload {
    email: string;    
    given_name: string; 
    nameid: string;    
    jti: string;    
    role: string;      
    nbf: number;     
    exp: number;   
    iat: number;        
    iss: string;       
    aud: string;       
}