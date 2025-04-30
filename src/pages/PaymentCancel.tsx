import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const PaymentCancel: React.FC = () => {
  const location = useLocation();
  
  // Extract payment ID from query params if available
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('payment_id');
  
  return (
    <Container className="py-5">
      <Card className="text-center shadow">
        <Card.Body className="p-5">
          <FaTimesCircle className="text-danger mb-4" size={64} />
          <Card.Title className="mb-4 display-6">Payment Cancelled</Card.Title>
          <Card.Text>
            Your payment has been cancelled. No funds have been deducted from your account.
          </Card.Text>
          
          {paymentId && (
            <Card.Text className="text-muted">
              Payment ID: {paymentId}
            </Card.Text>
          )}
          
          <div className="mt-4">
            <Link to="/dashboard">
              <Button variant="primary" size="lg" className="me-3">
                Return to Dashboard
              </Button>
            </Link>
            <Link to="/wallet">
              <Button variant="outline-primary" size="lg">
                Try Again
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentCancel; 