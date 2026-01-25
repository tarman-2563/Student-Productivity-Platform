import React, { useState } from "react";
import PlannerHeader from "../components/PlannerHeader";
import TaskTimeline from "../components/TaskTimeline";
import CreateTaskInline from "../components/CreateTaskInline";
import useDailyTasks from "../hooks/useDailyTasks";

const DailyPlanner = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { refetch } = useDailyTasks(selectedDate);

    return (
        <div>
            <PlannerHeader 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate} 
            />
            <TaskTimeline selectedDate={selectedDate} />
            <CreateTaskInline 
                selectedDate={selectedDate} 
                onTaskCreated={refetch}
            />
        </div>
    );
};

export default DailyPlanner;