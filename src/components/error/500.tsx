'use client'

import { useRouter } from 'next/router'
import { Result, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export default function Error500() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <ExclamationCircleOutlined className="text-8xl text-orange-400 mb-4" />
                </div>
                <Result
                    status="500"
                    title={<span className="text-white text-4xl font-bold">500</span>}
                    subTitle={<span className="text-gray-300 text-lg">服务器内部错误，请稍后再试</span>}
                    extra={
                        <div className="space-y-4 mt-8">
                            <Button 
                                type="primary" 
                                size="large"
                                onClick={() => window.location.reload()}
                                className="bg-purple-600 border-purple-600 hover:bg-purple-700 hover:border-purple-700"
                            >
                                刷新页面
                            </Button>
                            <Button 
                                size="large"
                                onClick={() => router.push('/')}
                                className="text-gray-300 border-gray-600 hover:text-white hover:border-white"
                            >
                                返回首页
                            </Button>
                        </div>
                    }
                />
            </div>
        </div>
    )
}