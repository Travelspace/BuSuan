import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../Button'
import Card from '../Card'
import { useTranslation } from '../../../i18n'

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  const t = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <Card hover={false} className="max-w-md w-full text-center animate-fade-in-up">
        <div className="text-8xl font-serif text-gold/20 mb-4 animate-float">卜</div>
        <h2 className="text-2xl font-serif text-gold mb-3">{t.NOTFOUND_UI.title}</h2>
        <p className="text-text-secondary text-sm mb-6">
          {t.NOTFOUND_UI.desc}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            {t.NOTFOUND_UI.back}
          </Button>
          <Button onClick={() => navigate('/')}>
            {t.NOTFOUND_UI.home}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default NotFound
