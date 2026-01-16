'use client'

import { useState } from 'react'
import { Card, Form, Input, InputNumber, Switch, Button, Typography, message, Divider, Alert, Space } from 'antd'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface SystemSettings {
    // 扫描配置
    maxConcurrentScans: number
    defaultTimeout: number
    scanResultRetentionDays: number
    
    // 安全配置
    sessionTimeout: number
    passwordMinLength: number
    enableTwoFactor: boolean
    enableIPWhitelist: boolean
    
    // 报告配置
    reportRetentionDays: number
    maxReportSize: number
    enableAutoReport: boolean
    
    // 系统配置
    enableLogging: boolean
    logLevel: string
    enableNotifications: boolean
    systemMaintenance: boolean
}

export default function SystemSettingsPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [modified, setModified] = useState(false)

    // 模拟初始设置
    const initialSettings: SystemSettings = {
        maxConcurrentScans: 10,
        defaultTimeout: 30,
        scanResultRetentionDays: 90,
        sessionTimeout: 24,
        passwordMinLength: 8,
        enableTwoFactor: false,
        enableIPWhitelist: false,
        reportRetentionDays: 180,
        maxReportSize: 100,
        enableAutoReport: true,
        enableLogging: true,
        logLevel: 'INFO',
        enableNotifications: true,
        systemMaintenance: false
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const values = await form.validateFields()
            
            // 这里实现保存设置的API调用
            await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
            
            message.success('系统设置保存成功')
            setModified(false)
        } catch (error) {
            message.error('保存设置失败')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        form.setFieldsValue(initialSettings)
        setModified(false)
        message.info('已重置为默认设置')
    }

    const handleValuesChange = () => {
        setModified(true)
    }

    return (
        <div className="p-6">
            <Card>
                <Title level={3} className="!mb-6">系统设置</Title>
                
                {modified && (
                    <Alert
                        message="设置已修改"
                        description="您有未保存的修改，请记得保存设置。"
                        type="warning"
                        showIcon
                        className="mb-6"
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialSettings}
                    onValuesChange={handleValuesChange}
                >
                    {/* 扫描配置 */}
                    <Card size="small" title="扫描配置" className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="maxConcurrentScans"
                                label="最大并发扫描数"
                                rules={[{ required: true, type: 'number', min: 1, max: 50 }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={50}
                                    style={{ width: '100%' }}
                                    addonAfter="个"
                                />
                            </Form.Item>

                            <Form.Item
                                name="defaultTimeout"
                                label="默认超时时间"
                                rules={[{ required: true, type: 'number', min: 5, max: 300 }]}
                            >
                                <InputNumber
                                    min={5}
                                    max={300}
                                    style={{ width: '100%' }}
                                    addonAfter="秒"
                                />
                            </Form.Item>

                            <Form.Item
                                name="scanResultRetentionDays"
                                label="扫描结果保留天数"
                                rules={[{ required: true, type: 'number', min: 1, max: 365 }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={365}
                                    style={{ width: '100%' }}
                                    addonAfter="天"
                                />
                            </Form.Item>
                        </div>
                    </Card>

                    {/* 安全配置 */}
                    <Card size="small" title="安全配置" className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="sessionTimeout"
                                label="会话超时时间"
                                rules={[{ required: true, type: 'number', min: 1, max: 168 }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={168}
                                    style={{ width: '100%' }}
                                    addonAfter="小时"
                                />
                            </Form.Item>

                            <Form.Item
                                name="passwordMinLength"
                                label="密码最小长度"
                                rules={[{ required: true, type: 'number', min: 6, max: 20 }]}
                            >
                                <InputNumber
                                    min={6}
                                    max={20}
                                    style={{ width: '100%' }}
                                    addonAfter="位"
                                />
                            </Form.Item>

                            <Form.Item
                                name="enableTwoFactor"
                                label="启用双因子认证"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                name="enableIPWhitelist"
                                label="启用IP白名单"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </div>
                    </Card>

                    {/* 报告配置 */}
                    <Card size="small" title="报告配置" className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="reportRetentionDays"
                                label="报告保留天数"
                                rules={[{ required: true, type: 'number', min: 30, max: 365 }]}
                            >
                                <InputNumber
                                    min={30}
                                    max={365}
                                    style={{ width: '100%' }}
                                    addonAfter="天"
                                />
                            </Form.Item>

                            <Form.Item
                                name="maxReportSize"
                                label="报告最大尺寸"
                                rules={[{ required: true, type: 'number', min: 10, max: 500 }]}
                            >
                                <InputNumber
                                    min={10}
                                    max={500}
                                    style={{ width: '100%' }}
                                    addonAfter="MB"
                                />
                            </Form.Item>

                            <Form.Item
                                name="enableAutoReport"
                                label="启用自动生成报告"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </div>
                    </Card>

                    {/* 系统配置 */}
                    <Card size="small" title="系统配置" className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="enableLogging"
                                label="启用系统日志"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                name="enableNotifications"
                                label="启用系统通知"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                name="systemMaintenance"
                                label="系统维护模式"
                                valuePropName="checked"
                                extra="启用后将限制非管理员用户访问"
                            >
                                <Switch />
                            </Form.Item>
                        </div>
                    </Card>

                    <Divider />

                    <div className="flex justify-between">
                        <Button 
                            onClick={handleReset}
                            icon={<ReloadOutlined />}
                            disabled={loading}
                        >
                            重置为默认
                        </Button>

                        <Space>
                            <Button 
                                type="primary" 
                                onClick={handleSave}
                                loading={loading}
                                icon={<SaveOutlined />}
                                disabled={!modified}
                            >
                                保存设置
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    )
}