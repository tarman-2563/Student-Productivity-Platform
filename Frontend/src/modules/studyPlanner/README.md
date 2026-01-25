# Study Planner Module

The core module of StudySphere that handles time-based study planning and task management.

## Structure

```
studyPlanner/
├── components/          # React components
│   ├── PlannerHeader.jsx       # Date navigation and stats
│   ├── TaskTimeline.jsx        # List of tasks for selected date
│   ├── StudyTaskCard.jsx       # Individual task display
│   ├── CreateTaskInline.jsx    # Form to create new tasks
│   └── CompleteTaskPanel.jsx   # Task completion with actual time
├── hooks/              # Custom React hooks
│   ├── useDailyTasks.js       # Fetch and manage daily tasks
│   └── usePlannerStats.js     # Calculate task statistics
├── pages/              # Page components
│   └── DailyPlanner.jsx       # Main planner page
├── services/           # API services
│   └── studyTask.api.js       # Study task CRUD operations
├── utils/              # Utility functions
│   └── dateHelpers.js         # Date manipulation helpers
└── index.js            # Module exports
```

## Key Features

- **Time-based Planning**: Tasks are scheduled for specific dates with duration
- **Priority System**: Low, Medium, High priority levels
- **Completion Tracking**: Planned vs actual time tracking
- **Cognitive Load**: Weighted scoring based on priority and duration
- **Real-time Updates**: Automatic refetch after task operations

## Usage

```jsx
import { DailyPlanner } from './modules/studyPlanner';

function App() {
  return <DailyPlanner />;
}
```

## API Integration

The module integrates with the backend API endpoints:
- `GET /api/study-tasks?date=YYYY-MM-DD` - Get daily tasks
- `POST /api/study-tasks` - Create new task
- `PATCH /api/study-tasks/:id` - Update task
- `DELETE /api/study-tasks/:id` - Delete task
- `PATCH /api/study-tasks/:id/complete` - Mark task as completed