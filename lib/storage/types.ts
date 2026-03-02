export interface IStorageProvider {
    /**
     * Uploads a file to the storage and returns the public URL or relative path.
     * @param file The file buffer to upload.
     * @param filename The name of the file (including extension).
     * @param folder Optional folder path within the storage.
     */
    upload(file: Buffer, filename: string, folder?: string): Promise<string>;

    /**
     * Deletes a file from the storage.
     * @param path The public URL or relative path of the file to delete.
     */
    delete(path: string): Promise<void>;

    /**
     * Generates a signed URL for temporary access (primarily for cloud storage).
     * @param path The relative path of the file.
     * @param expires In seconds.
     */
    getSignedUrl?(path: string, expires?: number): Promise<string>;
}
