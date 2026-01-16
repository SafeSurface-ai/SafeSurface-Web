'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Progress, Card, Typography, message, Modal, Input } from 'antd'
import { PlayCircleOutlined, PauseCircleOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { PermissionComponent, usePermission } from '@/router'
import { PERMISSIONS, UserRole } from '@/constants/permissions'

const { Title, Text } = Typography
const { Search } = Input

interface ScanTask {
    key: string
    id: string
    target: string
    type: string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
    progress: number
    findings: number
    startTime: string
    endTime?: string
}

export default function ScanListPage() {
    const router = useRouter()
    const { checkPermission } = usePermission()
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    
    // 模拟数据
    const [scanTasks, setScanTasks] = useState<ScanTask[]>([
        {
            key: '1',
            id: 'SCAN-2026-001',
            target: 'https://example.com',
            type: 'Web应用扫描',
            status: 'running',
            progress: 65,
            findings: 12,
            startTime: '2026-01-15 14:30',
        },
        {
            key: '2',
            id: 'SCAN-2026-002',
            target: '192.168.1.0/24',
            type: '主机扫描',
            status: 'completed',
            progress: 100,
            findings: 8,
            startTime: '2026-01-15 10:00',
            endTime: '2026-01-15 12:30',
        },
        {
            key: '3',
            id: 'SCAN-2026-003',
            target: 'api.example.com',
            type: 'API测试',
            status: 'pending',
            progress: 0,
            findings: 0,
            startTime: '2026-01-15 16:00',
        },
    ])

    const getStatusTag = (status: string) => {
        const statusConfig = {
            pending: { color: 'blue', text: '等待中' },
            running: { color: 'orange', text: '扫描中' },
            completed: { color: 'green', text: '已完成' },
            failed: { color: 'red', text: '失败' },
            paused: { color: 'purple', text: '已暂停' },
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        return <Tag color={config.color}>{config.text}</Tag>
    }

    const handleStartScan = (record: ScanTask) => {
        message.success(`启动扫描任务 ${record.id}`)
        // 这里实现启动扫描的逻辑
    }

    const handlePauseScan = (record: ScanTask) => {
        message.success(`暂停扫描任务 ${record.id}`)
        // 这里实现暂停扫描的逻辑
    }

    const handleDeleteScan = (record: ScanTask) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除扫描任务 ${record.id} 吗？`,
            onOk() {
                setScanTasks(tasks => tasks.filter(task => task.key !== record.key))
                message.success('删除成功')
            },
        })
    }

    const handleViewDetails = (record: ScanTask) => {
        router.push(`/scan/detail/${record.id}`)
    }

    const columns = [
        {
            title: '任务ID',
            dataIndex: 'id',
            key: 'id',
            width: 150,
        },
        {
            title: '扫描目标',
            dataIndex: 'target',
            key: 'target',
            ellipsis: true,
        },
        {
            title: '扫描类型',
            dataIndex: 'type',
            key: 'type',
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
            title: '进度',
            dataIndex: 'progress',
            key: 'progress',
            width: 150,
            render: (progress: number, record: ScanTask) => (
                <Progress 
                    percent={progress} 
                    size="small"
                    status={record.status === 'failed' ? 'exception' : 'normal'}
                />
            ),
        },
        {
            title: '发现问题',
            dataIndex: 'findings',
            key: 'findings',
            width: 100,
            render: (findings: number) => (
                <Text type={findings > 0 ? 'danger' : 'secondary'}>{findings}</Text>
            ),
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 160,
        },
        {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (_, record: ScanTask) => (
                <Space size="small">
                    <PermissionComponent permission={PERMISSIONS.SCAN.VIEW}>
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                        >
                            详情
                        </Button>
                    </PermissionComponent>
                    
                    <PermissionComponent permission={PERMISSIONS.SCAN.EXECUTE}>
                        {record.status === 'running' ? (
                            <Button
                                type="link"
                                size="small"
                                icon={<PauseCircleOutlined />}
                                onClick={() => handlePauseScan(record)}
                            >
                                暂停
                            </Button>
                        ) : (
                            <Button
                                type="link"
                                size="small"
                                icon={<PlayCircleOutlined />}
                                onClick={() => handleStartScan(record)}
                                disabled={record.status === 'completed'}
                            >
                                启动
                            </Button>
                        )}
                    </PermissionComponent>

                    <PermissionComponent permission={PERMISSIONS.SCAN.DELETE}>
                        <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteScan(record)}
                        >
                            删除
                        </Button>
                    </PermissionComponent>
                </Space>
            ),
        },
    ]

    const filteredTasks = scanTasks.filter(task =>
        task.id.toLowerCase().includes(searchText.toLowerCase()) ||
        task.target.toLowerCase().includes(searchText.toLowerCase()) ||
        task.type.toLowerCase().includes(searchText.toLowerCase())
    )

    return (
        <div className="p-6">
            <Card>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={3} className="!mb-0">扫描任务管理</Title>
                        <PermissionComponent permission={PERMISSIONS.SCAN.CREATE}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => router.push('/scan/create')}
                            >
                                创建扫描
                            </Button>
                        </PermissionComponent>
                    </div>
                    
                    <Search
                        placeholder="搜索任务ID、目标或类型"
                        allowClear
                        style={{ width: 300 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredTasks}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>
        </div>
    )
}