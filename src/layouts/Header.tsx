import { Layout, Button, Dropdown, Avatar, Typography } from 'antd'
import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useAuth } from '@/lib/auth-context'
import type { MenuProps } from 'antd'

const { Header: AntHeader } = Layout
const { Text, Title } = Typography

export default function Header() {
    const { user, logout } = useAuth()

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人资料',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '账户设置',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            danger: true,
            onClick: logout,
        },
    ]

    return (
        <AntHeader className="!bg-gray-800 !px-6 flex items-center justify-between border-b border-gray-700 h-16">
            <div>
                 {/* 这里可以放置面包屑或者是当前页面标题，目前简写为固定标题 */}
                 <Title level={4} className="!text-white !mb-0">
                    控制台
                 </Title>
            </div>
            <div className="flex items-center gap-4">
                <Button
                    type="text"
                    icon={<BellOutlined className="text-xl" />}
                    className="!text-gray-300 hover:!text-white"
                />
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-3 py-2 rounded-lg transition">
                        <Avatar icon={<UserOutlined />} className="!bg-purple-600" />
                        <Text className="!text-white">{user?.username || 'Admin'}</Text>
                    </div>
                </Dropdown>
            </div>
        </AntHeader>
    )
}
