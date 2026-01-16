'use client'

import { AuthProvider } from '@/lib/auth-context'
import { RouteGuard } from '@/router'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <AuthProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </AuthProvider>
      </ConfigProvider>
    </AntdRegistry>
  )
}