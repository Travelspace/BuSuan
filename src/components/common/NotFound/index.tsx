import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import Card from '../Card'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <Card hover={false} className="max-w-md w-full text-center animate-fade-in-up">
        <div className="text-8xl font-serif text-gold/20 mb-4 animate-float">卜</div>
        <h2 className="text-2xl font-serif text-gold mb-3">页面未找到</h2>
        <p className="text-text-secondary text-sm mb-6">
          您访问的页面不存在，可能已被移动或删除
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            返回上页
          </Button>
          <Button onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default NotFound
