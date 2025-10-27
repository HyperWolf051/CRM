/**
 * TypeScript interfaces for last page memory system
 */

export interface LastPageState {
  path: string;
  timestamp: number;
  userRole: string;
  userId: string;
}

export interface StorageManager {
  set: (key: string, value: LastPageState) => boolean;
  get: (key: string) => LastPageState | null;
  remove: (key: string) => boolean;
  isAvailable: () => boolean;
}

export interface LastPageMemoryHook {
  // Store current page
  setLastPage: (path: string) => void;
  
  // Get stored page
  getLastPage: () => string | null;
  
  // Clear stored page
  clearLastPage: () => void;
  
  // Validate and get restorable page
  getRestorablePage: (userRole: string) => string | null;
}

export interface RoutePermission {
  path: string;
  allowedRoles: string[];
  defaultRedirect: string;
}