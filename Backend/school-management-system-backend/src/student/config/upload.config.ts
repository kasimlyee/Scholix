import { diskStorage } from 'multer';
import { Options, StorageEngine } from 'multer';
import { Request } from 'express';

interface FileFilterCallback {
  (error: Error | null, acceptFile: boolean): void;
}

interface FilenameCallback {
  (error: Error | null, filename: string): void;
}

interface ExcelFileUploadOptions extends Options {
  storage: StorageEngine;
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => void;
}

export const excelFileUploadOptions: ExcelFileUploadOptions = {
  storage: diskStorage({
    destination: './uploads', //saving in uploads folder
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FilenameCallback,
    ) => {
      const uniqueSuffix = ` ${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, file.fieldname + '-' + uniqueSuffix + '.xlsx');
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(new Error('Only excel files are allowed'), false);
    }
    cb(null, true);
  },
};
