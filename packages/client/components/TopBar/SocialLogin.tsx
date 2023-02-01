import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { signIn } from 'next-auth/react'
import Button from 'components/Button'
import FacebookIcon from 'icons/Facebook'
import GithubIcon from 'icons/Github'
import GoogleIcon from 'icons/Google'
import Popover from 'components/Popover'
import { BuiltInProviderType } from 'next-auth/providers'

const SocialLogin = () => {
  const { t } = useTranslation('common')
  const [loading, setLoading] = useState<Record<BuiltInProviderType, boolean>>()

  const handleSignIn = (provider: BuiltInProviderType) => () => {
    if (!loading?.[provider]) {
      setLoading((prev) => ({ ...prev, [provider]: true }))
    }
    signIn(provider)
  }

  return (
    <div>
      <Popover title={t('loginInHere')} className="p-4">
        <p className="text-sm sm:text-base">{t('unlockFeatures')}</p>
        <div className="mt-3 block sm:flex">
          <Button
            className="font-medium min-w-[140px] bg-google border-google shadow-google/25"
            rounded
            iconLeft={<GoogleIcon />}
            onClick={handleSignIn('google')}
            loading={loading?.['google']}
          >
            Google
          </Button>
          <Button
            className="font-medium min-w-[140px] ml-0 sm:ml-4 mt-4 sm:mt-0 bg-facebook border-facebook shadow-facebook/25"
            rounded
            iconLeft={<FacebookIcon />}
            onClick={handleSignIn('facebook')}
            loading={loading?.['facebook']}
          >
            Facebook
          </Button>
          <Button
            className="font-medium min-w-[140px] ml-0 sm:ml-4 mt-4 sm:mt-0 bg-github border-github shadow-github/25"
            rounded
            iconLeft={<GithubIcon />}
            onClick={handleSignIn('github')}
            loading={loading?.['github']}
          >
            Github
          </Button>
        </div>
      </Popover>
    </div>
  )
}

export default memo(SocialLogin)
