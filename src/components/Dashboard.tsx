import React, { useState, useEffect } from 'react';
import Navigation, { Footer } from './Navigation';
import StudentForm from './StudentForm';
import PreviousRequests from './PreviousRequests';
import LiveTracking from './LiveTracking';

interface DashboardProps {
  onLogout: () => void;
  registerNumber: string | null;
  onLogin: (registerNumber: string, historyData?: HistoryRequest[]) => void;
  historyData: HistoryRequest[];
}

interface StatusResponse {
  success: boolean;
  status: 'none' | 'under-review' | 'approved-printing' | 'ready-pickup';
  formEnabled: boolean;
  buttonText: string;
  details: {
    hasIdCardRequest: boolean;
    isPrinting: boolean;
    isReadyForPickup: boolean;
  };
}

interface HistoryRequest {
  _id: string;
  registerNumber: string;
  name: string;
  reason: string;
  createdAt: string;
}

interface TransferResponse {
  success: boolean;
  message: string;
  transferredCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, registerNumber, onLogin, historyData }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = not started, 1 = submitted, 2 = under review, 3 = approved, 4 = ready
  const [isPrintingActive, setIsPrintingActive] = useState(false);
  const [isReadyForPickup, setIsReadyForPickup] = useState(false);
  const [formEnabled, setFormEnabled] = useState(false); // Initially disabled
  const [buttonText, setButtonText] = useState('Submit Request');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferMessage, setTransferMessage] = useState<string | null>(null);

  useEffect(() => {
    if (registerNumber) {
      console.log('Checking comprehensive status for register number:', registerNumber);

      // Use comprehensive status endpoint
      fetch(`http://localhost:5000/api/status/${registerNumber}`)
        .then(res => res.ok ? res.json() : { success: false })
        .then((data: StatusResponse) => {
          console.log('Comprehensive status response:', data);

          if (data.success) {
            const { status, formEnabled, buttonText, details } = data;

            setIsPrintingActive(details.isPrinting);
            setIsReadyForPickup(details.isReadyForPickup);
            setFormEnabled(formEnabled);
            setButtonText(buttonText);

            // Map status to currentStep
            switch (status) {
              case 'under-review':
                setCurrentStep(2); // "Under Review"
                console.log('Setting current step to 2 (Under Review)');
                break;
              case 'approved-printing':
                setCurrentStep(3); // "Approved & Printing"
                console.log('Setting current step to 3 (Approved & Printing)');
                break;
              case 'ready-pickup':
                setCurrentStep(4); // "Ready for Pickup"
                console.log('Setting current step to 4 (Ready for Pickup)');
                break;
              case 'none':
              default:
                setCurrentStep(0); // No request submitted
                console.log('Setting current step to 0 (No request)');
                break;
            }
          } else {
            // Fallback to default state if API fails
            setIsPrintingActive(false);
            setIsReadyForPickup(false);
            setFormEnabled(true);
            setButtonText('Submit Request');
            setCurrentStep(0);
          }
        })
        .catch((error) => {
          console.error('Error checking comprehensive status:', error);
          setIsPrintingActive(false);
          setIsReadyForPickup(false);
          setFormEnabled(true);
          setButtonText('Submit Request');
          setCurrentStep(0);
        });
    }
  }, [registerNumber]);

  const handleFormSubmit = () => {
    // If already in printing status, don't change the step
    if (isPrintingActive) {
      console.log('User is already in printing status, keeping current step');
      return;
    }

    setCurrentStep(1); // Move to "Request Submitted"
    console.log('Form submitted, moving to step 1 (Request Submitted)');

    // Simulate progression through steps
    setTimeout(() => {
      if (!isPrintingActive) {
        setCurrentStep(2); // Move to "Under Review"
        console.log('Moving to step 2 (Under Review)');
      }
    }, 2000);

    // Note: Steps 3 and 4 would be triggered by teacher/admin actions in a real app
  };

  const handleTransferToHistory = async () => {
    if (!registerNumber) return;

    setIsTransferring(true);
    setTransferMessage(null);

    try {
      const response = await fetch(`http://localhost:5000/api/acceptedidcards/transfer-to-history/${registerNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: TransferResponse = await response.json();

      if (data.success) {
        setTransferMessage(data.message);
        setFormEnabled(true); // Enable the form when transfer is successful
        // Refresh the status after successful transfer
        fetch(`http://localhost:5000/api/status/${registerNumber}`)
          .then(res => res.ok ? res.json() : { success: false })
          .then((data: StatusResponse) => {
            if (data.success) {
              setIsReadyForPickup(data.details.isReadyForPickup);
            }
          });
      } else {
        setTransferMessage(data.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Error transferring to history:', error);
      setTransferMessage('Error transferring ID cards to history');
    } finally {
      setIsTransferring(false);
    }
  };

  // Determine if form should be disabled
  const isFormDisabled = currentStep > 0;

  return (
    <div className="min-h-screen bg-blue-gradient flex">
      {/* Main Content */}
      <div className="flex-1">
        <Navigation onLogout={onLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
            <p className="text-white/80">Manage your ID card reissue requests</p>

            {isReadyForPickup && (
              <div className="space-y-4">
                <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-200 font-medium">🎉 ID Card Ready for Pickup!</span>
                  </div>
                   <span className="text-white/80">Click the OK button for new submission.</span>
                  <button
                    onClick={handleTransferToHistory}
                    disabled={isTransferring}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTransferring ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'OK'
                    )}
                  </button>

                  {transferMessage && (
                    <div className={`mt-3 p-2 rounded text-sm ${transferMessage.includes('Successfully')
                        ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                        : 'bg-red-500/20 text-red-200 border border-red-400/30'
                      }`}>
                      {transferMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8" id="form">
              <StudentForm
                onSubmit={handleFormSubmit}
                disabled={!formEnabled}
                buttonText={buttonText}
              />

              <div className="block lg:hidden" id="tracking">
                <LiveTracking
                  currentStep={currentStep}
                  printingActive={isPrintingActive}
                  readyForPickup={isReadyForPickup}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8" id="requests">
              <PreviousRequests registerNumber={registerNumber} historyData={historyData} />

              <div className="hidden lg:block">
                <LiveTracking
                  currentStep={currentStep}
                  printingActive={isPrintingActive}
                  readyForPickup={isReadyForPickup}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
