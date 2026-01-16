import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <AntFooter className="text-center text-gray-500">
            SafeSurface ©{currentYear} - AI Agent渗透测试平台
        </AntFooter>
    )
}
