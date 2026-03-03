
export enum View {
  SCANNER = 'SCANNER',
  GENERATOR = 'GENERATOR',
  HISTORY = 'HISTORY',
  FAVORITES = 'FAVORITES',
  SETTINGS = 'SETTINGS',
  SHOPPING = 'SHOPPING',
  RESULT_DETAILS = 'RESULT_DETAILS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
}

export enum QRType {
  URL = 'URL',
  WIFI = 'WIFI',
  TEXT = 'TEXT',
  CONTACT = 'CONTACT',
  WHATSAPP = 'WHATSAPP'
}

export enum SearchEngine {
  GOOGLE = 'Google',
  BING = 'Bing',
  DUCKDUCKGO = 'DuckDuckGo'
}

export enum Language {
  EN = 'English',
  BN = 'Bengali',
  JP = 'Japanese',
  KR = 'Korean',
  RU = 'Russian'
}

export interface ScanResult {
  id: string;
  data: string;
  timestamp: number;
  type: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

export interface QRConfig {
  type: QRType;
  value: string;
  color: string;
  logoUrl?: string;
  frameStyle: string;
}
