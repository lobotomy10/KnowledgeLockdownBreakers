import * as React from 'react'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { translations, type Language } from '@/lib/translations'

interface SignupResponse {
  id: string
  email: string
  username: string
  token_balance: number
  created_at: string
}

interface SignupProps {
  setIsAuthenticated: (value: boolean) => void
  setUser: (user: SignupResponse | null) => void
  setTokens: (tokens: number) => void
  language: Language
}

export function Signup({ setIsAuthenticated, setUser, setTokens, language }: SignupProps) {
  const t = translations[language]
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    if (!email || !username || !password) {
      setError('All fields are required')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('https://cardnote-backend-wbgoevjh.fly.dev/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('Signup failed')
      }

      const data: SignupResponse = await response.json()
      // Store user data in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(data))
      // Update parent component state through props
      setIsAuthenticated(true)
      setUser(data)
      setTokens(data.token_balance)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t.signUpTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.username}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'en' ? "Choose a username" : "ユーザー名を選択"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error === 'All fields are required' ? t.error.required : 
                 error === 'Signup failed' ? t.error.signupFailed :
                 error}
              </div>
            )}
            <Button 
              className="w-full"
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? "Creating Account..." : "アカウント作成中..."}
                </>
              ) : (
                t.createAccount
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
