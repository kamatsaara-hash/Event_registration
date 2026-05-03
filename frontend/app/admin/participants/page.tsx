'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Mail, Phone, Building, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, SkeletonCard } from '@/components/ui/loader';
import { EmptyState } from '@/components/empty-state';
import { useToast } from '@/components/ui/cyber-toast';
import { adminAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  emailVerified: boolean;
  registeredEvents: number;
  createdAt: string;
}

export default function AdminParticipantsPage() {
  const { addToast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchParticipants();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredParticipants(
        participants.filter(
          (p) =>
            p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.college.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredParticipants(participants);
    }
  }, [searchQuery, participants]);

  const fetchParticipants = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getParticipants();
      setParticipants(response.data.participants || []);
    } catch (error) {
      console.error("Failed to fetch participants", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminAPI.deleteParticipant(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      addToast({ type: 'success', title: 'Participant deleted' });
    } catch (error: any) {
      addToast({ type: 'error', title: 'Failed to delete participant', description: error.response?.data?.detail || 'Please try again.' });
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Participants</h1>
          <p className="text-muted-foreground">
            Manage registered participants ({participants.length} total)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-panel rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredParticipants.length === 0 ? (
        <EmptyState
          type="search"
          title="No participants found"
          description={searchQuery ? 'Try adjusting your search' : 'No participants have registered yet'}
        />
      ) : (
        <div className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Participant</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">College</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Events</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((participant) => (
                  <motion.tr
                    key={participant.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{participant.fullName}</p>
                          <p className="text-xs text-muted-foreground">ID: {participant.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {participant.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {participant.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {participant.college}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                        participant.emailVerified
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      )}>
                        {participant.emailVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Pending
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">{participant.registeredEvents}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(participant.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
