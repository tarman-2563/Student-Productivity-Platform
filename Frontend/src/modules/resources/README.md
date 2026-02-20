# Resource Library Module

## Overview
The Resource Library is a comprehensive file management system that allows users to upload, organize, and access their study materials including PDFs, images, documents, and external links.

## Features

### 1. **File Upload & Management**
- Upload multiple file types: PDF, Images (JPG, PNG, GIF), Documents (DOC, DOCX, TXT, PPT, XLSX), Videos, Audio
- Maximum file size: 10MB per file
- Drag-and-drop interface
- File preview and metadata display
- Download functionality

### 2. **External Link Management**
- Add web resources (YouTube videos, articles, online courses)
- Quick access to external materials
- Link validation

### 3. **Organization & Categorization**
- **By Subject**: Mathematics, Science, Programming, etc.
- **By Category**: Study Material, Lecture Notes, Practice Problems, Reference, Assignment, Project
- **By Type**: PDF, Image, Link, Document, Video
- **Tags**: Custom tags for flexible organization
- **Favorites**: Star important resources for quick access

### 4. **Search & Filter**
- Full-text search across titles, descriptions, and tags
- Filter by type, category, subject
- Sort by: Newest, Title, Most Viewed, Most Downloaded
- Favorites-only view

### 5. **Statistics & Analytics**
- Total resources count
- Storage usage tracking
- View count per resource
- Download count tracking
- Subject and type breakdowns

### 6. **Integration with Other Modules**
- Link resources to Notes
- Link resources to Study Tasks
- Link resources to Goals
- Quick access from related items

### 7. **Cloud Storage Support** (Ready for Integration)
- Local storage (default)
- Cloudinary integration ready
- AWS S3 integration ready
- Google Drive integration ready
- Dropbox integration ready

## API Endpoints

### Resources
- `POST /api/resources` - Upload/create resource
- `GET /api/resources` - Get all resources with filters
- `GET /api/resources/:id` - Get resource by ID
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `PATCH /api/resources/:id/favorite` - Toggle favorite
- `GET /api/resources/:id/download` - Download resource
- `GET /api/resources/stats` - Get statistics
- `GET /api/resources/subject/:subject` - Get resources by subject

### Linking
- `POST /api/resources/:id/link` - Link to note/task/goal
- `POST /api/resources/:id/unlink` - Unlink from note/task/goal

## Components

### Pages
- **ResourceLibrary.jsx** - Main page with grid view and filters

### Components
- **UploadResourceModal.jsx** - File upload and link addition modal
- **ResourceCard.jsx** - Individual resource card display
- **ResourceGrid.jsx** - Grid layout for resources
- **ResourceDetailModal.jsx** - Detailed view with actions
- **ResourceFilters.jsx** - Search and filter controls
- **ResourceStats.jsx** - Statistics dashboard

### Services
- **resource.api.js** - API integration layer

### Hooks
- **useResources.js** - Resource state management

## Usage

### Basic Usage
```jsx
import ResourceLibrary from './modules/resources/pages/ResourceLibrary';

function App() {
  return <ResourceLibrary />;
}
```

### Upload a Resource
1. Click "Add Resource" button
2. Choose "Upload File" or "Add Link"
3. Select file or enter URL
4. Fill in title, description, category, subject
5. Add optional tags
6. Click "Add Resource"

### Link Resource to Note/Task/Goal
```javascript
import { linkResource } from './services/resource.api';

// Link to a note
await linkResource(resourceId, 'note', noteId);

// Link to a task
await linkResource(resourceId, 'task', taskId);

// Link to a goal
await linkResource(resourceId, 'goal', goalId);
```

### Quick Access from Other Modules
```javascript
import { getResourcesBySubject } from './services/resource.api';

// Get resources for a specific subject
const resources = await getResourcesBySubject('Mathematics');
```

## Data Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  description: String,
  type: 'pdf' | 'image' | 'link' | 'document' | 'video' | 'other',
  category: String,
  subject: String,
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  externalUrl: String,
  cloudProvider: 'local' | 'cloudinary' | 's3' | 'drive' | 'dropbox',
  cloudFileId: String,
  tags: [String],
  isFavorite: Boolean,
  linkedNotes: [ObjectId],
  linkedTasks: [ObjectId],
  linkedGoals: [ObjectId],
  viewCount: Number,
  downloadCount: Number,
  lastAccessedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## File Storage

### Local Storage (Default)
Files are stored in `Backend/uploads/` directory with unique filenames.

### Cloud Storage Integration

#### Cloudinary Setup
```javascript
// Install: npm install cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload to Cloudinary
const result = await cloudinary.uploader.upload(file.path, {
  folder: 'studysphere/resources',
  resource_type: 'auto'
});
```

#### AWS S3 Setup
```javascript
// Install: npm install @aws-sdk/client-s3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
```

## Security

### File Upload Security
- File type validation (whitelist)
- File size limits (10MB)
- Virus scanning (recommended for production)
- Secure file naming (UUID-based)

### Access Control
- User authentication required
- Users can only access their own resources
- JWT token validation on all endpoints

## Performance Optimization

### Database Indexes
- userId + category
- userId + subject
- userId + type
- Full-text search on title, description, tags

### Caching Strategy
- Cache frequently accessed resources
- CDN for static files (when using cloud storage)
- Lazy loading for resource grid

## Future Enhancements

1. **Batch Operations**
   - Multi-select resources
   - Bulk delete/move/tag

2. **Folders/Collections**
   - Organize resources into folders
   - Nested folder structure

3. **Sharing**
   - Share resources with other users
   - Public/private resource links

4. **OCR for PDFs**
   - Extract text from scanned documents
   - Make PDFs searchable

5. **Preview Generation**
   - Thumbnail generation for images
   - PDF preview
   - Video thumbnails

6. **Version Control**
   - Track resource versions
   - Restore previous versions

7. **Collaboration**
   - Comments on resources
   - Annotations
   - Shared study groups

8. **Mobile App**
   - Offline access
   - Camera upload
   - Quick capture

## Troubleshooting

### Upload Fails
- Check file size (max 10MB)
- Verify file type is allowed
- Ensure uploads directory exists and is writable

### Files Not Displaying
- Check file permissions
- Verify file URL is correct
- Check server static file serving configuration

### Search Not Working
- Ensure text indexes are created
- Check MongoDB text search configuration

## Best Practices

1. **File Naming**: Use descriptive titles
2. **Tagging**: Add relevant tags for better searchability
3. **Organization**: Categorize by subject and type
4. **Cleanup**: Regularly archive or delete unused resources
5. **Backup**: Keep backups of important files
6. **Cloud Storage**: Use cloud storage for production deployments

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Contact support team
