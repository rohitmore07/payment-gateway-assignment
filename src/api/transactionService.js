import axiosInstance from './axiosInstance';
import { TRANSACTIONS_ENDPOINT } from '../utils/constants';

export async function fetchTransactions({ page = 1, limit = 100 } = {}) {
  const { data } = await axiosInstance.get(TRANSACTIONS_ENDPOINT, {
    params: { page, limit },
  });
  return data;
}

export function normalizeTransactionsResponse(response) {
  const list =
    response?.data ||
    response?.transactions ||
    response?.results ||
    (Array.isArray(response) ? response : []);

  const pagination = response?.pagination || response?.meta || {};
  const total = pagination.total ?? response?.total ?? list.length;

  return {
    transactions: list,
    total,
    page: pagination.page ?? response?.page ?? 1,
    limit: pagination.limit ?? response?.limit ?? 100,
    totalPages: pagination.totalPages ?? Math.ceil(total / (pagination.limit || 100)),
  };
}
