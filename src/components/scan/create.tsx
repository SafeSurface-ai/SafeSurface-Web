'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card, Form, Input, Select, Button, Radio, Space, Typography, message, Alert } from 'antd'
import { ArrowLeftOutlined, RocketOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { TextArea } = Input

interface ScanConfig {
    name: string
    target: string
    type: string
    depth: string
    concurrent: number
    timeout: number
    description?: string
}

export default function ScanCreatePage() {
    const router = useRouter()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [scanType, setScanType] = useState('web')

    const onFinish = async (values: ScanConfig) => {
        setLoading(true)
        try {
            // 这里实现创建扫描任务的API调用
            await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟API调用
            
            message.success('扫描任务创建成功！')
            router.push('/scan/list')
        } catch (error) {
            message.error('创建扫描任务失败')
        } finally {
            setLoading(false)
        }
    }

    const scanTypeOptions = [
        { label: 'Web应用扫描', value: 'web' },
        { label: '主机端口扫描', value: 'host' },
        { label: 'API接口测试', value: 'api' },
        { label: '综合安全扫描', value: 'comprehensive' },
    ]

    const depthOptions = [
        { label: '快速扫描', value: 'quick', description: '基础漏洞检测，速度快' },
        { label: '标准扫描', value: 'standard', description: '常见漏洞全面检测' },
        { label: '深度扫描', value: 'deep', description: '全面深度检测，耗时较长' },
        { label: '自定义', value: 'custom', description: '自定义扫描规则' },
    ]

    return (
        <div className="p-6">
            <Card>
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <Button 
                            type="link" 
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            className="p-0 mr-2"
                        >
                            返回
                        </Button>
                        <Title level={3} className="!mb-0">创建扫描任务</Title>
                    </div>
                    
                    <Alert
                        message="AI Agent 智能扫描"
                        description="基于大模型的智能漏洞分析，7个AI Agent协同工作，自动化完成渗透测试流程"
                        type="info"
                        showIcon
                        className="mb-6"
                    />
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        type: 'web',
                        depth: 'standard',
                        concurrent: 10,
                        timeout: 30,
                    }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <Form.Item
                                name="name"
                                label="任务名称"
                                rules={[{ required: true, message: '请输入任务名称' }]}
                            >
                                <Input placeholder="请输入扫描任务名称" />
                            </Form.Item>

                            <Form.Item
                                name="target"
                                label="扫描目标"
                                rules={[{ required: true, message: '请输入扫描目标' }]}
                            >
                                <Input placeholder="请输入URL、IP地址或IP段" />
                            </Form.Item>

                            <Form.Item
                                name="type"
                                label="扫描类型"
                                rules={[{ required: true }]}
                            >
                                <Radio.Group 
                                    options={scanTypeOptions}
                                    onChange={(e) => setScanType(e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item
                                name="depth"
                                label="扫描深度"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="请选择扫描深度">
                                    {depthOptions.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            <div>
                                                <div>{option.label}</div>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {option.description}
                                                </Text>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div>
                            <Form.Item
                                name="concurrent"
                                label="并发数"
                                rules={[{ required: true, type: 'number', min: 1, max: 50 }]}
                            >
                                <Input type="number" placeholder="并发扫描线程数 (1-50)" />
                            </Form.Item>

                            <Form.Item
                                name="timeout"
                                label="超时时间 (秒)"
                                rules={[{ required: true, type: 'number', min: 5, max: 300 }]}
                            >
                                <Input type="number" placeholder="单个请求超时时间 (5-300)" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="任务描述"
                            >
                                <TextArea 
                                    rows={4}
                                    placeholder="请描述此次扫描任务的目的和注意事项"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                icon={<RocketOutlined />}
                                size="large"
                            >
                                立即启动扫描
                            </Button>
                            <Button 
                                size="large"
                                onClick={() => router.back()}
                            >
                                取消
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    )
}