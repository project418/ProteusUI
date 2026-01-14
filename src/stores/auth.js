import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '@/plugins/apollo'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

// --- GraphQL Mutasyonları ve Sorguları ---

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    auth {
      login(email: $email, password: $password) {
        accessToken
        refreshToken
        requiresMfa
        mfaEnforced
        mfaEnabled
        permissions
        user {
          id
          email
          firstName
          lastName
          title
          phone
          countryCode
          timezone
          language
          avatar
        }
        tenant {
          id
          name
        }
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
    auth {
      register(email: $email, password: $password) {
        accessToken
        refreshToken
        user {
          id
          email
        }
      }
    }
  }
`

const UPDATE_ME_MUTATION = gql`
  mutation UpdateMe($input: UpdateUserInput!) {
    auth {
      updateMe(input: $input) {
        id
          email
          firstName
          lastName
          title
          phone
          countryCode
          timezone
          language
          avatar
      }
    }
  }
`

const VERIFY_MFA_MUTATION = gql`
  mutation VerifyMfa($totp: String!) {
    auth {
      verifyMfa(totp: $totp) {
        verified
        accessToken
        refreshToken
      }
    }
  }
`

const CREATE_TOTP_DEVICE_MUTATION = gql`
  mutation CreateTotpDevice($deviceName: String!) {
    auth {
      createTotpDevice(deviceName: $deviceName) {
        deviceName
        secret
        qrCode
      }
    }
  }
`

const VERIFY_TOTP_DEVICE_MUTATION = gql`
  mutation VerifyTotpDevice($deviceName: String!, $totp: String!) {
    auth {
      verifyTotpDevice(deviceName: $deviceName, totp: $totp) {
        verified
        accessToken
        refreshToken
      }
    }
  }
`

const REMOVE_TOTP_DEVICE_MUTATION = gql`
  mutation RemoveTotpDevice($deviceName: String!) {
    auth {
      removeTotpDevice(deviceName: $deviceName)
    }
  }
`

const LIST_TOTP_DEVICES_QUERY = gql`
  query ListTotpDevices {
    auth {
      listTotpDevices {
        name
        verified
      }
    }
  }
`

const ME_QUERY = gql`
  query Me {
    auth {
      me {
        id
        email
        firstName
        lastName
        title
        phone
        countryCode
        timezone
        language
        avatar
      }
      myPermissions
    }
  }
`

const LOGOUT_MUTATION = gql`
  mutation Logout {
    auth {
      logout
    }
  }
`

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToastStore()

  // --- State ---
  const user = ref(null)
  const token = ref(localStorage.getItem('proteus_access_token') || null)
  const tenantId = ref(localStorage.getItem('proteus_tenant_id') || null)
  const permissions = ref(null)

  const isMfaRequired = ref(false)
  const isMfaVerified = ref(false)

  const hasMfaEnabledState = ref(localStorage.getItem('proteus_mfa_enabled') === 'true')
  const totpDevices = ref([])

  // --- Getters ---
  const isAuthenticated = computed(() => !!token.value && (!isMfaRequired.value || isMfaVerified.value))

  const hasMfaEnabled = computed(() => hasMfaEnabledState.value)

  // --- Actions ---
  async function login(email, password) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password }
      })

      const result = data.auth.login

      setSession(result.accessToken, result.refreshToken, result.tenant?.id)

      hasMfaEnabledState.value = result.mfaEnabled
      localStorage.setItem('proteus_mfa_enabled', result.mfaEnabled)

      user.value = result.user
      permissions.value = result.permissions

      if (result.requiresMfa) {
        isMfaRequired.value = true
        isMfaVerified.value = false

        if (result.mfaEnabled) {
          toast.add('Lütfen 2. aşama doğrulama kodunu giriniz.', 'warning')
          return { success: true, status: 'MFA_VERIFY' }
        } else {
          toast.add('Güvenlik gereği 2FA kurulumu yapmanız gerekmektedir.', 'info')
          return { success: true, status: 'MFA_SETUP' }
        }
      }

      isMfaVerified.value = true
      if (hasMfaEnabledState.value) {
        fetchTotpDevices()
      }

      toast.add('Giriş başarılı, yönlendiriliyorsunuz...', 'success')
      return { success: true, status: 'SUCCESS' }

    } catch (error) {
      console.error('Login error:', error)
      toast.add(error.message || 'Giriş başarısız.', 'error')
      return { success: false, error: error.message }
    }
  }

  async function register(email, password) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: { email, password }
      })

      const result = data.auth.register

      setSession(result.accessToken, result.refreshToken, null)
      user.value = result.user
      isMfaVerified.value = true

      toast.add('Hesap oluşturuldu, hoş geldiniz!', 'success')
      return { success: true }

    } catch (error) {
      toast.add(error.message || 'Kayıt işlemi başarısız.', 'error')
      return { success: false, error: error.message }
    }
  }

  async function updateProfile(input, notify = true) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ME_MUTATION,
        variables: { input }
      })

      const updatedUser = data.auth.updateMe

      user.value = { ...user.value, ...updatedUser }

      if (notify) {
        toast.add('Profil bilgileri başarıyla güncellendi.', 'success')
      }

      return true
    } catch (error) {
      console.error('Update profile error:', error)
      toast.add(error.message || 'Güncelleme başarısız.', 'error')
      return false
    }
  }

  async function verifyMfa(code) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: VERIFY_MFA_MUTATION,
        variables: { totp: code }
      })

      const result = data.auth.verifyMfa

      if (result.verified) {
        if (result.accessToken) {
          setSession(result.accessToken, result.refreshToken, tenantId.value)
        }

        isMfaVerified.value = true
        isMfaRequired.value = false

        fetchTotpDevices()

        toast.add('Doğrulama başarılı.', 'success')
        return true
      }
      return false

    } catch (error) {
      console.error('Verify MFA error:', error)
      toast.add('Hatalı doğrulama kodu.', 'error')
      return false
    }
  }

  // 4. Yeni MFA Cihazı Kurulumunu Başlat
  async function createTotpDevice(deviceName = 'ProteusApp') {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_TOTP_DEVICE_MUTATION,
        variables: { deviceName }
      })

      fetchTotpDevices()

      return { success: true, ...data.auth.createTotpDevice }
    } catch (error) {
      toast.add(error.message || 'MFA kurulumu başlatılamadı.', 'error')
      return { success: false }
    }
  }

  // 5. MFA Cihazını Doğrula ve Kurulumu Tamamla
  async function verifyTotpDevice(deviceName, code) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: VERIFY_TOTP_DEVICE_MUTATION,
        variables: { deviceName, totp: code }
      })

      const result = data.auth.verifyTotpDevice
      if (result.verified) {
        if (result.accessToken) {
          setSession(result.accessToken, result.refreshToken, tenantId.value)
        }

        hasMfaEnabledState.value = true
        localStorage.setItem('proteus_mfa_enabled', 'true')

        isMfaVerified.value = true
        isMfaRequired.value = false

        await fetchTotpDevices()
        toast.add('2FA kurulumu başarıyla tamamlandı.', 'success')
        return true
      }
      return false
    } catch (error) {
      console.error('Verify TOTP Device error:', error)
      toast.add(error.message || 'Doğrulama hatası.', 'error')
      return false
    }
  }

  // 6. MFA Cihazını Kaldır
  async function removeTotpDevice(deviceName) {
    try {
      await apolloClient.mutate({
        mutation: REMOVE_TOTP_DEVICE_MUTATION,
        variables: { deviceName }
      })

      toast.add(`${deviceName} başarıyla kaldırıldı.`, 'info')
      await fetchTotpDevices()

      if (totpDevices.value.filter(d => d.verified).length === 0) {
        hasMfaEnabledState.value = false
        localStorage.setItem('proteus_mfa_enabled', 'false')
      }

      return true
    } catch (error) {
      console.error('Remove TOTP Device error:', error)
      toast.add('Kaldırma işlemi başarısız.', 'error')
      return false
    }
  }

  // 7. Kayıtlı MFA Cihazlarını Listele
  async function fetchTotpDevices() {
    if (!token.value) return

    try {
      const { data } = await apolloClient.query({
        query: LIST_TOTP_DEVICES_QUERY,
        fetchPolicy: 'network-only'
      })
      if (data.auth && data.auth.listTotpDevices) {
        totpDevices.value = data.auth.listTotpDevices
      }
    } catch (error) {
      console.error('MFA cihazları çekilemedi:', error)
    }
  }

  // 8. Oturumu Başlat
  async function initAuth() {
    if (!token.value) return

    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only'
      })

      if (data.auth && data.auth.me) {
        user.value = data.auth.me
        permissions.value = data.auth.myPermissions
        isMfaVerified.value = true

        if (hasMfaEnabledState.value) {
          fetchTotpDevices()
        }
      }

    } catch {
      logout()
    }
  }

  // 9. Çıkış Yap
  async function logout() {
    try {
      if (token.value) await apolloClient.mutate({ mutation: LOGOUT_MUTATION })
    } catch (error) { console.warn('Logout hatası', error) }
    finally {
      user.value = null
      token.value = null
      tenantId.value = null
      permissions.value = null
      isMfaRequired.value = false
      isMfaVerified.value = false
      totpDevices.value = []
      hasMfaEnabledState.value = false

      localStorage.removeItem('proteus_access_token')
      localStorage.removeItem('proteus_refresh_token')
      localStorage.removeItem('proteus_tenant_id')
      localStorage.removeItem('proteus_mfa_enabled')

      try {
        await apolloClient.resetStore()
      } catch {
        await apolloClient.clearStore()
      }
      router.push('/login')
      toast.add('Başarıyla çıkış yapıldı.', 'info')
    }
  }

  function setSession(accessToken, refreshToken, tId) {
    token.value = accessToken
    localStorage.setItem('proteus_access_token', accessToken)
    localStorage.setItem('proteus_refresh_token', refreshToken)

    if (tId) {
      tenantId.value = tId
      localStorage.setItem('proteus_tenant_id', tId)
    }
  }

  return {
    user,
    token,
    permissions,
    isMfaRequired,
    isMfaVerified,
    totpDevices,
    isAuthenticated,
    hasMfaEnabled,
    login,
    register,
    updateProfile,
    verifyMfa,
    createTotpDevice,
    verifyTotpDevice,
    removeTotpDevice,
    fetchTotpDevices,
    logout,
    initAuth
  }
})