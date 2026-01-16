'use client'

import { Spin } from 'antd'

interface LoadingProps {
    size?: 'small' | 'default' | 'large'
    tip?: string
    fullScreen?: boolean
}

export default function Loading({ size = 'large', tip = '加载中...', fullScreen = false }: LoadingProps) {
    if (fullScreen) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size={size} tip={tip} />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-8">
            <Spin size={size} tip={tip} />
        </div>
    )
}
