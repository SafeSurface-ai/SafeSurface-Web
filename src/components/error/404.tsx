'use client'

import { useRouter } from 'next/router'
import { Result, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export default function Error404() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <QuestionCircleOutlined className="text-8xl text-blue-400 mb-4" />
                </div>
                <Result
                    status="404"
                    title={<span className="text-white text-4xl font-bold">404</span>}
                    subTitle={<span className="text-gray-300 text-lg">抱歉，您访问的页面不存在</span>}
                    extra={
                        <div className="space-y-4 mt-8">
                            <Button 
                                type="primary" 
                                size="large"
                                onClick={() => router.push('/')}
                                className="bg-purple-600 border-purple-600 hover:bg-purple-700 hover:border-purple-700"
                            >
                                返回首页
                            </Button>
                            <Button 
                                size="large"
                                onClick={() => router.back()}
                                className="text-gray-300 border-gray-600 hover:text-white hover:border-white"
                            >
                                返回上一页
                            </Button>
                        </div>
                    }
                />
            </div>
        </div>
    )
}