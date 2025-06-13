
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  color: 'coral' | 'orange' | 'pink' | 'purple' | 'blue' | 'green';
  isProtected?: boolean;
}
