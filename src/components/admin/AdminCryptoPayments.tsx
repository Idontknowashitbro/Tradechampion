import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Badge, 
  Form, 
  InputGroup, 
  Spinner, 
  Alert,
  Modal,
  Pagination
} from 'react-bootstrap';
import { FaSearch, FaSync, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

interface CryptoPayment {
  id: number;
  userId: string;
  paymentId: string;
  invoiceId: string | null;
  amount: number;
  cryptoCurrency: string;
  paymentAddress: string;
  actualCryptoAmount: number | null;
  status: string;
  description: string;
  callbackUrl: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  }
}

const AdminCryptoPayments: React.FC = () => {
  const [payments, setPayments] = useState<CryptoPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<CryptoPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<CryptoPayment | null>(null);

  // Fetch all crypto payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get('/api/admin/crypto/payments');
        setPayments(response.data.payments);
        setTotalPages(Math.ceil(response.data.payments.length / itemsPerPage));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment data');
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [refreshKey, itemsPerPage]);

  // Filter payments based on search term and status
  useEffect(() => {
    let result = payments;
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Filter by search term (check payment ID, crypto address, and user info)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(payment => 
        payment.paymentId.toLowerCase().includes(term) ||
        payment.paymentAddress.toLowerCase().includes(term) ||
        (payment.user?.name && payment.user.name.toLowerCase().includes(term)) ||
        (payment.user?.email && payment.user.email.toLowerCase().includes(term))
      );
    }
    
    setFilteredPayments(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, statusFilter, payments, itemsPerPage]);

  // Get current page items
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Check payment status from API
  const checkPaymentStatus = async (paymentId: string) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`/api/admin/crypto/payments/${paymentId}/refresh`);
      
      // Update payment in local state
      setPayments(payments.map(p => 
        p.paymentId === paymentId ? { ...p, ...response.data } : p
      ));
      
      setSuccess(`Payment status updated: ${response.data.status}`);
      setLoading(false);
      
      // Refresh after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to refresh payment status');
      setLoading(false);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finished':
        return <Badge bg="success">Finished</Badge>;
      case 'waiting':
        return <Badge bg="warning">Waiting</Badge>;
      case 'confirming':
        return <Badge bg="info">Confirming</Badge>;
      case 'sending':
        return <Badge bg="primary">Sending</Badge>;
      case 'partially_paid':
        return <Badge bg="secondary">Partially Paid</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      case 'expired':
        return <Badge bg="dark">Expired</Badge>;
      case 'refunded':
        return <Badge bg="light" text="dark">Refunded</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Refresh all data
  const handleRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  // View payment details
  const viewPaymentDetails = (payment: CryptoPayment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  return (
    <div className="admin-crypto-payments">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Cryptocurrency Payments</h5>
          <Button variant="outline-primary" onClick={handleRefresh} disabled={loading}>
            <FaSync className={loading ? 'spin-animation' : ''} /> Refresh
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <div className="d-flex flex-column flex-md-row gap-3 mb-4">
            <InputGroup className="w-100 w-md-50">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by ID, address, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Form.Select 
              className="w-100 w-md-25"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting</option>
              <option value="confirming">Confirming</option>
              <option value="finished">Finished</option>
              <option value="failed">Failed</option>
              <option value="expired">Expired</option>
              <option value="refunded">Refunded</option>
            </Form.Select>
          </div>
          
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <Alert variant="info">
              No payment records found. {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : ''}
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Crypto</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentItems().map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => viewPaymentDetails(payment)}>
                            {payment.paymentId.substring(0, 10)}...
                          </span>
                        </td>
                        <td>
                          {payment.user ? (
                            <div>
                              <div>{payment.user.name}</div>
                              <small className="text-muted">{payment.user.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">User ID: {payment.userId.substring(0, 8)}...</span>
                          )}
                        </td>
                        <td>${payment.amount.toFixed(2)}</td>
                        <td>
                          {payment.cryptoCurrency.toUpperCase()}
                          {payment.actualCryptoAmount && (
                            <small className="d-block text-muted">
                              {payment.actualCryptoAmount} received
                            </small>
                          )}
                        </td>
                        <td>{getStatusBadge(payment.status)}</td>
                        <td>{formatDate(payment.createdAt)}</td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-secondary"
                            onClick={() => checkPaymentStatus(payment.paymentId)}
                            disabled={loading}
                          >
                            Check Status
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="ms-2"
                            onClick={() => viewPaymentDetails(payment)}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                  Showing {getCurrentItems().length} of {filteredPayments.length} payments
                </div>
                
                <Pagination>
                  <Pagination.First 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  />
                  
                  {/* Show pagination numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    }
                    return null;
                  })}
                  
                  <Pagination.Next 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last 
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
      
      {/* Payment Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>
                  {getStatusBadge(selectedPayment.status)} 
                  <span className="ms-2">
                    {selectedPayment.status === 'finished' ? (
                      <FaCheckCircle className="text-success" />
                    ) : selectedPayment.status === 'failed' || selectedPayment.status === 'expired' ? (
                      <FaTimesCircle className="text-danger" />
                    ) : (
                      <FaExclamationTriangle className="text-warning" />
                    )}
                  </span>
                </h5>
                <div>
                  <Button 
                    size="sm" 
                    variant="outline-secondary"
                    onClick={() => checkPaymentStatus(selectedPayment.paymentId)}
                    disabled={loading}
                  >
                    <FaSync className={loading ? 'spin-animation' : ''} /> Check Status
                  </Button>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Payment ID:</strong>
                    <p className="mb-0">{selectedPayment.paymentId}</p>
                  </div>
                  
                  {selectedPayment.invoiceId && (
                    <div className="mb-3">
                      <strong>Invoice ID:</strong>
                      <p className="mb-0">{selectedPayment.invoiceId}</p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <strong>Amount:</strong>
                    <p className="mb-0">${selectedPayment.amount.toFixed(2)}</p>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Cryptocurrency:</strong>
                    <p className="mb-0">{selectedPayment.cryptoCurrency.toUpperCase()}</p>
                  </div>
                  
                  {selectedPayment.actualCryptoAmount && (
                    <div className="mb-3">
                      <strong>Received Amount:</strong>
                      <p className="mb-0">{selectedPayment.actualCryptoAmount} {selectedPayment.cryptoCurrency.toUpperCase()}</p>
                    </div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>User:</strong>
                    <p className="mb-0">
                      {selectedPayment.user ? (
                        <>
                          {selectedPayment.user.name} <br />
                          <small className="text-muted">{selectedPayment.user.email}</small>
                        </>
                      ) : (
                        <span className="text-muted">User ID: {selectedPayment.userId}</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Created Date:</strong>
                    <p className="mb-0">{formatDate(selectedPayment.createdAt)}</p>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Last Updated:</strong>
                    <p className="mb-0">{formatDate(selectedPayment.updatedAt)}</p>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="mb-0">{selectedPayment.description || 'No description'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <strong>Payment Address:</strong>
                <p className="mb-0 text-break">{selectedPayment.paymentAddress}</p>
              </div>
              
              <div className="mt-3">
                <strong>Callback URL:</strong>
                <p className="mb-0 text-break">{selectedPayment.callbackUrl}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <style>
        {`
          .spin-animation {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminCryptoPayments; 