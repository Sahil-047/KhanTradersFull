// Payment service for handling payment-related operations
import authService from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAYMENT_API_URL = API_BASE_URL + '/api/payments';

class PaymentService {
  constructor() {
    this.baseURL = PAYMENT_API_URL;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = authService.getAuthToken();
    console.log('Payment service token:', token ? 'Token exists' : 'No token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Get payments for a specific user
  async getPaymentsByUser(userId, status = null, from = null, to = null) {
    try {
      let url = `${this.baseURL}/user/${userId}`;
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to fetch payments');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payments by user:', error);
      throw new Error(error.message || 'Failed to fetch payments');
    }
  }

  // Get upcoming payments (pending status)
  async getUpcomingPayments(userId) {
    try {
      const allPayments = await this.getPaymentsByUser(userId);
      return allPayments.filter(p => p.status === 'pending');
    } catch (error) {
      console.error('Error fetching upcoming payments:', error);
      throw new Error('Failed to fetch upcoming payments');
    }
  }

  // Get completed payments (completed status)
  async getCompletedPayments(userId) {
    try {
      const allPayments = await this.getPaymentsByUser(userId);
      return allPayments.filter(p => (p.status === 'completed' && p.type !== 'investment'));
    } catch (error) {
      console.error('Error fetching completed payments:', error);
      throw new Error('Failed to fetch completed payments');
    }
  }

  async getFailedPayments(userId) {
    try {
      const allPayments = await this.getPaymentsByUser(userId);
      return allPayments.filter(p => (p.status === 'failed'));
    } catch (error) {
      console.error('Error fetching failed payments:', error);
      throw new Error('Failed to fetch failed payments');
    }
  }

  async getInvestmentPayments(userId) {
    try {
      const allPayments = await this.getPaymentsByUser(userId);
      return allPayments.filter(p => p.type === 'investment');
    } catch (error) {
      console.error('Error fetching completed payments:', error);
      throw new Error('Failed to fetch completed payments');
    }
  }

  // Get all payments for a user
  async getPayments(userId) {
    try {
      return await this.getPaymentsByUser(userId);
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }
  }

  // Create a new payment
  async createPayment(paymentData) {
    try {
      console.log('Creating payment with data:', paymentData);
      console.log('Payment API URL:', `${this.baseURL}`);
      
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      console.log('Payment response status:', response.status);
      console.log('Payment response headers:', response.headers);

      if (!response.ok) {
        // Try to get error details
        let errorMessage = 'Failed to create payment';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON (like HTML error page), get text
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error(error.message || 'Failed to create payment');
    }
  }

  // Update a payment
  async updatePayment(paymentId, paymentData) {
    try {
      const response = await fetch(`${this.baseURL}/${paymentId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  // Delete a payment
  async deletePayment(paymentId) {
    try {
      const response = await fetch(`${this.baseURL}/${paymentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }

      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }
}

export default new PaymentService(); 
