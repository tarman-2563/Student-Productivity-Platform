const Note=require("../models/noteSchema");
const {validationResult}=require("express-validator");
const mongoose=require("mongoose");

const createNote=async(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message:"Validation failed",errors:errors.array()});
        }
        const {title,content,category,priority,tags}=req.body;
        const newNote=await Note.create({
            userId:req.user.id,
            title,
            content,
            category,
            priority,
            tags:tags || []
        });
        res.status(201).json({message:"Note created successfully",note:newNote});
    }
    catch(err){
        console.error("Create note error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getNotes=async(req,res)=>{
    try{
        const {category,priority,search,sortBy='updatedAt',sortOrder='desc',page=1,limit=20,archived=false}=req.query;
        const filter={userId:req.user.id,isArchived:archived==='true'};
        if(category && category!=='all') filter.category=category;
        if(priority && priority!=='all') filter.priority=priority;
        let query=Note.find(filter);
        if(search){
            query=query.find({$text:{$search:search}});
        }
        const sortOptions={};
        sortOptions[sortBy]=sortOrder==='desc' ? -1 : 1;
        if(sortBy!=='isPinned'){
            sortOptions.isPinned=-1;
        }
        query=query.sort(sortOptions);
        const skip=(parseInt(page)-1)*parseInt(limit);
        query=query.skip(skip).limit(parseInt(limit));
        const notes=await query;
        const totalNotes=await Note.countDocuments(filter);
        res.status(200).json({
            notes,
            pagination:{
                currentPage:parseInt(page),
                totalPages:Math.ceil(totalNotes/parseInt(limit)),
                totalNotes,
                hasNext:skip+notes.length<totalNotes,
                hasPrev:parseInt(page)>1
            }
        });
    }
    catch(err){
        console.error("Get notes error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getNoteById=async(req,res)=>{
    try{
        const noteId=req.params.id;
        const note=await Note.findOne({_id:noteId,userId:req.user.id});
        if(!note){
            return res.status(404).json({message:"Note not found"});
        }
        note.lastViewedAt=new Date();
        await note.save();
        res.status(200).json({note});
    }
    catch(err){
        console.error("Get note by ID error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const updateNote=async(req,res)=>{
    try{
        const noteId=req.params.id;
        const note=await Note.findOne({_id:noteId,userId:req.user.id});
        if(!note){
            return res.status(404).json({message:"Note not found"});
        }
        Object.assign(note,req.body);
        await note.save();
        res.status(200).json({message:"Note updated successfully",note});
    }
    catch(err){
        console.error("Update note error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const deleteNote=async(req,res)=>{
    try{
        const noteId=req.params.id;
        const note=await Note.findOne({_id:noteId,userId:req.user.id});
        if(!note){
            return res.status(404).json({message:"Note not found"});
        }
        await note.deleteOne();
        res.status(200).json({message:"Note deleted successfully"});
    }
    catch(err){
        console.error("Delete note error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const togglePin=async(req,res)=>{
    try{
        const noteId=req.params.id;
        const note=await Note.findOne({_id:noteId,userId:req.user.id});
        if(!note){
            return res.status(404).json({message:"Note not found"});
        }
        note.isPinned=!note.isPinned;
        await note.save();
        res.status(200).json({message:`Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,note});
    }
    catch(err){
        console.error("Toggle pin error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const toggleArchive=async(req,res)=>{
    try{
        const noteId=req.params.id;
        const note=await Note.findOne({_id:noteId,userId:req.user.id});
        if(!note){
            return res.status(404).json({message:"Note not found"});
        }
        note.isArchived=!note.isArchived;
        if(note.isArchived){
            note.isPinned=false;
        }
        await note.save();
        res.status(200).json({message:`Note ${note.isArchived ? 'archived' : 'unarchived'} successfully`,note});
    }
    catch(err){
        console.error("Toggle archive error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const searchNotes=async(req,res)=>{
    try{
        const {q,limit=10}=req.query;
        if(!q || q.trim().length<2){
            return res.status(400).json({message:"Search query must be at least 2 characters"});
        }
        const notes=await Note.find({
            userId:req.user.id,
            isArchived:false,
            $text:{$search:q}
        })
        .select('title content category tags createdAt updatedAt')
        .limit(parseInt(limit))
        .sort({score:{$meta:'textScore'}});
        res.status(200).json({notes,query:q,count:notes.length});
    }
    catch(err){
        console.error("Search notes error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

const getNoteStats=async(req,res)=>{
    try{
        const userId=req.user.id;
        const stats=await Note.aggregate([
            {$match:{userId:new mongoose.Types.ObjectId(userId)}},
            {
                $group:{
                    _id:null,
                    totalNotes:{$sum:1},
                    archivedNotes:{$sum:{$cond:["$isArchived",1,0]}},
                    pinnedNotes:{$sum:{$cond:["$isPinned",1,0]}},
                    totalWords:{
                        $sum:{
                            $size:{
                                $split:[
                                    {$trim:{input:"$content"}},
                                    " "
                                ]
                            }
                        }
                    }
                }
            }
        ]);
        const categoryStats=await Note.aggregate([
            {$match:{userId:new mongoose.Types.ObjectId(userId),isArchived:false}},
            {$group:{_id:"$category",count:{$sum:1}}},
            {$sort:{count:-1}}
        ]);
        const result=stats[0] || {
            totalNotes:0,
            archivedNotes:0,
            pinnedNotes:0,
            totalWords:0
        };
        result.categoryBreakdown=categoryStats;
        result.activeNotes=result.totalNotes-result.archivedNotes;
        res.status(200).json({stats:result});
    }
    catch(err){
        console.error("Get note stats error:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
};

module.exports={
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    searchNotes,
    getNoteStats
};