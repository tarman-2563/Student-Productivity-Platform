const express=require("express");
const {body}=require("express-validator");
const {getAnalyticsData,getStudyStats,recordStudySession,seedAnalyticsData}=require("../controllers/analytics.controller");
const authMiddleware=require("../middleware/auth.middleware");

const analyticsRouter=express.Router();

analyticsRouter.use(authMiddleware);

const studySessionValidation=[
    body('taskId').isMongoId().withMessage('Valid task ID is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required').custom((value,{req})=>{
        if(new Date(value)<=new Date(req.body.startTime)){
            throw new Error('End time must be after start time');
        }
        return true;
    }),
    body('focusRating').optional().isInt({min:1,max:5}).withMessage('Focus rating must be between 1 and 5'),
    body('notes').optional().trim().isLength({max:500}).withMessage('Notes must be less than 500 characters')
];

analyticsRouter.get("/",getAnalyticsData);
analyticsRouter.post("/study-stats",getStudyStats);
analyticsRouter.post("/sessions",studySessionValidation,recordStudySession);
analyticsRouter.post("/seed",seedAnalyticsData);

module.exports=analyticsRouter;