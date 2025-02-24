import React from 'react';
import { Task } from '../types/task';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Download, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsProps {
  tasks: Task[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [
        tasks.filter(t => t.priority === 'high').length,
        tasks.filter(t => t.priority === 'medium').length,
        tasks.filter(t => t.priority === 'low').length,
      ],
      backgroundColor: ['#FCA5A5', '#FCD34D', '#93C5FD'],
    }],
  };

  const categoryData = {
    labels: ['Design', 'Research', 'Documents'],
    datasets: [{
      label: 'Tasks by Category',
      data: [
        tasks.filter(t => t.category === 'design').length,
        tasks.filter(t => t.category === 'research').length,
        tasks.filter(t => t.category === 'documents').length,
      ],
      backgroundColor: ['#818CF8', '#34D399', '#F472B6'],
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tasks by Category',
      },
    },
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Description', 'Status', 'Priority', 'Category', 'Progress', 'Time Spent (min)', 'Deadline', 'Created At'];
    const csvContent = tasks.map(task => [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.category,
      `${task.progress}%`,
      task.timeSpent,
      format(new Date(task.deadline), 'yyyy-MM-dd'),
      format(new Date(task.createdAt), 'yyyy-MM-dd HH:mm:ss')
    ]);

    const csvString = [
      headers.join(','),
      ...csvContent.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Task Management Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 20, 30);

    // Add statistics
    doc.setFontSize(16);
    doc.text('Summary', 20, 45);
    doc.setFontSize(12);
    doc.text([
      `Total Tasks: ${totalTasks}`,
      `Completed: ${completedTasks}`,
      `In Progress: ${inProgressTasks}`,
      `To Do: ${todoTasks}`,
    ], 20, 55);

    // Add task table
    doc.autoTable({
      startY: 80,
      head: [['Title', 'Status', 'Priority', 'Category', 'Progress', 'Deadline']],
      body: tasks.map(task => [
        task.title,
        task.status,
        task.priority,
        task.category,
        `${task.progress}%`,
        format(new Date(task.deadline), 'yyyy-MM-dd')
      ]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8 },
      margin: { top: 80 }
    });

    doc.save(`task-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="btn btn-secondary"
            title="Export to CSV"
          >
            <FileDown className="h-5 w-5 mr-2" />
            CSV
          </button>
          <button
            onClick={exportToPDF}
            className="btn btn-primary"
            title="Export to PDF"
          >
            <Download className="h-5 w-5 mr-2" />
            PDF
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-900">Total Tasks</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalTasks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{inProgressTasks}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">To Do</h3>
          <p className="text-3xl font-bold text-gray-600">{todoTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
          <div className="h-64">
            <Pie data={priorityData} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Tasks by Category</h3>
          <div className="h-64">
            <Bar options={barOptions} data={categoryData} />
          </div>
        </div>
      </div>
    </div>
  );
};