/**
 * IndexedDB utility for Pomodoro Timer
 * Handles persistent storage for tasks and timer state
 */

const DB_NAME = 'PomodoroTimerDB';
const DB_VERSION = 1;
const TASK_STORE = 'tasks';
const TIMER_STORE = 'timer';

export interface Task {
  id: number;
  text: string;
  isActive: boolean;
  createdAt: number;
}

export interface TimerState {
  key: string;
  timeLeft: number;
  isRunning: boolean;
  activeTaskId: number | null;
}

let db: IDBDatabase | null = null;
let dbInitPromise: Promise<void> | null = null;

/**
 * Initialize IndexedDB database
 */
export async function initDB(): Promise<void> {
  // Return existing promise if initialization is in progress
  if (dbInitPromise) return dbInitPromise;
  
  // Return immediately if already initialized
  if (db) return Promise.resolve();
  
  dbInitPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create tasks store
      if (!database.objectStoreNames.contains(TASK_STORE)) {
        database.createObjectStore(TASK_STORE, { keyPath: 'id', autoIncrement: true });
      }

      // Create timer state store
      if (!database.objectStoreNames.contains(TIMER_STORE)) {
        database.createObjectStore(TIMER_STORE, { keyPath: 'key' });
      }
    };
  });
  
  return dbInitPromise;
}

/**
 * Save all tasks to IndexedDB
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  await initDB();
  if (!db) throw new Error('Database not initialized');

  const tx = db.transaction(TASK_STORE, 'readwrite');
  const store = tx.objectStore(TASK_STORE);

  // Clear existing tasks
  store.clear();

  // Add all tasks
  tasks.forEach((task) => {
    store.add(task);
  });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load all tasks from IndexedDB
 */
export async function loadTasks(): Promise<Task[]> {
  await initDB();
  if (!db) throw new Error('Database not initialized');

  const tx = db.transaction(TASK_STORE, 'readonly');
  const store = tx.objectStore(TASK_STORE);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save timer state to IndexedDB
 */
export async function saveTimerState(state: Omit<TimerState, 'key'>): Promise<void> {
  await initDB();
  if (!db) throw new Error('Database not initialized');

  const tx = db.transaction(TIMER_STORE, 'readwrite');
  const store = tx.objectStore(TIMER_STORE);

  store.put({ key: 'status', ...state });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load timer state from IndexedDB
 */
export async function loadTimerState(): Promise<TimerState | null> {
  await initDB();
  if (!db) throw new Error('Database not initialized');

  const tx = db.transaction(TIMER_STORE, 'readonly');
  const store = tx.objectStore(TIMER_STORE);
  const request = store.get('status');

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a task by ID
 */
export async function deleteTask(id: number): Promise<void> {
  await initDB();
  if (!db) throw new Error('Database not initialized');

  const tx = db.transaction(TASK_STORE, 'readwrite');
  const store = tx.objectStore(TASK_STORE);
  store.delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
