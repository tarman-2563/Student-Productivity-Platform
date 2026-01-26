const express=require("express");
const {body}=require("express-validator");
const {createGoal,getGoals,getGoalById,updateGoal,deleteGoal,updateMilestone,getGoalStats,addProgressLog}=require("../controllers/goal.controller");
const authMiddleware=require("../middleware/auth.middleware");

const goalRouter=express.Router();

goalRouter.use(authMiddleware);

const goalValidation=[
    body('title').trim().isLength({min:1,max:200}).withMessage('Title must be between 1 and 200 characters'),
    body('category').trim().isLength({min:1}).withMessage('Category is required'),
    body('targetDate').isISO8601().withMessage('Valid target date is required').custom((value)=>{
        if(new Date(value)<=new Date()){
            throw new Error('Target date must be in the future');
        }
        return true;
    }),
    body('priority').optional().isIn(['Low','Medium','High']).withMessage('Priority must be Low, Medium, or High'),
    body('milestones').optional().isArray().withMessage('Milestones must be an array'),
    body('milestones.*.title').if(body('milestones').exists()).trim().isLength({min:1}).withMessage('Milestone title is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
];

const progressLogValidation=[
    body('description').trim().isLength({min:1,max:500}).withMessage('Description must be between 1 and 500 characters'),
    body('timeSpent').optional().isInt({min:0}).withMessage('Time spent must be a positive number'),
    body('newProgress').optional().isInt({min:0,max:100}).withMessage('Progress must be between 0 and 100'),
    body('mood').optional().isIn(['frustrated','neutral','satisfied','excited']).withMessage('Invalid mood value')
];

goalRouter.post("/",goalValidation,createGoal);
goalRouter.get("/",getGoals);
goalRouter.get("/stats",getGoalStats);
goalRouter.get("/:id",getGoalById);
goalRouter.put("/:id",updateGoal);
goalRouter.delete("/:id",deleteGoal);
goalRouter.patch("/:goalId/milestones/:milestoneId",updateMilestone);
goalRouter.post("/:id/progress",progressLogValidation,addProgressLog);

module.exports=goalRouter;