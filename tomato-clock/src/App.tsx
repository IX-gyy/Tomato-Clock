import { useState, useCallback } from 'react';
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
import { loadTasks, loadDarkMode } from './utils/storage';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isDarkMode] = useState(() => loadDarkMode());

  const handleSelectTask = useCallback((taskId: string | null) => {
    setActiveTaskId(taskId);
  }, []);

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
        <div className="tab-content-container">
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
        <div className="tab-content-container">
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
        <div className="tab-content-container-wide">
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
      <Layout 
        className={`app-layout ${isDarkMode ? 'dark' : ''}`}
        style={{ minHeight: '100vh' }}
      >
        <Header
          className={`app-header ${isDarkMode ? 'dark' : ''}`}
        >
          <Title level={3} className="app-title">
            <span className="app-title-icon">🍅</span>
            <span className="app-title-text">番茄钟</span>
          </Title>
        </Header>

        <Content className="app-content">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
            type="card"
            className={`app-tabs ${isDarkMode ? 'dark' : ''}`}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
