import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import MoodJournal from "@/components/dashboard/MoodJournal";
import { JournalEntry } from "@/types/journal";
const MoodJournalPage = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const handleAddJournalEntry = (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      userId: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Mood Journal </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Express your thoughts and track your emotional journey
          </p>
        </div>

        <MoodJournal onAddEntry={handleAddJournalEntry} recentEntries={journalEntries} />
      </main>
    </div>;
};
export default MoodJournalPage;