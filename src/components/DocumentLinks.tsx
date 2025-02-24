import React, { useState, useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { FileSpreadsheet, FileText, Folder, X, Link as LinkIcon, Plus } from 'lucide-react';
import clsx from 'clsx';

const documentIcons = {
  sheets: FileSpreadsheet,
  docs: FileText,
  drive: Folder,
};

const documentColors = {
  sheets: 'text-green-600',
  docs: 'text-blue-600',
  drive: 'text-yellow-600',
};

export const DocumentLinks: React.FC = () => {
  const { documents, addDocument, removeDocument, loadDocuments } = useDocumentStore();
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    await addDocument(newUrl.trim(), newTitle.trim() || undefined);
    setNewUrl('');
    setNewTitle('');
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this link?')) {
      await removeDocument(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Document Links</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Document
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Document URL
              </label>
              <input
                id="url"
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Paste Google Drive/Docs/Sheets URL"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Document Title (optional)
              </label>
              <input
                id="title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter a custom title"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewUrl('');
                  setNewTitle('');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Document
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const Icon = documentIcons[doc.type];
          return (
            <div
              key={doc.id}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full shadow-sm"
                  title="Remove link"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className={clsx('h-8 w-8', documentColors[doc.type])} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {new URL(doc.url).hostname}
                    </p>
                  </div>
                </div>

                <div className="h-32 bg-gray-50 rounded-lg overflow-hidden">
                  {doc.type === 'docs' && (
                    <div className="h-full flex items-center justify-center text-blue-600 bg-blue-50">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  {doc.type === 'sheets' && (
                    <div className="h-full flex items-center justify-center text-green-600 bg-green-50">
                      <FileSpreadsheet className="w-12 h-12" />
                    </div>
                  )}
                  {doc.type === 'drive' && (
                    <div className="h-full flex items-center justify-center text-yellow-600 bg-yellow-50">
                      <Folder className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </a>
            </div>
          );
        })}
      </div>

      {documents.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <LinkIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500 mb-4">Add your first document link to get started</p>
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Document
          </button>
        </div>
      )}
    </div>
  );
};