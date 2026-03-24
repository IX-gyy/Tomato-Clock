import { Card, Form, InputNumber, Switch, Slider, Button, Space, Divider, Typography, message, Modal } from 'antd';
import {
  SoundOutlined,
  BellOutlined,
  ClockCircleOutlined,
  MoonOutlined,
  SaveOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { TimerSettings } from '../../types';
import { loadSettings, saveSettings, defaultSettings, loadDarkMode, saveDarkMode } from '../../utils/storage';

const { Title, Text } = Typography;

export default function Settings() {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setDarkMode(loadDarkMode());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    saveDarkMode(darkMode);

    message.success('设置保存成功！');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleReset = () => {
    setShowModal(true);
  };

  const handleConfirmReset = () => {
    setShowModal(false);
    setSettings(defaultSettings);
    setDarkMode(false);
    message.info('已恢复默认设置，请点击"保存设置"使更改生效');
  };

  const handleCancelReset = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card
        title="设置"
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Title level={4}>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            计时器设置
          </Title>

          <Form.Item label="工作时长（分钟）">
            <InputNumber
              min={1}
              max={60}
              value={settings.workDuration}
              onChange={(value) =>
                setSettings({ ...settings, workDuration: value || 25 })
              }
              style={{ width: 120 }}
              size="large"
            />
          </Form.Item>

          <Form.Item label="短休息时长（分钟）">
            <InputNumber
              min={1}
              max={30}
              value={settings.shortBreakDuration}
              onChange={(value) =>
                setSettings({ ...settings, shortBreakDuration: value || 5 })
              }
              style={{ width: 120 }}
              size="large"
            />
          </Form.Item>

          <Form.Item label="长休息时长（分钟）">
            <InputNumber
              min={5}
              max={60}
              value={settings.longBreakDuration}
              onChange={(value) =>
                setSettings({ ...settings, longBreakDuration: value || 15 })
              }
              style={{ width: 120 }}
              size="large"
            />
          </Form.Item>

          <Divider />

          <Title level={4}>自动开始</Title>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>休息结束后自动开始工作</Text>
                <Switch
                  checked={settings.autoStartWork}
                  onChange={(checked) =>
                    setSettings({ ...settings, autoStartWork: checked })
                  }
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>工作结束后自动开始休息</Text>
                <Switch
                  checked={settings.autoStartBreak}
                  onChange={(checked) =>
                    setSettings({ ...settings, autoStartBreak: checked })
                  }
                />
              </div>
            </Space>
          </Form.Item>

          <Divider />

          <Title level={4}>
            <SoundOutlined style={{ marginRight: 8 }} />
            声音设置
          </Title>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text>启用提示音</Text>
              <Switch
                checked={settings.soundEnabled}
                onChange={(checked) =>
                  setSettings({ ...settings, soundEnabled: checked })
                }
              />
            </div>

            {settings.soundEnabled && (
              <div>
                <Text type="secondary">音量</Text>
                <Slider
                  value={settings.volume}
                  onChange={(value) => setSettings({ ...settings, volume: value })}
                  min={0}
                  max={100}
                  style={{ marginTop: 8 }}
                />
              </div>
            )}
          </Form.Item>

          <Divider />

          <Title level={4}>
            <BellOutlined style={{ marginRight: 8 }} />
            通知设置
          </Title>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>启用系统通知</Text>
              <Switch
                checked={settings.notificationEnabled}
                onChange={(checked) =>
                  setSettings({ ...settings, notificationEnabled: checked })
                }
              />
            </div>
          </Form.Item>

          <Divider />

          <Title level={4}>
            <MoonOutlined style={{ marginRight: 8 }} />
            外观设置
          </Title>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>深色模式</Text>
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
              />
            </div>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space size="large">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                size="large"
              >
                保存设置
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                size="large"
              >
                恢复默认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="确认恢复默认设置"
        open={showModal}
        onOk={handleConfirmReset}
        onCancel={handleCancelReset}
        okText="确定"
        cancelText="取消"
      >
        <p>确定要恢复默认设置吗？恢复后需要点击"保存设置"才能生效。</p>
      </Modal>
    </>
  );
}
