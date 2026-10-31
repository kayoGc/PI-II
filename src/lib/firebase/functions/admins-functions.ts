import { functions } from "../firebase-config"
import { httpsCallable } from "firebase/functions"

class AdminFunctions {

    async getAllAdmins() {
        const listAdmins = httpsCallable(functions, 'listAdmins');
        
        try {
            const result = await listAdmins();
            
            return result;
        } catch (err: any) {
            // TODO
            // lidar com erros da função

            return [];
        }
        
    }


}