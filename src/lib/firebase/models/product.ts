import { database } from "../firebase-config";
import { push, ref, get, child, update, remove, set } from "firebase/database";
import { DataSnapshot } from "firebase/database";

export type TypeProduct = {
    id?: string,

    name: string,
    category: string,
    description: string,
    value: number,
    // imgName: string | null,
    imgUrl: string | null,
    hidden?: boolean,
}

// modelo dos produtos
class Product {

    // onde vai ser colocado no firabase
    private refKey: string = "products";

    private invalidateCache() {
        if (typeof window !== "undefined") {
            localStorage.removeItem(this.refKey);
        }
    }

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

        await set(ref(database, this.refKey + `/${productId}`), { ...obj, id: productId });
        this.invalidateCache();
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

        let snapshot: DataSnapshot = await get(child(ref(database), refString));
        let response = snapshot.val();

        if (response === null) return [];

        if (id !== null) {
            return [{ ...(response as TypeProduct), id }];
        }

        const objs: TypeProduct[] = Object.entries(response as Record<string, TypeProduct>)
            .map(([productId, product]) => ({ ...product, id: product.id || productId }));

        return objs;
    }

    /**
     * atualiza um objeto
     * @param id 
     * @param data 
     */
    async updateObj(id: string, data: Partial<TypeProduct>): Promise<void> {
        const updates: Record<string, unknown> = {};

        for (const [field, value] of Object.entries(data)) {
            if (value !== undefined) {
                updates[`${this.refKey}/${id}/${field}`] = value;
            }
        }

        if (Object.keys(updates).length === 0) return;

        await update(ref(database), updates);
        this.invalidateCache();
    }

    /**
     * Remove um objeto
     * @param id 
     */
    async removeObj(id: string) {
        await remove(ref(database, `${this.refKey}/${id}`));
        this.invalidateCache();
    }
}

const productService = new Product();
export default productService;
