'use client'

import { useState } from 'react'
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, Form, Select, message, Avatar } from 'antd'
import { UserAddOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { PermissionComponent } from '@/router'
import { PERMISSIONS, UserRole } from '@/constants/permissions'

const { Title, Text } = Typography
const { Search } = Input

interface User {
    key: string
    id: number
    username: string
    email: string
    roles: UserRole[]
    isActive: boolean
    createdAt: string
    lastLogin?: string
}

export default function UserManagementPage() {
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [form] = Form.useForm()

    // 模拟数据
    const [users, setUsers] = useState<User[]>([
        {
            key: '1',
            id: 1,
            username: 'admin',
            email: 'admin@safesurface.com',
            roles: [UserRole.ADMIN],
            isActive: true,
            createdAt: '2026-01-01 10:00:00',
            lastLogin: '2026-01-15 14:30:00'
        },
        {
            key: '2',
            id: 2,
            username: 'operator1',
            email: 'operator1@safesurface.com',
            roles: [UserRole.OPERATOR],
            isActive: true,
            createdAt: '2026-01-05 15:20:00',
            lastLogin: '2026-01-15 09:15:00'
        },
        {
            key: '3',
            id: 3,
            username: 'user1',
            email: 'user1@safesurface.com',
            roles: [UserRole.USER],
            isActive: true,
            createdAt: '2026-01-10 11:45:00',
            lastLogin: '2026-01-14 16:20:00'
        },
        {
            key: '4',
            id: 4,
            username: 'viewer1',
            email: 'viewer1@safesurface.com',
            roles: [UserRole.VIEWER],
            isActive: false,
            createdAt: '2026-01-12 14:30:00'
        }
    ])

    const getRoleTag = (roles: UserRole[]) => {
        const roleColors = {
            [UserRole.ADMIN]: 'red',
            [UserRole.OPERATOR]: 'orange',
            [UserRole.USER]: 'blue',
            [UserRole.VIEWER]: 'green'
        }
        
        const roleNames = {
            [UserRole.ADMIN]: '管理员',
            [UserRole.OPERATOR]: '操作员',
            [UserRole.USER]: '用户',
            [UserRole.VIEWER]: '访客'
        }

        return roles.map(role => (
            <Tag key={role} color={roleColors[role]}>
                {roleNames[role]}
            </Tag>
        ))
    }

    const handleAddUser = () => {
        setEditingUser(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            roles: user.roles,
            isActive: user.isActive
        })
        setIsModalVisible(true)
    }

    const handleDeleteUser = (user: User) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除用户 ${user.username} 吗？`,
            onOk() {
                setUsers(users => users.filter(u => u.key !== user.key))
                message.success('删除成功')
            },
        })
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            
            if (editingUser) {
                // 更新用户
                setUsers(users => users.map(user => 
                    user.key === editingUser.key 
                        ? { ...user, ...values }
                        : user
                ))
                message.success('用户更新成功')
            } else {
                // 新增用户
                const newUser: User = {
                    key: String(Date.now()),
                    id: Date.now(),
                    ...values,
                    createdAt: new Date().toLocaleString('zh-CN'),
                }
                setUsers(users => [...users, newUser])
                message.success('用户创建成功')
            }
            
            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('Validation failed:', error)
        }
    }

    const columns = [
        {
            title: '用户',
            key: 'user',
            render: (_, record: User) => (
                <div className="flex items-center space-x-3">
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium">{record.username}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {record.email}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: UserRole[]) => getRoleTag(roles),
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? '启用' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
        },
        {
            title: '最后登录',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            width: 160,
            render: (time: string) => time || '-',
        },
        {
            title: '操作',
            key: 'actions',
            width: 150,
            render: (_, record: User) => (
                <Space size="small">
                    <PermissionComponent permission={PERMISSIONS.USER.UPDATE}>
                        <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditUser(record)}
                        >
                            编辑
                        </Button>
                    </PermissionComponent>

                    <PermissionComponent permission={PERMISSIONS.USER.DELETE}>
                        <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteUser(record)}
                            disabled={record.roles.includes(UserRole.ADMIN)}
                        >
                            删除
                        </Button>
                    </PermissionComponent>
                </Space>
            ),
        },
    ]

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    )

    return (
        <div className="p-6">
            <Card>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={3} className="!mb-0">用户管理</Title>
                        <PermissionComponent permission={PERMISSIONS.USER.CREATE}>
                            <Button
                                type="primary"
                                icon={<UserAddOutlined />}
                                onClick={handleAddUser}
                            >
                                新增用户
                            </Button>
                        </PermissionComponent>
                    </div>
                    
                    <Search
                        placeholder="搜索用户名或邮箱"
                        allowClear
                        style={{ width: 300 }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                    }}
                />
            </Card>

            <Modal
                title={editingUser ? '编辑用户' : '新增用户'}
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                }}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                        roles: [UserRole.USER]
                    }}
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]}
                    >
                        <Input placeholder="请输入邮箱地址" />
                    </Form.Item>

                    <Form.Item
                        name="roles"
                        label="角色"
                        rules={[{ required: true, message: '请选择用户角色' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择用户角色"
                            allowClear
                        >
                            <Select.Option value={UserRole.ADMIN}>管理员</Select.Option>
                            <Select.Option value={UserRole.OPERATOR}>操作员</Select.Option>
                            <Select.Option value={UserRole.USER}>用户</Select.Option>
                            <Select.Option value={UserRole.VIEWER}>访客</Select.Option>
                        </Select>
                    </Form.Item>

                    {!editingUser && (
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[
                                { required: true, message: '请输入密码' },
                                { min: 6, message: '密码长度至少6位' }
                            ]}
                        >
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="isActive"
                        label="状态"
                        valuePropName="checked"
                    >
                        <Select>
                            <Select.Option value={true}>启用</Select.Option>
                            <Select.Option value={false}>禁用</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}