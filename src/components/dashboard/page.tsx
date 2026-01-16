'use client'

import { Card, Statistic, Row, Col, Table, Tag, Progress, Typography } from 'antd'
import {
    BugOutlined,
    RocketOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export default function DashboardPage() {
    // 最近扫描任务数据
    const recentScans = [
        {
            key: '1',
            target: 'https://example.com',
            type: 'Web应用扫描',
            status: 'running',
            progress: 65,
            findings: 12,
            startTime: '2026-01-15 14:30',
        },
        {
            key: '2',
            target: '192.168.1.0/24',
            type: '主机扫描',
            status: 'completed',
            progress: 100,
            findings: 8,
            startTime: '2026-01-15 10:00',
        },
        {
            key: '3',
            target: 'api.example.com',
            type: 'API测试',
            status: 'pending',
            progress: 0,
            findings: 0,
            startTime: '2026-01-15 16:00',
        },
        {
            key: '4',
            target: 'admin.example.com',
            type: 'Web应用扫描',
            status: 'failed',
            progress: 45,
            findings: 3,
            startTime: '2026-01-15 12:15',
        },
    ]

    const columns = [
        {
            title: '目标',
            dataIndex: 'target',
            key: 'target',
            render: (text: string) => <Text strong className="!text-purple-400">{text}</Text>,
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
                    running: { color: 'processing', icon: <SyncOutlined spin />, text: '扫描中' },
                    completed: { color: 'success', icon: <CheckCircleOutlined />, text: '已完成' },
                    pending: { color: 'default', icon: <ClockCircleOutlined />, text: '等待中' },
                    failed: { color: 'error', icon: <ExclamationCircleOutlined />, text: '失败' },
                }
                const config = statusConfig[status]
                return (
                    <Tag icon={config.icon} color={config.color}>
                        {config.text}
                    </Tag>
                )
            },
        },
        {
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress: number) => (
                <Progress
                    percent={progress}
                    size="small"
                    strokeColor={{ '0%': '#7c4dff', '100%': '#b39ddb' }}
                />
            ),
        },
        {
            title: '发现项',
            dataIndex: 'findings',
            key: 'findings',
            render: (count: number) => (
                <Tag color={count > 10 ? 'red' : count > 5 ? 'orange' : 'green'}>
                    {count}
                </Tag>
            ),
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
        },
    ]

    return (
        <div className="space-y-6">
            {/* 统计卡片 */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!bg-gray-800 !border-gray-700">
                        <Statistic
                            title={<span className="!text-gray-400">总扫描次数</span>}
                            value={1893}
                            prefix={<RocketOutlined />}
                            valueStyle={{ color: '#7c4dff' }}
                            suffix={
                                <span className="text-sm">
                                    <ArrowUpOutlined className="text-green-500" /> 12%
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!bg-gray-800 !border-gray-700">
                        <Statistic
                            title={<span className="!text-gray-400">发现漏洞</span>}
                            value={247}
                            prefix={<BugOutlined />}
                            valueStyle={{ color: '#f5222d' }}
                            suffix={
                                <span className="text-sm">
                                    <ArrowDownOutlined className="text-green-500" /> 5%
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!bg-gray-800 !border-gray-700">
                        <Statistic
                            title={<span className="!text-gray-400">进行中任务</span>}
                            value={8}
                            prefix={<SyncOutlined spin />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!bg-gray-800 !border-gray-700">
                        <Statistic
                            title={<span className="!text-gray-400">修复率</span>}
                            value={93.8}
                            prefix={<CheckCircleOutlined />}
                            suffix="%"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Agent状态卡片 */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title={<span className="!text-white">AI Agent 运行状态</span>}
                        className="!bg-gray-800 !border-gray-700"
                    >
                        <Row gutter={[16, 16]}>
                            {[
                                { name: 'Planner Agent', status: 'active', tasks: 12 },
                                { name: 'Recon Agent', status: 'active', tasks: 8 },
                                { name: 'Enum Agent', status: 'idle', tasks: 0 },
                                { name: 'Vuln Agent', status: 'active', tasks: 15 },
                                { name: 'Verify Agent', status: 'idle', tasks: 0 },
                                { name: 'Report Agent', status: 'active', tasks: 3 },
                                { name: 'Critic Agent', status: 'idle', tasks: 0 },
                            ].map((agent, index) => (
                                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <Text className="!text-gray-300 text-sm">{agent.name}</Text>
                                            <div className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
                                                }`} />
                                        </div>
                                        <Text className="!text-purple-400 font-semibold">{agent.tasks} 任务</Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* 最近扫描任务表格 */}
            <Card
                title={<span className="!text-white">最近扫描任务</span>}
                extra={
                    <div className="!bg-purple-600 px-4 py-2 rounded text-white cursor-pointer hover:bg-purple-700 flex items-center gap-2">
                        <RocketOutlined />
                        新建扫描
                    </div>
                }
                className="!bg-gray-800 !border-gray-700"
            >
                <Table
                    columns={columns}
                    dataSource={recentScans}
                    pagination={{ pageSize: 10 }}
                    className="custom-table"
                />
            </Card>

            <style jsx global>{`
        .custom-table .ant-table {
          background: transparent !important;
        }
        .custom-table .ant-table-thead > tr > th {
          background: rgba(107, 70, 193, 0.1) !important;
          color: #fff !important;
          border-bottom: 1px solid #374151 !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #374151 !important;
          color: #e5e7eb !important;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background: rgba(107, 70, 193, 0.05) !important;
        }
        .custom-table .ant-pagination-item-active {
            background-color: #7c4dff !important;
            border-color: #7c4dff !important;
        }
        .custom-table .ant-pagination-item-active a {
            color: white !important;
        }
        .custom-table .ant-pagination-item a {
             color: #9ca3af !important;
        }
      `}</style>
        </div>
    )
}
