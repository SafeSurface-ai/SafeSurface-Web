'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Result, Button } from 'antd'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <Result
                        status="error"
                        title="出错了"
                        subTitle="抱歉，页面发生了错误。"
                        extra={
                            <Button type="primary" onClick={() => window.location.reload()}>
                                刷新页面
                            </Button>
                        }
                    />
                </div>
            )
        }

        return this.props.children
    }
}
