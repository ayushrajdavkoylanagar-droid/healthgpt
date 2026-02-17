import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface HealthScores {
  heartRate: string;
  stressScore: string;
  sleepScore: string;
  emotionScore: string;
  hydrationScore: string;
}

interface WebhookContextType {
  userData: UserData | null;
  healthScores: HealthScores | null;
  setUserData: (data: UserData) => void;
  setHealthScores: (scores: HealthScores) => void;
  sendWebhook: () => Promise<void>;
}

const WebhookContext = createContext<WebhookContextType | undefined>(undefined);

export const useWebhook = () => {
  const context = useContext(WebhookContext);
  if (!context) {
    throw new Error('useWebhook must be used within WebhookProvider');
  }
  return context;
};

interface WebhookProviderProps {
  children: ReactNode;
}

export const WebhookProvider: React.FC<WebhookProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [healthScores, setHealthScores] = useState<HealthScores | null>(null);

  const sendWebhook = async () => {
    if (!userData || !healthScores) {
      console.error('Missing user data or health scores for webhook');
      return;
    }

    try {
      const webhookData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        heartRate: healthScores.heartRate,
        stressScore: healthScores.stressScore,
        sleepScore: healthScores.sleepScore,
        emotionScore: healthScores.emotionScore,
        hydrationScore: healthScores.hydrationScore
      };

      console.log('🚀 Sending webhook with REAL data:');
      console.log('👤 User:', userData);
      console.log('📊 Health:', healthScores);
      console.log('📤 Full payload:', webhookData);

      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'HealthGPT-Real/1.0'
        },
        body: JSON.stringify(webhookData)
      });

      const result = await response.json();
      console.log('✅ Webhook sent successfully:', result);

    } catch (error) {
      console.error('❌ Webhook failed:', error);
    }
  };

  return (
    <WebhookContext.Provider value={{
      userData,
      healthScores,
      setUserData,
      setHealthScores,
      sendWebhook
    }}>
      {children}
    </WebhookContext.Provider>
  );
};
