
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Mic, Camera } from 'lucide-react';
import { Note } from '../types/Note';

interface NotesListProps {
  notes: Note[];
  onCreateNote: () => void;
  onSelectNote: (note: Note) => void;
  onBack: () => void;
}

const NotesList = ({ notes, onCreateNote, onSelectNote, onBack }: NotesListProps) => {
  const getCategoryColor = (color: string) => {
    const colors = {
      coral: 'border-l-coral-primary',
      orange: 'border-l-orange-400',
      pink: 'border-l-pink-400',
      purple: 'border-l-purple-400',
      blue: 'border-l-blue-400',
      green: 'border-l-green-400'
    };
    return colors[color as keyof typeof colors] || colors.coral;
  };

  return (
    <div className="min-h-screen bg-coral-gradient">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              <span className="text-note">Note</span>
              <span className="text-coral">Plus</span>
            </h1>
            <div className="w-8 h-8 bg-note rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {notes.map((note) => (
              <Card 
                key={note.id}
                className={`p-4 border-l-4 ${getCategoryColor(note.color)} cursor-pointer hover:shadow-md transition-all duration-200 bg-white/80`}
                onClick={() => onSelectNote(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-note">{note.title}</h3>
                  <span className="text-xs text-coral font-medium">{note.category}</span>
                </div>
                <p className="text-sm text-note-light line-clamp-2">{note.content}</p>
                {note.isProtected && (
                  <div className="flex items-center mt-2">
                    <div className="w-3 h-3 bg-note-light rounded-full mr-2"></div>
                    <span className="text-xs text-note-light">Password Protected</span>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" size="sm" className="text-coral">
              <Mic className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-coral">
              <Camera className="w-5 h-5" />
            </Button>
            <Button 
              onClick={onCreateNote}
              className="bg-coral-gradient hover:opacity-90 text-white rounded-full w-12 h-12 p-0 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesList;
