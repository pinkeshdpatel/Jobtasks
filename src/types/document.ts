export interface Document {
  id: string;
  title: string;
  url: string;
  type: 'sheets' | 'docs' | 'drive';
  createdAt: string;
}