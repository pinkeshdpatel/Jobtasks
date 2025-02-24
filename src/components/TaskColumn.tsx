import React from 'react';
import { Task, Status } from '../types/task';
import { TaskCard } from './TaskCard';
import { Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';

interface TaskColumnProps {
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const statusTitles: Record<Status, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed'
};

const statusColors: Record<Status, string> = {
  'todo': 'bg-white/80',
  'in-progress': 'bg-white/80',
  'completed': 'bg-white/80'
};

export const TaskColumn = React.memo<TaskColumnProps>(({ status, tasks = [], onTaskClick, onDeleteTask }) => {
  return (
    <div className={clsx(
      'rounded-2xl backdrop-blur-sm shadow-xl',
      statusColors[status]
    )}>
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {statusTitles[status]}
          </h2>
          <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-sm">
            {tasks.length}
          </span>
        </div>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              'p-4 min-h-[300px] transition-colors duration-200',
              snapshot.isDraggingOver && 'bg-gray-50/50'
            )}
          >
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                  onDelete={onDeleteTask}
                  index={index}
                />
              ))}
            </div>
            {provided.placeholder}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No tasks yet
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
});