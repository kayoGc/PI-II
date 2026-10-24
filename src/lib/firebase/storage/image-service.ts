import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

class ImagesService {

    // pasta onde ficarão as imagens
    refName = "images";


    async uploadNewImage(imgName: string, imgData: Blob, getUrl: boolean = true): Promise<string | null>  {
        const newImgRef = ref(storage, `${this.refName}/${imgName}`);

        await uploadBytes(newImgRef, imgData);

        if (!getUrl) return null;

        return await getDownloadURL(newImgRef);
    }


}

const imageService = new ImagesService();

export default imageService;