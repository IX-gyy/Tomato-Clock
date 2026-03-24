import { Card, Row, Col, Statistic, DatePicker, List, Typography, Space, Empty } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { loadRecords } from '../../utils/storage';
import type { PomodoroRecord } from '../../types';

dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface DailyStats {
  date: string;
  pomodoros: number;
  focusTime: number;
}

export default function Statistics() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);

  const allRecords = loadRecords();

  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      const recordDate = dayjs(record.completedAt);
      return recordDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
    });
  }, [allRecords, dateRange]);

  const dailyStats = useMemo(() => {
    const statsMap = new Map<string, DailyStats>();

    for (const record of filteredRecords) {
      const date = dayjs(record.completedAt).format('YYYY-MM-DD');
      if (!statsMap.has(date)) {
        statsMap.set(date, { date, pomodoros: 0, focusTime: 0 });
      }
      const stat = statsMap.get(date)!;
      stat.pomodoros += 1;
      stat.focusTime += record.duration;
    }

    const result: DailyStats[] = [];
    for (
      let d = dayjs(dateRange[0]);
      d.isBefore(dateRange[1]) || d.isSame(dateRange[1]);
      d = d.add(1, 'day')
    ) {
      const dateStr = d.format('YYYY-MM-DD');
      result.push(statsMap.get(dateStr) || { date: dateStr, pomodoros: 0, focusTime: 0 });
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredRecords, dateRange]);

  const totalPomodoros = dailyStats.reduce((sum, day) => sum + day.pomodoros, 0);
  const totalFocusTime = dailyStats.reduce((sum, day) => sum + day.focusTime, 0);
  const avgPomodoros = dailyStats.length > 0 ? Math.round(totalPomodoros / dailyStats.length) : 0;
  const bestDay = dailyStats.length > 0 
    ? dailyStats.reduce((best, day) => day.pomodoros > best.pomodoros ? day : best, { date: '', pomodoros: 0, focusTime: 0 })
    : { date: '', pomodoros: 0, focusTime: 0 };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>统计报告</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (dates) {
                setDateRange([dates[0]!, dates[1]!]);
              }
            }}
          />
        </div>
      }
      style={{
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>总番茄数</Text>}
              value={totalPomodoros}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #4ecdc4 0%, #6ee7df 100%)',
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>专注时长</Text>}
              value={formatTime(totalFocusTime)}
              prefix={<ClockCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #45b7d1 0%, #6bc5e0 100%)',
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>日均番茄</Text>}
              value={avgPomodoros}
              prefix={<BarChartOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 12,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>最佳一天</Text>}
              value={bestDay.pomodoros}
              suffix="个"
              prefix={<FireOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="每日详情"
        style={{ marginTop: 24, borderRadius: 12 }}
        bodyStyle={{ padding: 0 }}
      >
        {dailyStats.some(d => d.pomodoros > 0) ? (
          <List
            dataSource={dailyStats.filter(d => d.pomodoros > 0)}
            renderItem={(day) => (
              <List.Item
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Text strong>{day.date}</Text>
                  <Space>
                    <Text>
                      <span style={{ fontSize: 18 }}>🍅</span> {day.pomodoros} 个番茄
                    </Text>
                    <Text type="secondary">|</Text>
                    <Text type="secondary">{formatTime(day.focusTime)}</Text>
                  </Space>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无数据" style={{ padding: '48px' }} />
        )}
      </Card>
    </Card>
  );
}
