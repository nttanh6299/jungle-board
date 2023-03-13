import fetch from 'isomorphic-unfetch'

export interface SocialUser {
  providerAccountId: string
  name: string
  email: string
  provider: string
}

interface GoogleUser {
  sub: string
  email: string
  name: string
}

interface FacebookUser {
  id: string
  email: string
  name: string
}

interface GithubUser {
  id: number
  email: string
  name: string
}

const authService = {
  google: (accessToken: string, idToken: string): Promise<SocialUser> => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return new Promise((resolve, reject) => {
      fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}&id_token=${idToken}`, options)
        .then((res) => res.json())
        .then((data: GoogleUser) =>
          resolve({ provider: 'google', providerAccountId: data.sub, name: data.name, email: data.email }),
        )
        .catch(reject)
    })
  },
  facebook: (accessToken: string): Promise<SocialUser> => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return new Promise((resolve, reject) => {
      fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`, options)
        .then((res) => res.json())
        .then((data: FacebookUser) =>
          resolve({ provider: 'facebook', providerAccountId: data.id, name: data.name, email: data.email }),
        )
        .catch(reject)
    })
  },
  github: (accessToken: string): Promise<SocialUser> => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${accessToken}`,
      },
    }
    return new Promise((resolve, reject) => {
      fetch('https://api.github.com/user', options)
        .then((res) => res.json())
        .then((data: GithubUser) =>
          resolve({ provider: 'github', providerAccountId: String(data.id), name: data.name, email: data.email || '' }),
        )
        .catch(reject)
    })
  },
}

export default authService
