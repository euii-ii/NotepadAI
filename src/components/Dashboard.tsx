
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Mic, Camera } from 'lucide-react';
import { Note } from '../types/Note';

interface DashboardProps {
  onCreateNote: () => void;
  onSelectNote: (note: Note) => void;
  notes: Note[];
}

const Dashboard = ({ onCreateNote, onSelectNote, notes }: DashboardProps) => {
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
    <div>
      <div className="max-w-md mx-auto px-4 py-3">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 mb-4 animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">
              <span className="text-note">Note</span>
              <span className="text-coral">Plus</span>
            </h1>
            <div className="w-8 h-8 bg-note rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3 pb-20">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`p-4 border-l-4 ${getCategoryColor(note.color)} cursor-pointer hover:shadow-md transition-all duration-200 bg-white/80`}
                onClick={() => onSelectNote(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-note text-lg">{note.title}</h3>
                  <span className="text-sm text-coral font-medium">{note.category}</span>
                </div>
                <p className="text-sm text-note-light mb-2">{note.content}</p>
                {note.isProtected && (
                  <div className="flex items-center mt-2">
                    <div className="w-3 h-3 bg-note-light rounded-full mr-2"></div>
                    <span className="text-xs text-note-light">Password Protected</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
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
  );
};

export default Dashboard;
