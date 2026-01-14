import { ApolloClient, createHttpLink, InMemoryCache, Observable } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

// 1. HTTP Connection
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
})

// 2. Auth Middleware
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('proteus_access_token')
    const tenantId = localStorage.getItem('proteus_tenant_id')

    const newHeaders = {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
    }

    if (tenantId) {
        newHeaders['x-tenant-id'] = tenantId
    }

    return {
        headers: newHeaders
    }
})

// 3. Error Link (Refresh Token Logic)
let isRefreshing = false
let pendingRequests = []

const resolvePendingRequests = () => {
    pendingRequests.map(callback => callback())
    pendingRequests = []
}

const errorLink = onError(({ response, operation, forward }) => {
    if (response && response.errors) {
        for (let err of response.errors) {
            if (err.extensions?.code === 'UNAUTHENTICATED') {

                if (operation.operationName === 'RefreshToken') {
                    handleLogout()
                    return
                }

                if (!isRefreshing) {
                    isRefreshing = true

                    return new Observable(observer => {
                        refreshToken()
                            .then((success) => {
                                if (success) {
                                    resolvePendingRequests()
                                    observer.next(true)
                                    observer.complete()
                                } else {
                                    handleLogout()
                                    observer.next(false)
                                    observer.complete()
                                }
                            })
                            .catch((error) => {
                                handleLogout()
                                observer.error(error)
                            })
                            .finally(() => {
                                isRefreshing = false
                            })
                    }).flatMap((success) => {
                        if (success) {
                            const oldHeaders = operation.getContext().headers
                            const newToken = localStorage.getItem('proteus_access_token')

                            operation.setContext({
                                headers: {
                                    ...oldHeaders,
                                    authorization: `Bearer ${newToken}`,
                                },
                            })

                            return forward(operation)
                        }
                    })
                } else {
                    // Queue pending requests while refreshing
                    return new Observable(observer => {
                        pendingRequests.push(() => {
                            const oldHeaders = operation.getContext().headers
                            const newToken = localStorage.getItem('proteus_access_token')
                            operation.setContext({
                                headers: {
                                    ...oldHeaders,
                                    authorization: `Bearer ${newToken}`,
                                },
                            })
                            observer.next()
                            observer.complete()
                        })
                    }).flatMap(() => {
                        return forward(operation)
                    })
                }
            }
        }
    }
})

async function refreshToken() {
    const refreshToken = localStorage.getItem('proteus_refresh_token')
    if (!refreshToken) return false

    try {
        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    mutation RefreshToken($token: String!) {
                        auth {
                            refreshToken(refreshToken: $token) {
                                accessToken
                                refreshToken
                            }
                        }
                    }
                `,
                variables: { token: refreshToken }
            })
        })

        const { data, errors } = await response.json()

        if (errors || !data?.auth?.refreshToken) {
            return false
        }

        const tokens = data.auth.refreshToken

        localStorage.setItem('proteus_access_token', tokens.accessToken)
        localStorage.setItem('proteus_refresh_token', tokens.refreshToken)

        const authStore = useAuthStore()
        if (authStore) authStore.token = tokens.accessToken

        return true
    } catch (e) {
        console.error('Refresh token error:', e)
        return false
    }
}

function handleLogout() {
    localStorage.removeItem('proteus_access_token')
    localStorage.removeItem('proteus_refresh_token')
    localStorage.removeItem('proteus_tenant_id')
    localStorage.removeItem('proteus_mfa_enabled')

    const authStore = useAuthStore()
    if (authStore) {
        authStore.user = null
        authStore.token = null
    }

    router.push('/login')
}

export const apolloClient = new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
    },
})