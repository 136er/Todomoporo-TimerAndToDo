import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Task, saveTasks, loadTasks, initDB } from '@/lib/db';
import { toast } from 'sonner';

interface TaskListProps {
  activeTaskId: number | null;
  onTaskSelect: (taskId: number | null) => void;
}

/**
 * Task management component with IndexedDB persistence
 */
export function TaskList({ activeTaskId, onTaskSelect }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load tasks from IndexedDB on mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        await initDB();
        const loadedTasks = await loadTasks();
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Save tasks to IndexedDB whenever they change
   */
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks).catch((error) => {
        console.error('Failed to save tasks:', error);
        toast.error('Failed to save tasks');
      });
    }
  }, [tasks, isLoading]);

  /**
   * Add a new task
   */
  const handleAddTask = () => {
    const text = newTaskText.trim();
    if (!text) return;

    const newTask: Task = {
      id: Date.now(),
      text,
      isActive: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskText('');
    toast.success('Task added');
  };

  /**
   * Delete a task
   */
  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    
    // If deleted task was active, clear active task
    if (activeTaskId === taskId) {
      onTaskSelect(null);
    }
    
    toast.success('Task deleted');
  };

  /**
   * Toggle task selection
   */
  const handleTaskClick = (taskId: number) => {
    if (activeTaskId === taskId) {
      // Deselect if already active
      onTaskSelect(null);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, isActive: false } : task
        )
      );
    } else {
      // Select new task
      onTaskSelect(taskId);
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          isActive: task.id === taskId,
        }))
      );
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading tasks...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleAddTask} size="icon">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No tasks yet. Add one to get started!
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border cursor-pointer
                transition-all duration-200 hover:shadow-md
                ${
                  task.isActive
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-card hover:bg-accent'
                }
              `}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {task.isActive && (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                )}
                <span className={task.isActive ? 'font-medium' : ''}>
                  {task.text}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
