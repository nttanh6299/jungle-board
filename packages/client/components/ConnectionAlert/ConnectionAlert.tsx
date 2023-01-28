import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NotifyEvent } from 'constants/enum'
import { subscribe, unsubscribe } from 'utils/subscriber'
import Alert from 'components/Alert'

const ConnectionAlert = () => {
  const { t } = useTranslation('common')
  const [canShowAlert, setCanShowAlert] = useState(false)

  const onClose = () => setCanShowAlert(false)
  const onOpen = () => setCanShowAlert(true)

  useEffect(() => {
    subscribe(NotifyEvent.ShowConnectionAlert, onOpen)

    return () => {
      unsubscribe(NotifyEvent.ShowConnectionAlert, onOpen)
    }
  })

  return <Alert canShow={canShowAlert} onClose={onClose} description={t('connectionAlert')} />
}

export default ConnectionAlert
