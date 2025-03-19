
import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface NotificationBarProps {
  message?: string;
  link?: string;
  expiryHours?: number;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ 
  message = "Dernière alerte : 3h restantes pour le forfait Free à 9.99€",
  link = "/mobile",
  expiryHours = 3
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(expiryHours);
  
  useEffect(() => {
    // Mise à jour du temps restant toutes les heures
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 3600000); // 1 heure en millisecondes
    
    return () => clearInterval(timer);
  }, []);
  
  // Vérifier si l'utilisateur a déjà fermé la notification
  useEffect(() => {
    const notificationDismissed = localStorage.getItem('notificationDismissed');
    if (notificationDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('notificationDismissed', 'true');
  };
  
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-0 right-0 z-40 bg-orange-500 dark:bg-orange-600 text-white py-2 px-4 shadow-md"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-white" />
              <span className="text-sm font-medium">
                ⚠️ {message.replace('3h', `${timeLeft}h`)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-orange-600 dark:hover:bg-orange-700 h-8 px-2"
                asChild
              >
                <Link to={link}>Voir l'offre</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-orange-600 dark:hover:bg-orange-700 h-8 w-8 p-0"
                onClick={handleDismiss}
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBar;
