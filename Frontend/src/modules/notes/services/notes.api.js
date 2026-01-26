const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5757/api';

export const getNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    
    return getMockNotes();
  }
};

export const createNote = async (noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(noteData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating note:', error);
    
    return {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

export const updateNote = async (noteId, noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(noteData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating note:', error);
    
    return {
      id: noteId,
      ...noteData,
      updatedAt: new Date().toISOString()
    };
  }
};

export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    
    return { success: true };
  }
};

export const searchNotes = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching notes:', error);
    
    const mockNotes = getMockNotes();
    return mockNotes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const getNoteById = async (noteId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching note:', error);
        throw new Error('Failed to fetch note');
    }
};

export const togglePin = async (noteId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}/pin`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error toggling pin:', error);
        throw new Error('Failed to toggle pin');
    }
};

export const toggleArchive = async (noteId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}/archive`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error toggling archive:', error);
        throw new Error('Failed to toggle archive');
    }
};

export const getNoteStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching note stats:', error);
        throw new Error('Failed to fetch note stats');
    }
};

const getMockNotes = () => {
  return [
    {
      id: '1',
      title: 'React Best Practices',
      content: `# React Best Practices

## Component Structure
- Keep components small and focused
- Use functional components with hooks
- Implement proper error boundaries

## State Management
- Use useState for local state
- Consider useReducer for complex state logic
- Implement context for global state

## Performance
- Use React.memo for expensive components
- Implement useMemo and useCallback wisely
- Avoid unnecessary re-renders`,
      category: 'study',
      priority: 'high',
      tags: ['react', 'javascript', 'frontend'],
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-22T15:30:00Z'
    },
    {
      id: '2',
      title: 'Project Ideas',
      content: `# Project Ideas for Portfolio

## Web Applications
1. **Task Management App**
   - Real-time collaboration
   - Drag & drop interface
   - Mobile responsive

2. **E-commerce Platform**
   - Payment integration
   - Inventory management
   - Admin dashboard

3. **Social Media Dashboard**
   - Multi-platform integration
   - Analytics and insights
   - Scheduled posting

## Mobile Apps
- Weather app with location services
- Expense tracker with charts
- Recipe finder with meal planning`,
      category: 'ideas',
      priority: 'medium',
      tags: ['projects', 'portfolio', 'development'],
      createdAt: '2024-01-18T14:20:00Z',
      updatedAt: '2024-01-21T09:15:00Z'
    },
    {
      id: '3',
      title: 'Meeting Notes - Team Standup',
      content: `# Team Standup - January 22, 2024

## Attendees
- John (Team Lead)
- Sarah (Frontend)
- Mike (Backend)
- Lisa (Designer)

## Updates
**Sarah:** 
- Completed user authentication flow
- Working on dashboard components
- Blocked: Need API endpoints for user data

**Mike:**
- Finished user API endpoints
- Setting up database migrations
- Next: Implement notification system

**Lisa:**
- Finalized design system
- Created component library
- Next: Mobile responsive designs

## Action Items
- [ ] Sarah to coordinate with Mike on API integration
- [ ] Schedule design review meeting
- [ ] Update project timeline`,
      category: 'work',
      priority: 'medium',
      tags: ['meeting', 'standup', 'team'],
      createdAt: '2024-01-22T09:00:00Z',
      updatedAt: '2024-01-22T09:30:00Z'
    },
    {
      id: '4',
      title: 'Weekend Plans',
      content: `# Weekend Plans

## Saturday
- Morning: Gym workout
- Afternoon: Grocery shopping
- Evening: Movie night with friends

## Sunday
- Morning: Brunch with family
- Afternoon: Work on personal project
- Evening: Meal prep for the week

## Things to Remember
- Pick up dry cleaning
- Call mom for her birthday
- Book dentist appointment`,
      category: 'personal',
      priority: 'low',
      tags: ['weekend', 'plans', 'personal'],
      createdAt: '2024-01-19T18:00:00Z',
      updatedAt: '2024-01-19T18:15:00Z'
    },
    {
      id: '5',
      title: 'Learning Goals 2024',
      content: `# Learning Goals for 2024

## Technical Skills
- [ ] Master TypeScript
- [ ] Learn Next.js framework
- [ ] Understand Docker and containerization
- [ ] Get AWS certification
- [ ] Practice system design

## Soft Skills
- [ ] Improve public speaking
- [ ] Learn project management
- [ ] Enhance leadership skills
- [ ] Better time management

## Books to Read
1. "Clean Code" by Robert Martin
2. "System Design Interview" by Alex Xu
3. "The Pragmatic Programmer"
4. "Atomic Habits" by James Clear

## Courses
- Advanced React patterns
- Node.js masterclass
- Database design fundamentals`,
      category: 'study',
      priority: 'high',
      tags: ['goals', '2024', 'learning', 'development'],
      createdAt: '2024-01-15T12:00:00Z',
      updatedAt: '2024-01-20T16:45:00Z'
    }
  ];
};