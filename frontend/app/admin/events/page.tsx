'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Users, User, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/empty-state';
import { useToast } from '@/components/ui/cyber-toast';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  name: string;
  type: 'solo' | 'group';
  description: string;
  maxTeamSize?: number;
  registrations: number;
}

export default function AdminEventsPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'solo' as 'solo' | 'group',
    description: '',
    maxTeamSize: 4,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getEvents();
      setEvents(Array.isArray(response.data) ? response.data : (response.data.events || []));
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name,
        type: event.type,
        description: event.description,
        maxTeamSize: event.maxTeamSize || 4,
      });
    } else {
      setEditingEvent(null);
      setFormData({ name: '', type: 'solo', description: '', maxTeamSize: 4 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({ name: '', type: 'solo', description: '', maxTeamSize: 4 });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      addToast({ type: 'error', title: 'Please fill in all fields' });
      return;
    }

    setIsSaving(true);
    try {
      if (editingEvent) {
        await adminAPI.updateEvent(editingEvent.id, formData);
        setEvents((prev) =>
          prev.map((e) =>
            e.id === editingEvent.id ? { ...e, ...formData } : e
          )
        );
        addToast({ type: 'success', title: 'Event updated successfully' });
      } else {
        const response = await adminAPI.createEvent(formData);
        const newEvent = { ...formData, id: response.data.id || Date.now().toString(), registrations: 0 };
        setEvents((prev) => [...prev, newEvent]);
        addToast({ type: 'success', title: 'Event created successfully' });
      }
      closeModal();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Failed to save event', description: error.response?.data?.detail || 'Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminAPI.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      addToast({ type: 'success', title: 'Event deleted' });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Failed to delete event', description: error.response?.data?.detail || 'Please try again.' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
          <p className="text-muted-foreground">
            Manage events and competitions ({events.length} total)
          </p>
        </div>
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Search */}
      <div className="glass-panel rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          type="events"
          title="No events found"
          action={{ label: 'Add Event', onClick: () => openModal() }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-xl border border-border p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  event.type === 'solo' ? 'bg-secondary/20' : 'bg-primary/20'
                )}>
                  {event.type === 'solo' ? (
                    <User className="h-5 w-5 text-secondary" />
                  ) : (
                    <Users className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openModal(event)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(event.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-1">{event.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>

              <div className="flex items-center justify-between text-sm">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  event.type === 'solo' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                )}>
                  {event.type === 'solo' ? 'Solo' : `Team (2-${event.maxTeamSize})`}
                </span>
                <span className="text-muted-foreground">{event.registrations} registrations</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-xl border border-primary/20 w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Event Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="bg-input border-border"
                    placeholder="Enter event name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <div className="flex gap-2">
                    {(['solo', 'group'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData((p) => ({ ...p, type }))}
                        className={cn(
                          'flex-1 py-2 rounded-lg border transition-all capitalize',
                          formData.type === type
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-muted border-border text-muted-foreground'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.type === 'group' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Max Team Size</label>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5, 6].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFormData((p) => ({ ...p, maxTeamSize: size }))}
                          className={cn(
                            'flex-1 py-2 rounded-lg border transition-all',
                            formData.maxTeamSize === size
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-muted border-border text-muted-foreground'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    className="w-full h-24 px-3 py-2 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Event'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
