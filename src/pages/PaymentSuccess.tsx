import React, { useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  
  // Extract payment ID from query params if available
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('payment_id');
  
  // Update payment status on component mount if payment ID is available
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (paymentId) {
        try {
          await axios.get(`/api/crypto/payment/${paymentId}`);
        } catch (error) {
          console.error('Error updating payment status:', error);
        }
      }
    };
    
    checkPaymentStatus();
  }, [paymentId]);
  
  return (
    <Container className="py-5">
      <Card className="text-center shadow">
        <Card.Body className="p-5">
          <FaCheckCircle className="text-success mb-4" size={64} />
          <Card.Title className="mb-4 display-6">Payment Successful!</Card.Title>
          <Card.Text>
            Your payment has been processed successfully. The funds will be added to your account
            once the transaction is confirmed on the blockchain.
          </Card.Text>
          
          {paymentId && (
            <Card.Text className="text-muted">
              Payment ID: {paymentId}
            </Card.Text>
          )}
          
          <div className="mt-4">
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentSuccess; 