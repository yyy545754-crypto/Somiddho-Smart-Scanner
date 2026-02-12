
export enum View {
  SCANNER = 'SCANNER',
  GENERATOR = 'GENERATOR',
  HISTORY = 'HISTORY',
  FAVORITES = 'FAVORITES',
  SETTINGS = 'SETTINGS',
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
