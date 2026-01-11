import api from './api';

const walletService = {
  // Get wallet balance and info
  getWallet: () => {
    return api.get('/wallet');
  },

  // Deposit funds
  deposit: (data) => {
    return api.post('/wallet/deposit', data);
  },

  // Withdraw funds
  withdraw: (data) => {
    return api.post('/wallet/withdraw', data);
  },

  // Get transaction history
  getTransactions: (params) => {
    return api.get('/wallet/transactions', { params });
  },

  // Get single transaction
  getTransaction: (id) => {
    return api.get(`/wallet/transactions/${id}`);
  },

  // Get wallet balance only
  getBalance: () => {
    return api.get('/wallet/balance');
  },
};

export default walletService;

