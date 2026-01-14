import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

// 1. HTTP Bağlantısı (Backend URL)
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql', // Backend portunuza göre güncelleyin
})

// 2. Auth Middleware (Her istekte çalışır)
const authLink = setContext((_, { headers }) => {
    // LocalStorage'dan token ve tenant bilgisini al
    const token = localStorage.getItem('proteus_access_token')
    const tenantId = localStorage.getItem('proteus_tenant_id')

    // Header'ları hazırla
    const newHeaders = {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
    }

    // Eğer tenant seçiliyse header'a ekle (Multi-tenancy için kritik)
    if (tenantId) {
        newHeaders['x-tenant-id'] = tenantId
    }

    return {
        headers: newHeaders
    }
})

// 3. Apollo Client Örneği
export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache', // Verilerin her zaman taze olması için (isteğe bağlı)
        },
    },
})