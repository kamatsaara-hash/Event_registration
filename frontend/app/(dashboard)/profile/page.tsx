'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/cyber-toast';
import { userAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    college: user?.college || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      await refreshUser();
      addToast({ type: 'success', title: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      addToast({ type: 'error', title: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-foreground mb-8">Profile Settings</h1>

      {/* Profile Card */}
      <div className="glass-panel rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.fullName}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className={cn(
                'inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-full text-xs font-medium',
                user?.emailVerified 
                  ? 'bg-success/10 text-success' 
                  : 'bg-warning/10 text-warning'
              )}>
                {user?.emailVerified ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" />
                    Pending Verification
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </label>
            <Input
              name="fullName"
              value={isEditing ? formData.fullName : user?.fullName || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-input border-border"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </label>
            <Input
              value={user?.email || ''}
              disabled
              className="bg-muted border-border cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </label>
            <Input
              name="phone"
              value={isEditing ? formData.phone : user?.phone || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-input border-border"
            />
          </div>

          {/* College */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              College/University
            </label>
            <Input
              name="college"
              value={isEditing ? formData.college : user?.college || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="bg-input border-border"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: user?.fullName || '',
                      phone: user?.phone || '',
                      college: user?.college || '',
                    });
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
