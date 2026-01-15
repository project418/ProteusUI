import { ApolloClient, createHttpLink, InMemoryCache, Observable } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { AuthStorage } from '@/utils/auth-storage'

// 1. HTTP Connection
const httpLink = createHttpLink({
	uri: 'http://localhost:4000/graphql',
})

// 2. Auth Middleware (Using AuthStorage)
const authLink = setContext((_, { headers }) => {
	const token = AuthStorage.getToken()
	const tenantId = AuthStorage.getTenantId()

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

// 3. Error Link & Refresh Logic
let isRefreshing = false
let pendingRequests = []

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	if (graphQLErrors) {
		for (let err of graphQLErrors) {
			// Check for unauthenticated error code
			if (err.extensions?.code === 'UNAUTHENTICATED') {

				// Prevent infinite loops if RefreshToken itself fails
				if (operation.operationName === 'RefreshToken') {
					handleLogout()
					return
				}

				if (!isRefreshing) {
					isRefreshing = true

					// Create an Observable to handle the refresh process
					return new Observable((observer) => {
						refreshToken()
							.then((success) => {
								if (success) {
									// Resolve all pending requests with the new token
									const newToken = AuthStorage.getToken()
									pendingRequests.forEach(callback => callback(newToken))
									pendingRequests = []
									observer.next(true)
									observer.complete()
								} else {
									// If refresh fails, logout and reject pending requests
									handleLogout()
									pendingRequests = []
									observer.next(false)
									observer.complete()
								}
							})
							.catch((error) => {
								handleLogout()
								pendingRequests = []
								observer.error(error)
							})
							.finally(() => {
								isRefreshing = false
							})
					}).flatMap((success) => {
						if (success) {
							// Retry the original failed request with the new token
							const oldHeaders = operation.getContext().headers
							operation.setContext({
								headers: {
									...oldHeaders,
									authorization: `Bearer ${AuthStorage.getToken()}`,
								},
							})
							return forward(operation)
						}
						// If refresh failed, complete without forwarding
						return new Observable(obs => obs.complete())
					})
				} else {
					// If already refreshing, queue this request
					return new Observable((observer) => {
						pendingRequests.push((newToken) => {
							const oldHeaders = operation.getContext().headers
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

// Helper: Refresh Token Logic
async function refreshToken() {
	const refreshToken = AuthStorage.getRefreshToken()
	if (!refreshToken) return false

	try {
		// Using fetch directly to bypass Apollo interceptors for this specific call
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

		// Update storage and store state
		AuthStorage.setToken(tokens.accessToken)
		AuthStorage.setRefreshToken(tokens.refreshToken)

		const authStore = useAuthStore()
		if (authStore) authStore.token = tokens.accessToken

		return true
	} catch (e) {
		console.error('Refresh token error:', e)
		return false
	}
}

// Helper: Logout Logic
function handleLogout() {
	AuthStorage.clearSession()

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