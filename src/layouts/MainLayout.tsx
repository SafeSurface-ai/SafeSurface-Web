import { Layout } from 'antd'
import { useRouter } from 'next/router'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

const { Content } = Layout

interface MainLayoutProps {
    children?: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const router = useRouter()
    const pathname = router.pathname
    
    // 不需要布局的页面
    const noLayoutPages = ['/login', '/welcome', '/register', '/403', '/404', '/500', '/']
    
    // 检查当前路径是否需要布局
    const shouldShowLayout = !noLayoutPages.includes(pathname)
    
    // 无布局页面直接返回子组件
    if (!shouldShowLayout) {
        return <>{children}</>
    }

    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header />
                <Content className="!bg-gray-900 p-6 min-h-[calc(100vh-64px)] overflow-y-auto">
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}
