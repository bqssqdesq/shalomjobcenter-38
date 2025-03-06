
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAuth from '@/hooks/useAuth';
import { ProfileSidebar } from '@/components/user/ProfileSidebar';
import { PersonalInfoTab } from '@/components/user/PersonalInfoTab';
import { SecurityTab } from '@/components/user/SecurityTab';
import { PreferencesTab } from '@/components/user/PreferencesTab';
import { ActivityTab } from '@/components/user/ActivityTab';
import { ConnectedAccountsTab } from '@/components/user/ConnectedAccountsTab';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile = () => {
  const { user, updateUserAvatar } = useAuth();
  const [userAvatar, setUserAvatar] = useState<string | undefined>(user?.avatar);
  const isMobile = useIsMobile();
  
  // Charger l'avatar depuis le localStorage au chargement initial du composant seulement
  useEffect(() => {
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setUserAvatar(storedAvatar);
      // Mettre à jour l'avatar dans useAuth seulement au chargement initial
      if (updateUserAvatar && user && user.avatar !== storedAvatar) {
        updateUserAvatar(storedAvatar);
      }
    }
  }, []);  // Dépendances vides pour s'exécuter une seule fois
  
  const handleAvatarChange = (avatarUrl: string) => {
    setUserAvatar(avatarUrl);
    if (updateUserAvatar) {
      updateUserAvatar(avatarUrl);
    }
  };
  
  // Création d'un objet utilisateur mis à jour pour les composants enfants
  const updatedUser = user ? { ...user, avatar: userAvatar || user.avatar } : null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-24">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 mt-4 md:mt-8">Mon profil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Sidebar sur mobile en haut, sur desktop à gauche */}
          <div className={`${isMobile ? 'order-1' : 'lg:col-span-1'}`}>
            <ProfileSidebar 
              user={updatedUser}
              onAvatarChange={handleAvatarChange}
            />
          </div>
          
          <div className={`${isMobile ? 'order-2' : 'lg:col-span-2'}`}>
            <Tabs defaultValue="infos" className="w-full">
              <TabsList className="mb-4 md:mb-6 w-full overflow-x-auto flex-nowrap justify-start md:justify-center">
                <TabsTrigger value="infos" className="flex-shrink-0">Informations</TabsTrigger>
                <TabsTrigger value="security" className="flex-shrink-0">Sécurité</TabsTrigger>
                <TabsTrigger value="connected" className="flex-shrink-0">Comptes liés</TabsTrigger>
                <TabsTrigger value="activity" className="flex-shrink-0">Activité</TabsTrigger>
                <TabsTrigger value="preferences" className="flex-shrink-0">Préférences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="infos">
                <PersonalInfoTab user={updatedUser} />
              </TabsContent>
              
              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>
              
              <TabsContent value="connected">
                <ConnectedAccountsTab />
              </TabsContent>
              
              <TabsContent value="activity">
                <ActivityTab />
              </TabsContent>
              
              <TabsContent value="preferences">
                <PreferencesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
