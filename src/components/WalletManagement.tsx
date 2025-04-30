import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Tabs, Tab, Table, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaTrash, FaStar, FaRegStar, FaQrcode, FaWallet } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// Interface for crypto wallet
interface CryptoWallet {
  id: number;
  walletType: string;
  address: string;
  label: string;
  isDefault: boolean;
}

// Interface for crypto payment
interface CryptoPayment {
  id: number;
  paymentId: string;
  amount: number;
  cryptoCurrency: string;
  status: string;
  description: string;
  createdAt: string;
  invoice_url?: string;
}

// Interface for crypto currency
interface CryptoCurrency {
  currency: string;
  name: string;
  image: string;
}

const WalletManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('deposit');
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [payments, setPayments] = useState<CryptoPayment[]>([]);
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [newWallet, setNewWallet] = useState({
    walletType: 'btc',
    address: '',
    label: '',
  });
  const [paymentUrl, setPaymentUrl] = useState('');
  const [currentPayment, setCurrentPayment] = useState<CryptoPayment | null>(null);

  // Fetch user wallets
  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/crypto/wallets');
      setWallets(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load wallets');
      setLoading(false);
    }
  };

  // Fetch payment history
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/crypto/payments');
      setPayments(response.data.payments);
      setLoading(false);
    } catch (err) {
      setError('Failed to load payment history');
      setLoading(false);
    }
  };

  // Fetch available cryptocurrencies
  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/crypto/currencies');
      setCurrencies(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load currencies');
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchWallets();
    fetchPayments();
    fetchCurrencies();
  }, []);

  // Add a new wallet
  const handleAddWallet = async () => {
    try {
      setLoading(true);
      await axios.post('/api/crypto/wallets', newWallet);
      setShowAddWalletModal(false);
      setNewWallet({ walletType: 'btc', address: '', label: '' });
      await fetchWallets();
      setLoading(false);
    } catch (err) {
      setError('Failed to add wallet');
      setLoading(false);
    }
  };

  // Delete a wallet
  const handleDeleteWallet = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/crypto/wallets/${id}`);
        await fetchWallets();
        setLoading(false);
      } catch (err) {
        setError('Failed to delete wallet');
        setLoading(false);
      }
    }
  };

  // Set a wallet as default
  const handleSetDefaultWallet = async (id: number) => {
    try {
      setLoading(true);
      await axios.put(`/api/crypto/wallets/${id}/default`);
      await fetchWallets();
      setLoading(false);
    } catch (err) {
      setError('Failed to set default wallet');
      setLoading(false);
    }
  };

  // Create a deposit payment
  const handleCreateDeposit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/crypto/payment', {
        amount: parseFloat(depositAmount),
        currency: 'usd',
        pay_currency: selectedCurrency,
        order_description: `Wallet deposit of ${depositAmount} USD`,
      });

      setCurrentPayment(response.data);
      
      if (response.data.invoice_url) {
        setPaymentUrl(response.data.invoice_url);
        window.open(response.data.invoice_url, '_blank');
      }
      
      setShowDepositModal(false);
      setDepositAmount('');
      await fetchPayments();
      setLoading(false);
    } catch (err) {
      setError('Failed to create deposit');
      setLoading(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (paymentId: string) => {
    try {
      const response = await axios.get(`/api/crypto/payment/${paymentId}`);
      
      // Update the payment in the list
      setPayments(payments.map(payment => 
        payment.paymentId === paymentId ? response.data : payment
      ));
      
      return response.data.status;
    } catch (err) {
      console.error('Error checking payment status:', err);
      return null;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finished':
        return 'success';
      case 'waiting':
      case 'confirming':
        return 'warning';
      case 'failed':
      case 'expired':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="wallet-management my-4">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4><FaWallet className="me-2" /> Wallet & Payments</h4>
            <div>
              <span className="me-3">Balance: ${user?.walletBalance.toFixed(2)}</span>
              <Button variant="success" onClick={() => setShowDepositModal(true)}>
                <FaPlus className="me-1" /> Deposit
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'deposit')}
            className="mb-3"
          >
            <Tab eventKey="deposit" title="Deposit">
              <div className="mb-3">
                <h5>Deposit Funds</h5>
                <p>Add funds to your account using cryptocurrency.</p>
                <Button variant="primary" onClick={() => setShowDepositModal(true)}>
                  Deposit Now
                </Button>
              </div>
              
              <h5>Recent Deposits</h5>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">No deposits found</td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{formatDate(payment.createdAt)}</td>
                          <td>${payment.amount.toFixed(2)}</td>
                          <td>{payment.cryptoCurrency.toUpperCase()}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(payment.status)}`}>
                              {payment.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td>
                            {payment.status === 'waiting' && (
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => {
                                  if (payment.invoice_url) {
                                    window.open(payment.invoice_url, '_blank');
                                  }
                                }}
                              >
                                Pay Now
                              </Button>
                            )}
                            {(payment.status === 'waiting' || payment.status === 'confirming') && (
                              <Button 
                                size="sm" 
                                variant="outline-secondary" 
                                className="ms-2"
                                onClick={() => checkPaymentStatus(payment.paymentId)}
                              >
                                Refresh
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Tab>
            
            <Tab eventKey="wallets" title="Crypto Wallets">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <h5>Your Crypto Wallets</h5>
                <Button variant="primary" onClick={() => setShowAddWalletModal(true)}>
                  <FaPlus className="me-1" /> Add Wallet
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Default</th>
                      <th>Label</th>
                      <th>Type</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">No wallets found</td>
                      </tr>
                    ) : (
                      wallets.map((wallet) => (
                        <tr key={wallet.id}>
                          <td className="text-center">
                            {wallet.isDefault ? (
                              <FaStar className="text-warning" />
                            ) : (
                              <FaRegStar 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSetDefaultWallet(wallet.id)}
                              />
                            )}
                          </td>
                          <td>{wallet.label}</td>
                          <td>{wallet.walletType.toUpperCase()}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="text-truncate" style={{ maxWidth: '200px' }}>
                                {wallet.address}
                              </span>
                              <Button 
                                variant="link"
                                onClick={() => {
                                  navigator.clipboard.writeText(wallet.address);
                                  alert('Address copied to clipboard');
                                }}
                              >
                                Copy
                              </Button>
                            </div>
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteWallet(wallet.id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* Add Wallet Modal */}
      <Modal show={showAddWalletModal} onHide={() => setShowAddWalletModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Crypto Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Wallet Type</Form.Label>
              <Form.Select
                value={newWallet.walletType}
                onChange={(e) => setNewWallet({ ...newWallet, walletType: e.target.value })}
              >
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
                <option value="usdt">Tether (USDT)</option>
                <option value="usdc">USD Coin (USDC)</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your wallet address"
                value={newWallet.address}
                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
              />
              <Form.Text className="text-muted">
                Make sure the address is correct for the selected wallet type.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                placeholder="E.g., 'My Bitcoin Wallet'"
                value={newWallet.label}
                onChange={(e) => setNewWallet({ ...newWallet, label: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddWalletModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddWallet} 
            disabled={!newWallet.address || !newWallet.label || loading}
          >
            {loading ? <Spinner size="sm" animation="border" /> : 'Add Wallet'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Deposit Modal */}
      <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deposit Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount (USD)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount in USD"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="10"
              />
              <Form.Text className="text-muted">
                Minimum deposit amount is $10 USD.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Payment Currency</Form.Label>
              <Form.Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {currencies.length > 0 ? (
                  currencies.map((currency) => (
                    <option key={currency.currency} value={currency.currency}>
                      {currency.name} ({currency.currency.toUpperCase()})
                    </option>
                  ))
                ) : (
                  <option value="btc">Bitcoin (BTC)</option>
                )}
              </Form.Select>
              <Form.Text className="text-muted">
                Select the cryptocurrency you want to pay with.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepositModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateDeposit} 
            disabled={!depositAmount || parseFloat(depositAmount) < 10 || loading}
          >
            {loading ? <Spinner size="sm" animation="border" /> : 'Create Payment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WalletManagement; 