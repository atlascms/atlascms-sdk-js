export interface ContentSeoFaq {
  question?: string | null;
  answer?: string | null;
}

export interface ContentSeoJsonld {
  type?: string | null;
  faq?: ContentSeoFaq[] | null;
  additionalData?: Record<string, unknown> | null;
}

export interface ContentSeoOpenGraph {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  type?: string | null;
}

export interface ContentSeoX {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  card?: string | null;
}

export interface ContentSeo {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  slug?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  openGraph?: ContentSeoOpenGraph | null;
  x?: ContentSeoX | null;
  structuredData?: ContentSeoJsonld | null;
}
