import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

class AuthService {

    async isUserLogged(): Promise<boolean> {
        
        const isLogged: Awaited<boolean> = await new Promise((resolve, reject) => {
            
            try {
                onAuthStateChanged(auth, (user) => {
                    
                    if (user) {
                        resolve(true);
                    }
    
                    if (!user) {
                        resolve(false);
                    }
    
                })
            } catch (err: any) {
                console.error("erro pegando usuário", err.message);

                resolve(false);
            }
        })

        return isLogged;
    }

    async login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
    }

}

const authService = new AuthService;
export default authService; 