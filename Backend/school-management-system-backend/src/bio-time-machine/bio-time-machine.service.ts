import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class DeviceService {
  constructor(private readonly studentService: StudentService) {}

  async doPost(httpUrl: string, params: object): Promise<string | null> {
    try {
      const response = await axios.post(httpUrl, params, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error in doPost:', error);
      return null;
    }
  }

  async getToken(
    ipAddress: string,
    username: string,
    password: string,
  ): Promise<string | null> {
    const url = `${ipAddress}/jwt-api-token-auth/`;
    const params = { username, password };

    try {
      const response: any = await this.doPost(url, params);

      if (typeof response === 'string') {
        try {
          const parsedResponse = JSON.parse(response);
          if (parsedResponse && parsedResponse.token) {
            return `JWT ${parsedResponse.token}`;
          }
        } catch (parseError) {
          console.error('Failed to parse token response:', parseError);
        }
      } else if (
        response &&
        typeof response === 'object' &&
        'token' in response
      ) {
        return `JWT ${response.token}`;
      }

      console.error('Invalid token response:', response);
      return null;
    } catch (error) {
      console.error('Error fetching token:', error.message);
      return null;
    }
  }

  async getTransactions(ipAddress: string, username: string, password: string) {
    const token = await this.getToken(ipAddress, username, password);
    console.log(token);
    if (!token) return null;

    const transactionsUrl = `${ipAddress}/iclock/api/transactions/`;
    let transactionData = null;

    try {
      // Fetch first page to get the total count
      const firstPage = await axios.get(transactionsUrl, {
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });
      const totalCount = firstPage.data.count;
      const pageSize = 10;
      const lastPage = Math.ceil(totalCount / pageSize);

      let latestTransaction = null;
      let latestPunchTime = null;

      for (let page = lastPage; page >= 1; page--) {
        const pageUrl = `${transactionsUrl}?page=${page}`;
        const response = await axios.get(pageUrl, {
          headers: { Authorization: token },
        });

        for (const transaction of response.data.data) {
          const punchTime = new Date(transaction.punch_time);
          if (!latestPunchTime || punchTime > latestPunchTime) {
            latestTransaction = transaction;
            latestPunchTime = punchTime;
            transactionData = latestTransaction;
          }
        }
      }

      if (!transactionData) {
        console.log('No recent transactions found.');
        return null;
      }
      console.log(transactionData);
      return transactionData;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return null;
    }
  }

  async getUserDetails(ipAddress: string, username: string, password: string) {
    try {
      const data = await this.getTransactions(ipAddress, username, password);

      if (!data) {
        console.log('No recent transactions found.');
        return null;
      }

      const cardNumber = data.emp_code;
      console.log('Latest Swipe Card Number:', cardNumber);

      // Search user in database
      const userDetails = await this.studentService.getStudentById(cardNumber);
      return userDetails || { message: 'User not found' };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }
}
