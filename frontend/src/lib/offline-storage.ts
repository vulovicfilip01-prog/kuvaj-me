// IndexedDB wrapper for offline shopping list
// Provides local storage for shopping list items when offline

const DB_NAME = 'kuvaj-me-offline';
const DB_VERSION = 1;
const STORE_NAME = 'shopping-list';
const SYNC_QUEUE_STORE = 'sync-queue';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  is_checked: boolean;
  synced: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'add' | 'update' | 'delete' | 'toggle' | 'clear-checked';
  data: any;
  timestamp: number;
}

// Initialize IndexedDB
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Shopping list items store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('is_checked', 'is_checked', { unique: false });
        console.log('[IndexedDB] Created shopping-list store');
      }

      // Sync queue store
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const syncStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id' });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('[IndexedDB] Created sync-queue store');
      }
    };
  });
}

// Get all items from IndexedDB
export async function getItems(): Promise<ShoppingItem[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const items = request.result as ShoppingItem[];
      resolve(items.sort((a, b) => {
        // Unchecked items first, then by creation date
        if (a.is_checked !== b.is_checked) {
          return a.is_checked ? 1 : -1;
        }
        return (a.created_at || '') > (b.created_at || '') ? -1 : 1;
      }));
    };
    request.onerror = () => reject(request.error);
  });
}

// Add item to IndexedDB
export async function addItem(item: ShoppingItem): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Update item in IndexedDB
export async function updateItem(id: string, updates: Partial<ShoppingItem>): Promise<void> {
  const db = await initDB();
  
  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (!item) {
        reject(new Error('Item not found'));
        return;
      }

      const updated = { ...item, ...updates, updated_at: new Date().toISOString() };
      const putRequest = store.put(updated);
      
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

// Delete item from IndexedDB
export async function deleteItem(id: string): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Delete all checked items
export async function deleteCheckedItems(): Promise<void> {
  const db = await initDB();
  
  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('is_checked');
    const request = index.openCursor(IDBKeyRange.only(true));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
}

// Clear all items from store
export async function clearItems(): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Add action to sync queue
export async function addToSyncQueue(action: SyncQueueItem['action'], data: any): Promise<void> {
  const db = await initDB();
  
  const queueItem: SyncQueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action,
    data,
    timestamp: Date.now()
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.add(queueItem);

    request.onsuccess = () => {
      console.log('[Sync Queue] Added:', action, data);
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Get all pending sync actions
export async function getPendingSync(): Promise<SyncQueueItem[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Clear sync queue
export async function clearSyncQueue(): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.clear();

    request.onsuccess = () => {
      console.log('[Sync Queue] Cleared');
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Sync local changes with server
export async function syncWithServer(
  serverActions: {
    add: (name: string, quantity: string) => Promise<any>;
    toggle: (id: string, checked: boolean) => Promise<any>;
    remove: (id: string) => Promise<any>;
    clearChecked: () => Promise<any>;
  }
): Promise<{ success: boolean; errors: string[] }> {
  const pendingActions = await getPendingSync();
  const errors: string[] = [];

  console.log(`[Sync] Starting sync, ${pendingActions.length} pending actions`);

  for (const queueItem of pendingActions) {
    try {
      switch (queueItem.action) {
        case 'add':
          await serverActions.add(queueItem.data.name, queueItem.data.quantity);
          break;
        case 'toggle':
          await serverActions.toggle(queueItem.data.id, queueItem.data.checked);
          break;
        case 'delete':
          await serverActions.remove(queueItem.data.id);
          break;
        case 'clear-checked':
          await serverActions.clearChecked();
          break;
      }
      
      console.log(`[Sync] Completed:`, queueItem.action);
    } catch (error) {
      const err = error as Error;
      console.error(`[Sync] Failed:`, queueItem.action, err.message);
      errors.push(`${queueItem.action}: ${err.message}`);
    }
  }

  if (errors.length === 0) {
    await clearSyncQueue();
    console.log('[Sync] All actions synced successfully');
  }

  return {
    success: errors.length === 0,
    errors
  };
}
