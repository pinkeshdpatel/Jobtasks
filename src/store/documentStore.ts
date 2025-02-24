import { create } from 'zustand';
import { Document } from '../types/document';
import { supabase } from '../lib/supabase';

interface DocumentState {
  documents: Document[];
  addDocument: (url: string, title?: string) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  loadDocuments: () => Promise<void>;
}

const getDocumentType = (url: string): Document['type'] => {
  if (url.includes('spreadsheets')) return 'sheets';
  if (url.includes('document')) return 'docs';
  return 'drive';
};

const getDocumentTitle = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Handle Google Docs/Sheets URLs
    if (urlObj.hostname.includes('google.com')) {
      const title = urlObj.searchParams.get('title');
      if (title) return decodeURIComponent(title);
    }
    // For other URLs, try to get a meaningful name from the path
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart) {
      // Replace dashes and underscores with spaces and capitalize words
      return lastPart
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Untitled Document';
  } catch {
    return 'Untitled Document';
  }
};

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],

  loadDocuments: async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading documents:', error);
      return;
    }

    set({ documents: data || [] });
  },

  addDocument: async (url: string, title?: string) => {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        title: title || getDocumentTitle(url),
        url,
        type: getDocumentType(url),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding document:', error);
      return;
    }

    if (data) {
      set({ documents: [data, ...get().documents] });
    }
  },

  removeDocument: async (id: string) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing document:', error);
      return;
    }

    set({ documents: get().documents.filter(d => d.id !== id) });
  },
}));