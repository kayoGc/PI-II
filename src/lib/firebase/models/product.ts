import { database } from "../firebase-config";
import { push, ref, get, child, update, remove, set } from "firebase/database";
import { DataSnapshot } from "firebase/database";
import cache from "../../cache/localstorage-service";

export type TypeProduct = {
    id?: string,

    name: string,
    category: string,
    description: string,
    value: number,
    imgName: string | null,
    imgUrl: string | null,
}

// modelo dos produtos
class Product {

    // onde vai ser colocado no firabase
    private refKey: string = "products";

    /**
     * salva o objeto no banco de dados
     * @param name nome do produto
     * @param value valor do produto
     */
    async save(productId: string, obj: TypeProduct): Promise<void> {
        
        // await push(ref(database, this.refKey), {
        //     name: name,
        //     value: value,
        //     imgName: imgName,
        //     imgUrl: imgUrl
        // });     

        await set(ref(database, this.refKey + `/${productId}`), obj);        
    }

    getNewRandomId(): string {
        return push(ref(database, this.refKey)).key;
    }

    /**
     * pega os dados no banco de dados
     * @param id id caso queira pegar um objeto especifico
     * @returns um ou vários objetos do banco de dados
     */
    async getData(id: string | null = null): Promise<TypeProduct[]> {
        let refString = this.refKey;

        if (id !== null) {
            refString += `/${id}`;
        }

        let cacheData = cache.getItem(refString);
        if (cacheData !== null) {
            return JSON.parse(cacheData);
        }
        
        let snapshot: DataSnapshot = await get(child(ref(database), refString));
        let response = snapshot.val();

        if (response === null) return [];

        let objs: any[] = [];
        // transformar objeto em array
        if (typeof response === 'object') {
            objs = Object.values(response);
        } 

        cache.store(refString, JSON.stringify(objs));

        return objs;
    }

    /**
     * atualiza um objeto
     * @param id 
     * @param data 
     */
    async updateObj(id: string, data: object): Promise<void> {
        let updates: any = {};

        updates[`${this.refKey}/${id}`] = data;

        await update(ref(database), updates);

        if (cache.getItem(`${this.refKey}/${id}`) !== null) {
            cache.store(`${this.refKey}/${id}`, data);
        }
    }

    /**
     * Remove um objeto
     * @param id 
     */
    async removeObj(id: string) {
        await remove(ref(database, `${this.refKey}/${id}`));
    }
}

const productService = new Product();
export default productService;