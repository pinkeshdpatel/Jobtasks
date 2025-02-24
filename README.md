# TaskMan

A modern task management dashboard built with React, Vite, and Supabase. Features include:

- 📋 Kanban board with drag-and-drop functionality
- 📊 Analytics dashboard with charts and statistics
- 📎 Document management with Google Drive integration
- 📅 Google Calendar integration for meetings
- 🔐 User authentication with Supabase
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Fully responsive design

## Prerequisites

- Node.js 18+
- npm 9+
- A Supabase account
- A Google Cloud project with Calendar API enabled

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pinkeshdpatel/TaskMan.git
   ```

2. Install dependencies:
   ```bash
   cd TaskMan
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

### Task Management
- Create, edit, and delete tasks
- Drag and drop tasks between status columns
- Set task priority, category, and deadline
- Track time spent and progress

### Analytics
- View task distribution by status
- Track completion rates
- Export reports to CSV or PDF

### Document Management
- Link to Google Drive documents
- Organize documents by type
- Quick access to important files

### Calendar Integration
- View upcoming meetings
- Seamless Google Calendar integration
- Meeting details at a glance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.