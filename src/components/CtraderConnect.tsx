import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link2 } from 'lucide-react';
import ConnectCTraderModal from './ConnectCTraderModal';

interface CtraderConnectProps {
  challengeEntryId: number;
  onSuccess?: () => void;
}

const CtraderConnect: React.FC<CtraderConnectProps> = ({ 
  challengeEntryId, 
  onSuccess = () => {}
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setModalOpen(true)}
        className="w-full bg-forex-primary hover:bg-forex-primary/90 text-white"
      >
        <Link2 className="mr-2 h-4 w-4" />
        Connect cTrader
      </Button>
      
      <ConnectCTraderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        challengeEntryId={challengeEntryId}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default CtraderConnect; 