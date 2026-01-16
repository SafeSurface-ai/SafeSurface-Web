'use client'

import { useState } from 'react'
import { Table, Button, Space, Tag, Card, Typography, Input, DatePicker, Select, Popover } from 'antd'
import { DownloadOutlined, EyeOutlined, ShareAltOutlined, FileTextOutlined } from '@ant-design/icons'
import { PermissionComponent } from '@/router'
import { PERMISSIONS } from '@/constants/permissions'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

interface Report {
    key: string
    id: string
    taskId: string
    taskName: string
    target: string
    scanType: string
    status: 'generating' | 'completed' | 'failed'
    severity: 'high' | 'medium' | 'low' | 'info'
    vulnerabilities: number
    generatedAt: string
    size: string
}

export default function ReportListPage() {
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [severityFilter, setSeverityFilter] = useState<string>('all')

    // 模拟数据
    const [reports, setReports] = useState<Report[]>([
        {
            key: '1',
            id: 'RPT-2026-001',
            taskId: 'SCAN-2026-001',
            taskName: 'Web应用安全扫描',
            target: 'https://example.com',
            scanType: 'Web应用扫描',
            status: 'completed',
            severity: 'high',
            vulnerabilities: 12,
            generatedAt: '2026-01-15 15:30:22',
            size: '2.5 MB'
        },
        {
            key: '2',
            id: 'RPT-2026-002',
            taskId: 'SCAN-2026-002',
            taskName: '内网主机扫描',
            target: '192.168.1.0/24',
            scanType: '主机扫描',
            status: 'completed',
            severity: 'medium',
            vulnerabilities: 8,
            generatedAt: '2026-01-15 12:45:10',
            size: '1.8 MB'
        },
        {
            key: '3',
            id: 'RPT-2026-003',
            taskId: 'SCAN-2026-003',
            taskName: 'API接口测试',
            target: 'api.example.com',
            scanType: 'API测试',
            status: 'generating',
            severity: 'info',
            vulnerabilities: 0,
            generatedAt: '2026-01-15 16:00:00',
            size: '-'
        }
    ])

    const getStatusTag = (status: string) => {
        const statusConfig = {
            generating: { color: 'blue', text: '生成中' },
            completed: { color: 'green', text: '已完成' },
            failed: { color: 'red', text: '生成失败' },
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
    }

    const getSeverityTag = (severity: string) => {
        const severityConfig = {
            high: { color: 'red', text: '高危' },
            medium: { color: 'orange', text: '中危' },
            low: { color: 'yellow', text: '低危' },
            info: { color: 'blue', text: '信息' },
        }
        const config = severityConfig[severity as keyof typeof severityConfig]
        return <Tag color={config.color}>{config.text}</Tag>
    }

    const handleDownload = (record: Report) => {
        // 实现下载报告的逻辑
        console.log('Download report:', record.id)
    }

    const handleView = (record: Report) => {
        // 实现查看报告的逻辑
        console.log('View report:', record.id)
    }

    const handleShare = (record: Report) => {
        // 实现分享报告的逻辑
        console.log('Share report:', record.id)
    }

    const columns = [
        {
            title: '报告ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
        },
        {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            ellipsis: true,
            render: (text: string, record: Report) => (
                <div>
                    <div>{text}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.taskId}
                    </Text>
                </div>
            )
        },
        {
            title: '扫描目标',
            dataIndex: 'target',
            key: 'target',
            ellipsis: true,
        },
        {
            title: '扫描类型',
            dataIndex: 'scanType',
            key: 'scanType',
            width: 120,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => getStatusTag(status),
        },
        {
            title: '风险等级',
            dataIndex: 'severity',
            key: 'severity',
            width: 100,
            render: (severity: string) => getSeverityTag(severity),
        },
        {
            title: '漏洞数量',
            dataIndex: 'vulnerabilities',
            key: 'vulnerabilities',
            width: 100,
            render: (count: number) => (
                <Text type={count > 0 ? 'danger' : 'secondary'}>{count}</Text>
            ),
        },
        {
            title: '生成时间',
            dataIndex: 'generatedAt',
            key: 'generatedAt',
            width: 160,
        },
        {
            title: '文件大小',
            dataIndex: 'size',
            key: 'size',
            width: 100,
        },
        {
            title: '操作',
            key: 'actions',
            width: 180,
            render: (_, record: Report) => (
                <Space size="small">
                    <PermissionComponent permission={PERMISSIONS.REPORT.VIEW}>
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                            disabled={record.status !== 'completed'}
                        >
                            查看
                        </Button>
                    </PermissionComponent>

                    <PermissionComponent permission={PERMISSIONS.REPORT.EXPORT}>
                        <Button
                            type="link"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(record)}
                            disabled={record.status !== 'completed'}
                        >
                            下载
                        </Button>
                    </PermissionComponent>

                    <PermissionComponent permission={PERMISSIONS.REPORT.SHARE}>
                        <Popover
                            content={
                                <div className="space-y-2">
                                    <Button block size="small">生成分享链接</Button>
                                    <Button block size="small">发送邮件</Button>
                                </div>
                            }
                            title="分享报告"
                            trigger="click"
                        >
                            <Button
                                type="link"
                                size="small"
                                icon={<ShareAltOutlined />}
                                disabled={record.status !== 'completed'}
                            >
                                分享
                            </Button>
                        </Popover>
                    </PermissionComponent>
                </Space>
            ),
        },
    ]

    const filteredReports = reports.filter(report => {
        const matchSearch = 
            report.id.toLowerCase().includes(searchText.toLowerCase()) ||
            report.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
            report.target.toLowerCase().includes(searchText.toLowerCase())
        
        const matchStatus = statusFilter === 'all' || report.status === statusFilter
        const matchSeverity = severityFilter === 'all' || report.severity === severityFilter
        
        return matchSearch && matchStatus && matchSeverity
    })

    return (
        <div className="p-6">
            <Card>
                <div className="mb-6">
                    <Title level={3} className="!mb-4">报告管理</Title>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <Search
                            placeholder="搜索报告ID、任务名称或目标"
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        
                        <Select
                            placeholder="状态筛选"
                            allowClear
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Select.Option value="all">全部状态</Select.Option>
                            <Select.Option value="generating">生成中</Select.Option>
                            <Select.Option value="completed">已完成</Select.Option>
                            <Select.Option value="failed">生成失败</Select.Option>
                        </Select>
                        
                        <Select
                            placeholder="风险等级"
                            allowClear
                            value={severityFilter}
                            onChange={setSeverityFilter}
                        >
                            <Select.Option value="all">全部等级</Select.Option>
                            <Select.Option value="high">高危</Select.Option>
                            <Select.Option value="medium">中危</Select.Option>
                            <Select.Option value="low">低危</Select.Option>
                            <Select.Option value="info">信息</Select.Option>
                        </Select>
                        
                        <RangePicker placeholder={['开始时间', '结束时间']} />
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredReports}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                    }}
                    scroll={{ x: 1400 }}
                />
            </Card>
        </div>
    )
}