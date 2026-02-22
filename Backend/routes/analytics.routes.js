const express=require("express");
const {body}=require("express-validator");
const {getAnalyticsData}=require("../controllers/analytics.controller");
const authMiddleware=require("../middleware/auth.middleware");

const analyticsRouter=express.Router();

analyticsRouter.use(authMiddleware);

analyticsRouter.get("/",getAnalyticsData);

module.exports=analyticsRouter;