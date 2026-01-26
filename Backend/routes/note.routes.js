const express=require("express");
const {body}=require("express-validator");
const {createNote,getNotes,getNoteById,updateNote,deleteNote,togglePin,toggleArchive,searchNotes,getNoteStats}=require("../controllers/note.controller");
const authMiddleware=require("../middleware/auth.middleware");

const noteRouter=express.Router();

noteRouter.use(authMiddleware);

const noteValidation=[
    body('title').trim().isLength({min:1,max:200}).withMessage('Title must be between 1 and 200 characters'),
    body('content').trim().isLength({min:1,max:50000}).withMessage('Content must be between 1 and 50,000 characters'),
    body('category').optional().isIn(['personal','work','study','ideas','todo','']).withMessage('Invalid category'),
    body('priority').optional().isIn(['low','medium','high']).withMessage('Priority must be low, medium, or high'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').if(body('tags').exists()).trim().isLength({min:1,max:20}).withMessage('Each tag must be between 1 and 20 characters')
];

noteRouter.post("/",noteValidation,createNote);
noteRouter.get("/",getNotes);
noteRouter.get("/search",searchNotes);
noteRouter.get("/stats",getNoteStats);
noteRouter.get("/:id",getNoteById);
noteRouter.put("/:id",noteValidation,updateNote);
noteRouter.delete("/:id",deleteNote);
noteRouter.patch("/:id/pin",togglePin);
noteRouter.patch("/:id/archive",toggleArchive);

module.exports=noteRouter;