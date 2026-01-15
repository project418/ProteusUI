const STORAGE_KEYS = {
	ACCESS_TOKEN: 'proteus_access_token',
	REFRESH_TOKEN: 'proteus_refresh_token',
	TENANT_ID: 'proteus_tenant_id',
	MFA_ENABLED: 'proteus_mfa_enabled',
	CURRENT_TENANT: 'proteus_current_tenant',
	AVAILABLE_TENANTS: 'proteus_available_tenants',
	THEME: 'theme',
	LANG: 'lang',
}

export const AuthStorage = {
	// --- Getters ---
	getToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
	getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
	getTenantId: () => localStorage.getItem(STORAGE_KEYS.TENANT_ID),
	getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME),
	getLang: () => localStorage.getItem(STORAGE_KEYS.LANG),

	getMfaEnabled: () => localStorage.getItem(STORAGE_KEYS.MFA_ENABLED) === 'true',

	getCurrentTenant: () => {
		const val = localStorage.getItem(STORAGE_KEYS.CURRENT_TENANT)
		return val ? JSON.parse(val) : null
	},

	getAvailableTenants: () => {
		const val = localStorage.getItem(STORAGE_KEYS.AVAILABLE_TENANTS)
		return val ? JSON.parse(val) : []
	},

	// --- Setters ---
	setToken: (token) => localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
	setRefreshToken: (token) => localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
	setTenantId: (id) => localStorage.setItem(STORAGE_KEYS.TENANT_ID, id),
	setMfaEnabled: (status) => localStorage.setItem(STORAGE_KEYS.MFA_ENABLED, status),

	setCurrentTenant: (tenant) => localStorage.setItem(STORAGE_KEYS.CURRENT_TENANT, JSON.stringify(tenant)),
	setAvailableTenants: (tenants) => localStorage.setItem(STORAGE_KEYS.AVAILABLE_TENANTS, JSON.stringify(tenants)),

	// --- Clear / Reset ---
	clearSession: () => {
		// We intentionally keep THEME and LANG settings
		localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
		localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
		localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
		localStorage.removeItem(STORAGE_KEYS.MFA_ENABLED)
		localStorage.removeItem(STORAGE_KEYS.CURRENT_TENANT)
		localStorage.removeItem(STORAGE_KEYS.AVAILABLE_TENANTS)
	}
}