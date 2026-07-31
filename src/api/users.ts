import { API_BASE, fetchOrThrow } from './client';
import { NotificationPrefs } from '../types';

export async function fetchUsers(): Promise<any[]> {
  const response = await fetchOrThrow(`${API_BASE}/users`, undefined, 'Failed to fetch users');
  return response.json();
}

export async function createUser(id: string, name: string, email: string): Promise<void> {
  await fetchOrThrow(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, email })
  }, 'Failed to create/switch user');
}

export async function updateUserApiKeyLabel(userId: string, apiKeyLabel: string): Promise<void> {
  await fetchOrThrow(`${API_BASE}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKeyLabel })
  }, 'Failed to update API key label');
}

export async function updateAccountDetails(userId: string, name: string, email: string): Promise<void> {
  await fetchOrThrow(`${API_BASE}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  }, 'Failed to update account details');
}

export async function updateNotificationPreferences(userId: string, prefs: NotificationPrefs): Promise<void> {
  await fetchOrThrow(`${API_BASE}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs)
  }, 'Failed to update notification preferences');
}

export async function fetchConfigStatus(): Promise<{ aiConfigured: boolean }> {
  const response = await fetchOrThrow(`${API_BASE}/config/status`, undefined, 'Failed to fetch config status');
  return response.json();
}
