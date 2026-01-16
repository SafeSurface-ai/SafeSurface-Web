import { Layout, Menu, Typography } from 'antd'
import { useRouter } from 'next/router'
import {
    DashboardOutlined,
    SecurityScanOutlined,
    BugOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons'

const { Sider } = Layout
const { Title } = Typography

// 菜单项
const menuItems = [
    {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: '仪表盘',
    },
    {
        key: '/scans',
        icon: <SecurityScanOutlined />,
        label: '扫描任务',
    },
    {
        key: '/vulnerabilities',
        icon: <BugOutlined />,
        label: '漏洞管理',
    },
    {
        key: '/reports',
        icon: <FileTextOutlined />,
        label: '报告中心',
    },
    {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '系统设置',
    },
]

export default function Sidebar() {
    const router = useRouter()
    const pathname = router.pathname
    
    // 简单的路由匹配逻辑
    const selectedKey = menuItems.find(item => pathname.startsWith(item.key))?.key || '/dashboard'

    return (
        <Sider 
            width={250} 
            className="!bg-gray-900 border-r border-gray-800"
            trigger={null}
        >
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <SecurityScanOutlined className="text-3xl text-purple-400" />
                <Title level={4} className="!text-white !mb-0 !ml-3">
                    SafeSurface
                </Title>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                onClick={({ key }) => router.push(key)}
                className="!bg-gray-900 !border-r-0 mt-4"
            />
        </Sider>
    )
}
