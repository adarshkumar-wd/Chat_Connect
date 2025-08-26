import multer from "multer";
import {v4 as uuid} from 'uuid'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('public', 'temp'));
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname.split(".")[0].replace(" " , "-") + uuid() + "." + file.originalname.split(".")[1])  
    }
  })

  export const upload = multer({ storage : storage }) 