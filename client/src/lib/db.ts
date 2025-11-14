/**
 * IndexedDB utility for Pomodoro Timer
 * Handles persistent storage for tasks and timer state
 */

const DB_NAME = "PomodoroTimerDB";
const DB_VERSION = 1;
const TASK_STORE = "tasks";
const TIMER_STORE = "timer";

export interface Task {
  id: number;
  text: string;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: number;
}

export interface TimerState {
  key: string;
  timeLeft: number;
  isRunning: boolean;
  activeTaskId: number | null;
  mode?: "work" | "shortBreak" | "longBreak";
  completedPomodoros?: number;
  sessionGoal?: number;
  soundEnabled?: boolean;
  autoCycleEnabled?: boolean;
}

let db: IDBDatabase | null = null;
let initPromise: Promise<IDBDatabase> | null = null;

/**
 * Get or initialize the database
 */
async function getDB(): Promise<IDBDatabase> {
  // Return existing database if already initialized
  if (db) return db;

  // Return existing initialization promise if in progress
  if (initPromise) return initPromise;

  // Start new initialization
  initPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      initPromise = null;
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = event => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create tasks store
      if (!database.objectStoreNames.contains(TASK_STORE)) {
        database.createObjectStore(TASK_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      // Create timer state store
      if (!database.objectStoreNames.contains(TIMER_STORE)) {
        database.createObjectStore(TIMER_STORE, { keyPath: "key" });
      }
    };
  });

  return initPromise;
}

/**
 * Initialize IndexedDB database (for backward compatibility)
 */
export async function initDB(): Promise<void> {
  await getDB();
}

/**
 * Save all tasks to IndexedDB
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  const database = await getDB();

  const tx = database.transaction(TASK_STORE, "readwrite");
  const store = tx.objectStore(TASK_STORE);

  // Clear existing tasks
  store.clear();

  // Add all tasks
  tasks.forEach(task => {
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
  const database = await getDB();

  const tx = database.transaction(TASK_STORE, "readonly");
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
export async function saveTimerState(
  state: Omit<TimerState, "key">
): Promise<void> {
  const database = await getDB();

  const tx = database.transaction(TIMER_STORE, "readwrite");
  const store = tx.objectStore(TIMER_STORE);

  store.put({ key: "status", ...state });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Load timer state from IndexedDB
 */
export async function loadTimerState(): Promise<TimerState | null> {
  const database = await getDB();

  const tx = database.transaction(TIMER_STORE, "readonly");
  const store = tx.objectStore(TIMER_STORE);
  const request = store.get("status");

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a task by ID
 */
export async function deleteTask(id: number): Promise<void> {
  const database = await getDB();

  const tx = database.transaction(TASK_STORE, "readwrite");
  const store = tx.objectStore(TASK_STORE);
  store.delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
