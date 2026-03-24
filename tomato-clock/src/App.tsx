import { useState, useCallback, useEffect } from 'react';
import { Layout, Tabs, Typography, theme, ConfigProvider } from 'antd';
import {
  ClockCircleOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import type { Task } from './types';
import { loadTasks, loadDarkMode } from './utils/storage';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(loadTasks());
  const [isDarkMode, setIsDarkMode] = useState(() => loadDarkMode());

  const handleSelectTask = useCallback((taskId: string | null) => {
    setActiveTaskId(taskId);
  }, []);

  useEffect(() => {
    setTasks(loadTasks());
  }, [activeTaskId]);

  useEffect(() => {
    if (activeTab === 'timer') {
      setTasks(loadTasks());
    }
  }, [activeTab]);

  const getActiveTask = useCallback(() => {
    const currentTasks = loadTasks();
    return currentTasks.find((task) => task.id === activeTaskId);
  }, [activeTaskId]);

  const items = [
    {
      key: 'timer',
      label: (
        <span>
          <ClockCircleOutlined />
          番茄钟
        </span>
      ),
      children: (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Timer activeTask={getActiveTask()} />
        </div>
      ),
    },
    {
      key: 'tasks',
      label: (
        <span>
          <UnorderedListOutlined />
          任务列表
        </span>
      ),
      children: (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <TaskList
            activeTaskId={activeTaskId}
            onSelectTask={handleSelectTask}
          />
        </div>
      ),
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          统计报告
        </span>
      ),
      children: <Statistics />,
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          设置
        </span>
      ),
      children: (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Settings />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#ff6b6b',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: isDarkMode ? '#141414' : '#f5f5f5' }}>
        <Header
          style={{
            background: isDarkMode ? '#1f1f1f' : '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Title
            level={3}
            style={{
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 28 }}>🍅</span>
            <span style={{ color: '#ff6b6b' }}>番茄钟</span>
          </Title>
        </Header>

        <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            type="card"
            style={{
              background: isDarkMode ? '#1f1f1f' : '#fff',
              padding: '24px',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
