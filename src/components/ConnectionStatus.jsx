import React, { useState, useEffect } from 'react';
import { healthCheck } from '../lib/api.js';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await healthCheck();
        setStatus('connected');
        setError(null);
      } catch (err) {
        setStatus('disconnected');
        setError(err.message);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle2,
          color: 'bg-green-50 border-green-200 text-green-800',
          iconColor: 'text-green-600',
          title: 'Connected',
          message: 'Server is running and database is connected.'
        };
      case 'disconnected':
        return {
          icon: XCircle,
          color: 'bg-red-50 border-red-200 text-red-800',
          iconColor: 'text-red-600',
          title: 'Disconnected',
          message: error || 'Unable to connect to server. Please ensure MongoDB and the server are running.'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          iconColor: 'text-yellow-600',
          title: 'Checking Connection',
          message: 'Verifying server connection...'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-xl p-4 mb-6 border ${config.color}`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className={config.iconColor} />
        <div className="flex-1">
          <h4 className="font-medium mb-1">{config.title}</h4>
          <p className="text-sm">{config.message}</p>
          {status === 'disconnected' && (
            <div className="mt-2 text-sm">
              <p className="font-medium">To get started:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Install MongoDB locally or use MongoDB Atlas</li>
                <li>Create a <code className="bg-black bg-opacity-10 px-1 rounded">.env</code> file with your MongoDB connection string</li>
                <li>Run <code className="bg-black bg-opacity-10 px-1 rounded">npm run dev</code> to start both client and server</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};