export interface PageCategory {
	label?: string
	icon?: string
}

export interface PageItem {
	label: string
	description?: string
	icon: string
	to: string
}

export interface CategorizedPage extends PageCategory {
	to: string
	children: PageItem[]
}

export interface AppConfigWithPages {
	pageCategories?: Record<string, PageCategory>
}
