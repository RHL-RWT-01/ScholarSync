import multer from "multer"
import path from "path"
import type { Express } from "express"

const storage = multer.diskStorage({
  destination: "./uploads", 
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

function fileFilter(_req: any, file: Express.Multer.File, cb: any) {
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only PDF and Word documents are allowed."))
  }
}

export const upload = multer({ storage, fileFilter })
