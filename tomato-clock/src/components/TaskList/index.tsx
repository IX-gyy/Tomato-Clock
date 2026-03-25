import { useState, useEffect } from 'react';
import {
  Card,
  List,
  Input,
  Button,
  Space,
  Typography,
  Badge,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { Task } from '../../types';
import { loadTasks, saveTasks } from '../../utils/storage';
import './index.css';

const { Text } = Typography;

interface TaskListProps {
  activeTaskId?: string | null;
  onSelectTask?: (taskId: string | null) => void;
}

export default function TaskList({ activeTaskId, onSelectTask }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completedPomodoros: 0,
      createdAt: Date.now(),
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTaskTitle('');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    if (activeTaskId === taskId && onSelectTask) {
      onSelectTask(null);
    }
  };

  const handleStartTask = (taskId: string) => {
    if (onSelectTask) {
      onSelectTask(taskId);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <Card
      title="任务列表"
      className="task-list-card"
      styles={{ body: { padding: 16 } }}
    >
      <Space.Compact className="task-input-group">
        <Input
          placeholder="添加新任务..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onPressEnter={handleAddTask}
          size="large"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddTask}
          size="large"
        >
          添加
        </Button>
      </Space.Compact>

      {tasks.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无任务，添加一个开始专注吧"
        />
      ) : (
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              key={task.id}
              className={`task-list-item ${activeTaskId === task.id ? 'active' : ''}`}
              actions={[
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleToggleComplete(task.id)}
                  className={`task-complete-btn ${task.completed ? 'completed' : ''}`}
                />,
                <Badge
                  count={task.completedPomodoros}
                  className="task-pomodoro-badge"
                >
                  <span className="task-pomodoro-icon">🍅</span>
                </Badge>,
                <Button
                  type={activeTaskId === task.id ? 'primary' : 'text'}
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleStartTask(task.id)}
                  disabled={activeTaskId === task.id}
                >
                  {activeTaskId === task.id ? '进行中' : '开始'}
                </Button>,
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTask(task.id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <Text className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </Text>
                }
                description={
                  activeTaskId === task.id ? (
                    <Text type="success">
                      <CheckCircleOutlined /> 当前专注任务
                    </Text>
                  ) : null
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
