
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Request {
  _id: string;
  registerNumber: string;
  name: string;
  reason: string;
  createdAt: string;
}

interface HistoryRequest {
  _id: string;
  registerNumber: string;
  name: string;
  reason: string;
  createdAt: string;
}

interface PreviousRequestsProps {
  registerNumber: string | null;
  historyData: HistoryRequest[]; // New prop for historical data
}

const PreviousRequests: React.FC<PreviousRequestsProps> = ({ registerNumber, historyData }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!registerNumber) {
        setRequests([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching accepted ID cards for register number:', registerNumber);
        const res = await fetch(`http://localhost:5000/api/acceptedidcards/user/${registerNumber}`);
        const data = await res.json();
        console.log('Accepted ID cards response:', data);
        
        let acceptedRequests: Request[] = [];
        if (Array.isArray(data)) {
          acceptedRequests = data;
        } else if (Array.isArray(data.requests)) {
          acceptedRequests = data.requests;
        }

        // Combine accepted requests with historical data
        const allRequests = [...acceptedRequests, ...historyData];
        setRequests(allRequests);
      } catch (err) {
        console.error('Error fetching accepted ID cards:', err);
        setError('Failed to load previous requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [registerNumber, historyData]);

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Previous IDCards Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p className="text-white/70 text-center py-8">Loading...</p>
          ) : error ? (
            <p className="text-red-400 text-center py-8">{error}</p>
          ) : requests.length === 0 ? (
            <p className="text-white/70 text-center py-8">No ID cards found.</p>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">{request.name}</span>
                    <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full">✓ Accepted</span>
                  </div>
                  <p className="text-white/80 text-sm">Register Number: {request.registerNumber}</p>
                  {request.reason && <p className="text-white/80 text-sm">Reason: {request.reason}</p>}
                  <p className="text-white/60 text-xs">Accepted on {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviousRequests;
