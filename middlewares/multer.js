// import multer from "multer";

// const storage = multer.memoryStorage();

// export const singleUpload = multer ({storage}).single("file");






import multer from 'multer';

const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single('file');

import DataURIParser from 'datauri/parser.js';
import path from 'path';

export const getDataUri = (file) => {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};