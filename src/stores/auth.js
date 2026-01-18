import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '@/plugins/apollo'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { AuthStorage } from '@/utils/auth-storage'

// --- GRAPHQL MUTATIONS & QUERIES ---

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    auth {
      login(email: $email, password: $password) {
        accessToken
        refreshToken
        requiresMfa
        mfaEnforced
        mfaEnabled
        requiresPasswordChange
        permissions
        user {
          id
          email
          profile {
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
        tenant {
          id
          name
          createdAt
        }
        availableTenants {
          id
          name
        }
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    auth {
      register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
        accessToken
        refreshToken
        user {
          id
          email
          profile {
            firstName
            lastName
          }
        }
      }
    }
  }
`

const CREATE_TENANT_MUTATION = gql`
  mutation CreateOwnTenant($name: String!) {
    auth {
      createOwnTenant(name: $name) {
        id
        name
        createdAt
      }
    }
  }
`

const UPDATE_TENANT_MUTATION = gql`
  mutation UpdateTenant($name: String!) {
    auth {
      updateTenant(name: $name) {
        id
        name
        updatedAt
      }
    }
  }
`

const GET_TENANT_USERS_QUERY = gql`
  query TenantUsers($limit: Int, $paginationToken: String) {
    auth {
      tenantUsers(limit: $limit, paginationToken: $paginationToken) {
        users {
          id
          email
          timeJoined
          role
          profile {
            firstName
            lastName
            avatar
          }
        }
        nextPaginationToken
      }
    }
  }
`

const REMOVE_USER_MUTATION = gql`
  mutation RemoveUserFromTenant($userId: String!) {
    auth {
      removeUserFromTenant(userId: $userId)
    }
  }
`

const INVITE_USER_MUTATION = gql`
  mutation InviteUser($email: String!, $roleName: String!) {
    auth {
      inviteUser(email: $email, roleName: $roleName)
    }
  }
`

const ACCEPT_INVITE_MUTATION = gql`
  mutation AcceptInvite($token: String!) {
    auth {
      acceptInvite(token: $token)
    }
  }
`

const LIST_ROLES_QUERY = gql`
  query ListRoles {
    auth {
      listRoles {
        name
        permissions
      }
    }
  }
`

const SEND_PASSWORD_RESET_EMAIL_MUTATION = gql`
  mutation SendPasswordResetEmail($email: String!) {
    auth {
      sendPasswordResetEmail(email: $email)
    }
  }
`

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    auth {
      resetPassword(token: $token, password: $password)
    }
  }
`

const UPDATE_ME_MUTATION = gql`
  mutation UpdateMe($input: UpdateUserInput!) {
    auth {
      updateMe(input: $input) {
        user {
          id
          email
          profile {
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
        accessToken
        refreshToken
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
        profile {
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
      myPermissions
      myTenants {
        id
        name
        createdAt
      }
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

const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($roleName: String!, $permissions: [String]!) {
    auth {
      createRole(roleName: $roleName, permissions: $permissions)
    }
  }
`

const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($roleName: String!, $permissions: [String]!) {
    auth {
      updateRole(roleName: $roleName, permissions: $permissions)
    }
  }
`

const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($roleName: String!) {
    auth {
      deleteRole(roleName: $roleName)
    }
  }
`

const ASSIGN_ROLE_MUTATION = gql`
  mutation AssignRole($userId: String!, $roleName: String!) {
    auth {
      assignRole(userId: $userId, roleName: $roleName)
    }
  }
`

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToastStore()

  // --- STATE ---
  const user = ref(null)
  const token = ref(AuthStorage.getToken() || null)

  // Tenant State
  const tenantId = ref(AuthStorage.getTenantId() || null)
  const currentTenant = ref(AuthStorage.getCurrentTenant() || null)
  const availableTenants = ref(AuthStorage.getAvailableTenants() || [])
  const roles = ref([])

  // Permissions & MFA State
  const requiresPasswordChange = ref(false)
  const permissions = ref(null)
  const isMfaRequired = ref(false)
  const isMfaVerified = ref(false)
  const hasMfaEnabledState = ref(AuthStorage.getMfaEnabled())
  const totpDevices = ref([])

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value && (!isMfaRequired.value || isMfaVerified.value))
  const hasMfaEnabled = computed(() => hasMfaEnabledState.value)
  const hasTenant = computed(() => !!tenantId.value)

  // --- ACTIONS ---

  // 1. Authentication
  async function login(email, password) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password }
      })

      const result = data.auth.login

      // Store tokens and tenant info in AuthStorage
      setSession(result.accessToken, result.refreshToken, null)

      hasMfaEnabledState.value = result.mfaEnabled
      AuthStorage.setMfaEnabled(result.mfaEnabled)

      user.value = result.user
      requiresPasswordChange.value = result.requiresPasswordChange || false
      permissions.value = result.permissions

      // Tenant Management
      availableTenants.value = result.availableTenants || []
      AuthStorage.setAvailableTenants(availableTenants.value)

      if (result.tenant) {
        setActiveTenant(result.tenant)
      } else if (availableTenants.value.length > 0) {
        setActiveTenant(availableTenants.value[0])
      } else {
        clearActiveTenant()
      }

      // MFA Handling
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

      if (requiresPasswordChange.value) {
        toast.add('Güvenliğiniz için şifrenizi değiştirmeniz gerekmektedir.', 'warning')
        return { success: true, status: 'PASSWORD_CHANGE_REQUIRED' }
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

  async function register(email, password, firstName, lastName) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: { email, password, firstName, lastName }
      })

      const result = data.auth.register

      setSession(result.accessToken, result.refreshToken, null)
      user.value = result.user
      isMfaVerified.value = true

      availableTenants.value = []
      clearActiveTenant()

      toast.add('Hesap oluşturuldu, hoş geldiniz!', 'success')
      return { success: true }

    } catch (error) {
      toast.add(error.message || 'Kayıt işlemi başarısız.', 'error')
      return { success: false, error: error.message }
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await apolloClient.mutate({ mutation: LOGOUT_MUTATION })
      }
    } catch (error) {
      console.warn('Logout error', error)
    } finally {
      user.value = null
      token.value = null

      clearActiveTenant()
      availableTenants.value = []

      tenantId.value = null
      permissions.value = null
      isMfaRequired.value = false
      isMfaVerified.value = false
      totpDevices.value = []
      hasMfaEnabledState.value = false

      AuthStorage.clearSession()

      try {
        await apolloClient.resetStore()
      } catch {
        await apolloClient.clearStore()
      }

      router.push('/login')
      toast.add('Başarıyla çıkış yapıldı.', 'info')
    }
  }

  // 2. Tenant Management
  async function createTenant(name) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_TENANT_MUTATION,
        variables: { name }
      })

      const newTenant = data.auth.createOwnTenant

      availableTenants.value = [...availableTenants.value, newTenant]
      await switchTenant(newTenant.id)

      toast.add('Çalışma alanı başarıyla oluşturuldu.', 'success')
      return { success: true, tenant: newTenant }
    } catch (error) {
      console.error('Create tenant error:', error)
      toast.add(error.message || 'Çalışma alanı oluşturulamadı.', 'error')
      return { success: false, error: error.message }
    }
  }

  async function updateTenant(name) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_TENANT_MUTATION,
        variables: { name }
      })

      const updated = data.auth.updateTenant

      if (currentTenant.value && currentTenant.value.id === updated.id) {
        currentTenant.value.name = updated.name
        AuthStorage.setCurrentTenant(currentTenant.value)
      }

      const idx = availableTenants.value.findIndex(t => t.id === updated.id)
      if (idx !== -1) {
        availableTenants.value[idx].name = updated.name
        AuthStorage.setAvailableTenants(availableTenants.value)
      }

      toast.add('Organizasyon bilgileri güncellendi.', 'success')
      return true
    } catch (error) {
      console.error('Update tenant error:', error)
      toast.add(error.message || 'Güncelleme başarısız.', 'error')
      return false
    }
  }

  async function switchTenant(newTenantId) {
    const targetTenant = availableTenants.value.find(t => t.id === newTenantId)

    if (targetTenant) {
      setActiveTenant(targetTenant)

      try {
        await apolloClient.resetStore()
      } catch {
        await apolloClient.clearStore()
      }

      window.location.href = '/'
      return true
    }
    return false
  }

  // 3. User & Role Management
  async function fetchTenantUsers(limit = 10, paginationToken = null) {
    try {
      const { data } = await apolloClient.query({
        query: GET_TENANT_USERS_QUERY,
        variables: { limit, paginationToken },
        fetchPolicy: 'network-only'
      })
      return data.auth.tenantUsers
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.add('Kullanıcı listesi alınamadı.', 'error')
      return { users: [], nextPaginationToken: null }
    }
  }

  async function removeUserFromTenant(userId) {
    try {
      await apolloClient.mutate({
        mutation: REMOVE_USER_MUTATION,
        variables: { userId }
      })

      toast.add('Kullanıcı organizasyondan çıkarıldı.', 'success')
      return true
    } catch (error) {
      console.error('Remove user error:', error)
      toast.add(error.message || 'İşlem başarısız.', 'error')
      return false
    }
  }

  async function fetchRoles() {
    try {
      const { data } = await apolloClient.query({
        query: LIST_ROLES_QUERY,
        fetchPolicy: 'network-only'
      })

      roles.value = data.auth.listRoles || []
      return roles.value
    } catch (error) {
      console.error('Fetch roles error:', error)
      return []
    }
  }

  async function inviteUser(email, roleName) {
    try {
      await apolloClient.mutate({
        mutation: INVITE_USER_MUTATION,
        variables: { email, roleName }
      })

      toast.add(`${email} adresine davet gönderildi.`, 'success')
      return true
    } catch (error) {
      console.error('Invite user error:', error)
      toast.add(error.message || 'Davet gönderilemedi.', 'error')
      return false
    }
  }

  async function acceptInvite(token) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ACCEPT_INVITE_MUTATION,
        variables: { token }
      })

      if (data.auth.acceptInvite) {
        toast.add('Organizasyona başarıyla katıldınız.', 'success')

        await initAuth()
        return true
      }
      return false
    } catch (error) {
      console.error('Accept invite error:', error)
      toast.add(error.message || 'Davet kabul edilemedi.', 'error')
      return false
    }
  }

  async function createRole(roleName, permissions) {
    try {
      await apolloClient.mutate({
        mutation: CREATE_ROLE_MUTATION,
        variables: { roleName, permissions }
      })
      toast.add('Rol başarıyla oluşturuldu.', 'success')
      await fetchRoles()
      return true
    } catch (error) {
      toast.add(error.message || 'Rol oluşturulamadı.', 'error')
      return false
    }
  }

  async function updateRole(roleName, permissions) {
    try {
      await apolloClient.mutate({
        mutation: UPDATE_ROLE_MUTATION,
        variables: { roleName, permissions }
      })
      toast.add('Rol güncellendi.', 'success')
      await fetchRoles()
      return true
    } catch (error) {
      toast.add(error.message || 'Güncelleme başarısız.', 'error')
      return false
    }
  }

  async function deleteRole(roleName) {
    try {
      await apolloClient.mutate({
        mutation: DELETE_ROLE_MUTATION,
        variables: { roleName }
      })
      toast.add('Rol silindi.', 'success')
      roles.value = roles.value.filter(r => r.name !== roleName)
      return true
    } catch (error) {
      toast.add(error.message || 'Silme başarısız.', 'error')
      return false
    }
  }

  async function assignRole(userId, roleName) {
    try {
      await apolloClient.mutate({
        mutation: ASSIGN_ROLE_MUTATION,
        variables: { userId, roleName }
      })

      toast.add('Kullanıcı rolü güncellendi.', 'success')
      return true
    } catch (error) {
      console.error('Assign role error:', error)
      toast.add(error.message || 'Rol atama işlemi başarısız.', 'error')
      return false
    }
  }

  // 4. Password Management
  async function sendPasswordResetEmail(email) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: SEND_PASSWORD_RESET_EMAIL_MUTATION,
        variables: { email }
      })

      if (data.auth.sendPasswordResetEmail) {
        toast.add('Sıfırlama bağlantısı e-posta adresinize gönderildi.', 'success')
        return true
      }
      return false
    } catch (error) {
      console.error('Password reset error:', error)
      toast.add(error.message || 'İşlem başarısız.', 'error')
      return false
    }
  }

  async function resetPassword(token, password) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables: { token, password }
      })

      if (data.auth.resetPassword) {
        toast.add('Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.', 'success')
        return true
      }
      return false
    } catch (error) {
      console.error('Reset password error:', error)
      toast.add(error.message || 'Şifre sıfırlama başarısız.', 'error')
      return false
    }
  }

  // 5. Profile & MFA
  async function updateProfile(input, notify = true) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ME_MUTATION,
        variables: { input }
      })

      const result = data.auth.updateMe

      user.value = { ...user.value, ...result.user }

      if (result.accessToken && result.refreshToken) {
        setSession(result.accessToken, result.refreshToken, tenantId.value)
        requiresPasswordChange.value = false
      }

      if (input.password) {
        requiresPasswordChange.value = false
      }

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

        if (requiresPasswordChange.value) {
          toast.add('Güvenliğiniz için şifrenizi değiştirmeniz gerekmektedir.', 'warning')
          return { success: true, status: 'PASSWORD_CHANGE_REQUIRED' }
        }

        toast.add('Doğrulama başarılı.', 'success')
        return { success: true, status: 'SUCCESS' }
      }
      return { success: false, error: 'Doğrulama başarısız' }
    } catch (error) {
      console.error('Verify MFA error:', error)
      toast.add('Hatalı doğrulama kodu.', 'error')
      return { success: false, error: error.message }
    }
  }

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
        AuthStorage.setMfaEnabled(true)

        isMfaVerified.value = true
        isMfaRequired.value = false

        await fetchTotpDevices()

        if (requiresPasswordChange.value) {
          toast.add('Güvenliğiniz için şifrenizi değiştirmeniz gerekmektedir.', 'warning')
          return { success: true, status: 'PASSWORD_CHANGE_REQUIRED' }
        }

        toast.add('2FA kurulumu başarıyla tamamlandı.', 'success')
        return { success: true, status: 'SUCCESS' }
      }
      return { success: false, error: 'Doğrulama başarısız' }
    } catch (error) {
      console.error('Verify TOTP Device error:', error)
      toast.add(error.message || 'Doğrulama hatası.', 'error')
      return { success: false, error: error.message }
    }
  }

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
        AuthStorage.setMfaEnabled(false)
      }
      return true
    } catch (error) {
      console.error('Remove TOTP Device error:', error)
      toast.add('Kaldırma işlemi başarısız.', 'error')
      return false
    }
  }

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
      console.error('Failed to fetch MFA devices:', error)
    }
  }

  async function initAuth() {
    if (!token.value) return

    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only'
      })

      if (data.auth) {
        if (data.auth.me) {
          user.value = data.auth.me
        }

        permissions.value = data.auth.myPermissions

        if (data.auth.myTenants) {
          availableTenants.value = data.auth.myTenants
          AuthStorage.setAvailableTenants(availableTenants.value)

          if (!currentTenant.value && availableTenants.value.length > 0) {
            setActiveTenant(availableTenants.value[0])
          }
        }

        isMfaVerified.value = true

        if (hasMfaEnabledState.value) {
          fetchTotpDevices()
        }
      }

    } catch (error) {
      console.error("Init Auth Error", error);
      logout()
    }
  }

  // --- HELPERS ---

  function setSession(accessToken, refreshToken, tId) {
    token.value = accessToken
    AuthStorage.setToken(accessToken)
    AuthStorage.setRefreshToken(refreshToken)

    if (tId) {
      tenantId.value = tId
      AuthStorage.setTenantId(tId)
    }
  }

  function setActiveTenant(tenant) {
    currentTenant.value = tenant
    tenantId.value = tenant.id
    AuthStorage.setTenantId(tenant.id)
    AuthStorage.setCurrentTenant(tenant)
  }

  function clearActiveTenant() {
    currentTenant.value = null
    tenantId.value = null
    localStorage.removeItem('proteus_tenant_id')
    localStorage.removeItem('proteus_current_tenant')
  }

  return {
    // State
    user,
    token,
    tenantId,
    currentTenant,
    availableTenants,
    roles,
    requiresPasswordChange,
    permissions,
    isMfaRequired,
    isMfaVerified,
    totpDevices,

    // Getters
    isAuthenticated,
    hasMfaEnabled,
    hasTenant,

    // Actions
    login,
    register,
    createTenant,
    updateTenant,
    switchTenant,

    // User & Roles
    fetchTenantUsers,
    removeUserFromTenant,
    fetchRoles,
    inviteUser,
    acceptInvite,
    createRole,
    updateRole,
    deleteRole,
    assignRole,

    // Profile & Security
    sendPasswordResetEmail,
    resetPassword,
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