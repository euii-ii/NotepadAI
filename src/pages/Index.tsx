
import { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import Dashboard from '../components/Dashboard';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import { Note } from '../types/Note';

const Index = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'list' | 'editor'>('welcome');
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Shopping list',
      content: 'Milk\nBread\nCat food',
      category: 'TODAY',
      date: new Date().toISOString(),
      color: 'coral'
    },
    {
      id: '2',
      title: 'Ideas',
      content: 'Record a vlog for the road trip next week. One long video for YT and another ...',
      category: '25 NOV',
      date: '2024-11-25',
      color: 'orange'
    },
    {
      id: '3',
      title: 'Diary',
      content: 'Today was a good day. I managed to finish most of my tasks...',
      category: '17 NOV',
      date: '2024-11-17',
      color: 'pink',
      isProtected: true
    },
    {
      id: '4',
      title: 'Appointments',
      content: 'Call doctor Smith for a new appointment.\nAsk about the medicine ...',
      category: '15 NOV',
      date: '2024-11-15',
      color: 'purple'
    }
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleGetStarted = () => {
    setCurrentView('dashboard');
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      category: 'TODAY',
      date: new Date().toISOString(),
      color: 'coral'
    };
    setSelectedNote(newNote);
    setCurrentView('editor');
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setCurrentView('editor');
  };

  const handleSaveNote = (note: Note) => {
    setNotes(prev => {
      const existingIndex = prev.findIndex(n => n.id === note.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = note;
        return updated;
      } else {
        return [...prev, note];
      }
    });
    setCurrentView('dashboard');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    setCurrentView('dashboard');
  };

  const handleBack = () => {
    if (currentView === 'editor') {
      setCurrentView('dashboard');
    } else if (currentView === 'list') {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === 'welcome' && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          onCreateNote={handleCreateNote}
          onSelectNote={handleSelectNote}
          notes={notes}
        />
      )}
      
      {currentView === 'list' && (
        <NotesList 
          notes={notes}
          onCreateNote={handleCreateNote}
          onSelectNote={handleSelectNote}
          onBack={handleBack}
        />
      )}
      
      {currentView === 'editor' && selectedNote && (
        <NoteEditor
          note={selectedNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default Index;
