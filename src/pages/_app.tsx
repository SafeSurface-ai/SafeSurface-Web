import type { AppProps } from 'next/app'
import { AuthProvider } from '@/lib/auth-context'
import { RouteGuard } from '@/router'
import MainLayout from '@/layouts/MainLayout'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme, App } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import '@/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AntdRegistry>
      <ConfigProvider 
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#7c3aed', // 紫色主题
          },
          algorithm: theme.darkAlgorithm, // 暗色主题
        }}
      >
        <App>
          <AuthProvider>
            <RouteGuard>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </RouteGuard>
          </AuthProvider>
        </App>
      </ConfigProvider>
    </AntdRegistry>
  )
}