import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useTaskStore } from './store/taskStore';
import { useAuthStore } from './store/authStore';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { TaskColumn } from './components/TaskColumn';
import { Analytics } from './components/Analytics';
import { DocumentLinks } from './components/DocumentLinks';
import { Calendar } from './components/Calendar';
import { Auth } from './components/Auth';
import { PlusCircle, LayoutDashboard, BarChart2, LogOut, Search, Link, Calendar as CalendarIcon } from 'lucide-react';
import { Task, Status } from './types/task';

function App() {
  const { user, loading: authLoading, signOut, initialize } = useAuthStore();
  const { tasks, loadTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      Promise.all([loadTasks()]).then(() => setIsReady(true));
    }
  }, [user, loadTasks]);

  useEffect(() => {
    // Check if environment variables are loaded
    const checkEnv = () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing environment variables');
        return false;
      }
      return true;
    };

    setIsLoading(!checkEnv());
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = tasks.find(t => t.id === draggableId);
    if (task) {
      updateTask(task.id, { status: destination.droppableId as Status });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setShowModal(false);
    setSelectedTask(undefined);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  const renderContent = () => {
    if (showAnalytics) {
      return (
        <div className="space-y-8">
          <Analytics tasks={tasks} />
          <Calendar />
        </div>
      );
    }
    if (showLinks) {
      return <DocumentLinks />;
    }
    return (
      <div className="space-y-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TaskColumn
              status="todo"
              tasks={tasksByStatus.todo}
              onTaskClick={handleTaskClick}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              status="in-progress"
              tasks={tasksByStatus['in-progress']}
              onTaskClick={handleTaskClick}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              status="completed"
              tasks={tasksByStatus.completed}
              onTaskClick={handleTaskClick}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </DragDropContext>
        <Calendar />
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">JobTasks</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setShowLinks(false);
                    setSelectedTask(undefined);
                    setShowModal(true);
                  }}
                  className="btn btn-primary flex-shrink-0"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  New Task
                </button>

                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setShowLinks(false);
                  }}
                  className={`btn ${!showAnalytics && !showLinks ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setShowAnalytics(true);
                    setShowLinks(false);
                  }}
                  className={`btn ${showAnalytics ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Analytics</span>
                </button>

                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setShowLinks(true);
                  }}
                  className={`btn ${showLinks ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Link className="h-5 w-5" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Links</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className="btn btn-secondary"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(undefined);
          }}
          onSave={handleSaveTask}
          onDelete={selectedTask ? () => handleDeleteTask(selectedTask.id) : undefined}
        />
      )}
    </div>
  );
}

export default App;