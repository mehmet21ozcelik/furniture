import { LocalProvider } from './local-provider';
import { IStorageProvider } from './types';

class StorageFactory {
    private static instance: IStorageProvider;

    static getInstance(): IStorageProvider {
        if (!this.instance) {
            // For now, always use LocalProvider. 
            // In production, you would check process.env.STORAGE_TYPE
            this.instance = new LocalProvider();
        }
        return this.instance;
    }
}

export const storage = StorageFactory.getInstance();
