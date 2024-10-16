import { useState, useEffect } from 'react'
import { SandboxSettingsAccountGeneralPage, ProfileFields, PasswordFields } from './profile-settings-general-page'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import {
  useGetUserQuery,
  GetUserOkResponse,
  GetUserErrorResponse,
  useUpdateUserMutation,
  UpdateUserRequestBody,
  UpdateUserOkResponse,
  UpdateUserErrorResponse
} from '@harnessio/code-service-client'
import useToken from '../../framework/hooks/useToken'

export const SettingsProfileGeneralPage: React.FC = () => {
  const [apiError, setApiError] = useState<{ type: 'profile' | 'password'; message: string } | null>(null)

  const [userData, setUserData] = useState<ProfileFields>({
    name: '',
    username: '',
    email: ''
  })

  const { token } = useToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/signin')
    }
  }, [token])

  const { isLoading: isLoadingUser } = useGetUserQuery(
    {},
    {
      onSuccess: (data: GetUserOkResponse) => {
        setUserData({
          name: data.display_name || '',
          username: data.uid || '',
          email: data.email || ''
        })
      },
      onError: (error: GetUserErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'profile', message: message })
      }
    }
  )
  const updateUserMutation = useUpdateUserMutation(
    {},
    {
      onSuccess: (data: UpdateUserOkResponse) => {
        setUserData({
          name: data.display_name || '',
          username: data.uid || '',
          email: data.email || ''
        })
      },
      onError: (error: UpdateUserErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'profile', message: message })
      }
    }
  )

  const updatePasswordMutation = useUpdateUserMutation(
    {},
    {
      onSuccess: (data: UpdateUserOkResponse) => {
        setUserData({
          name: data.display_name || '',
          username: data.uid || '',
          email: data.email || ''
        })
      },
      onError: (error: UpdateUserErrorResponse) => {
        const message = error.message || 'An unknown error occurred.'
        setApiError({ type: 'password', message: message })
      }
    }
  )

  const handleUpdateUser = (updatedUserData: Omit<ProfileFields, 'username'>) => {
    const updateUserBody: UpdateUserRequestBody = {
      display_name: updatedUserData.name,
      email: updatedUserData.email
    }
    updateUserMutation.mutate({
      body: updateUserBody
    })
  }

  const handleUpdatePassword = (updatedPasswordData: PasswordFields) => {
    if (updatedPasswordData.newPassword !== updatedPasswordData.confirmPassword) {
      setApiError({ type: 'password', message: 'Passwords do not match' })
      return
    }

    const updatePasswordBody: UpdateUserRequestBody = {
      password: updatedPasswordData.newPassword
    }
    updatePasswordMutation.mutate({
      body: updatePasswordBody
    })
  }

  return (
    <SandboxSettingsAccountGeneralPage
      userData={userData}
      isLoadingUser={isLoadingUser}
      isUpdatingUser={updateUserMutation.isLoading}
      isUpdatingPassword={updatePasswordMutation.isLoading}
      error={apiError}
      onUpdateUser={handleUpdateUser}
      onUpdatePassword={handleUpdatePassword}
      profileUpdateSuccess={updateUserMutation.isSuccess}
      passwordUpdateSuccess={updatePasswordMutation.isSuccess}
    />
  )
}
