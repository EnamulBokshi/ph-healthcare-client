import LoginForm from '@/components/modules/Auth/LoginForm'
import React from 'react'

interface LoginParams{
  searchParams: Promise<{redirect?: string}>
}

export default async function LoginPage({searchParams}: LoginParams) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/';
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>

      <LoginForm  redirectTo={redirectTo}/>
    </div>
  )
}
