import React from 'react';
import { Task } from '../types/task';
import { Clock, Calendar, Paperclip, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDelete: (id: string) => void;
  index: number;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-purple-100 text-purple-700',
  high: 'bg-red-100 text-red-700',
};

const categoryTags = {
  design: { label: 'Design', class: 'bg-indigo-100 text-indigo-700' },
  research: { label: 'Research', class: 'bg-green-100 text-green-700' },
  documents: { label: 'Docs', class: 'bg-orange-100 text-orange-700' },
};

export const TaskCard = React.memo<TaskCardProps>(({ task, onClick, onDelete, index }) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx(
            'card-gradient rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-white/50',
            {
              'shadow-lg ring-2 ring-indigo-500 ring-opacity-50': snapshot.isDragging,
            }
          )}
          onClick={() => onClick(task)}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging
              ? provided.draggableProps.style?.transform
              : 'none',
          }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-wrap gap-2">
                <span className={clsx('task-tag', categoryTags[task.category].class)}>
                  {categoryTags[task.category].label}
                </span>
                <span className={clsx('task-tag', priorityColors[task.priority])}>
                  {task.priority}
                </span>
              </div>
              <button 
                onClick={handleDelete}
                className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{task.title}</h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {task.description}
            </p>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className={clsx(
                  'flex items-center text-sm',
                  isOverdue ? 'text-red-600' : 'text-gray-500'
                )}>
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>{format(new Date(task.deadline), 'MMM dd')}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{Math.floor(task.timeSpent / 60)}h</span>
                </div>
              </div>

              <div className="flex items-center">
                {task.attachments.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500 mr-3">
                    <Paperclip className="w-4 h-4 mr-1" />
                    {task.attachments.length}
                  </div>
                )}
                
                <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});