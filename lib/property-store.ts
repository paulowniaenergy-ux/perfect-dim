'use client';

import { properties, type Property } from '@/lib/properties';

const STORAGE_KEY = 'perfect-dim-properties-v1';

export function loadProperties(): Property[] {
  if (typeof window === 'undefined') return properties;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Property[]) : properties;
  } catch {
    return properties;
  }
}

export function saveProperties(next: Property[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('perfect-dim-properties-updated'));
}

export function resetProperties() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('perfect-dim-properties-updated'));
}
