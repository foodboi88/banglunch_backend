export interface IGallery {
    fileName: string;
    filePath: string;
    isMain: boolean;
    foodId: string;
}

export interface IGalleryDB extends IGallery {
    id: string;
}
