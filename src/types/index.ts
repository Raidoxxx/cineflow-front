export type MediaType = "PHOTO" | "VIDEO";
export type MediaStatus = "PROCESSING" | "READY" | "FAILED" | "EXPIRED";

export interface EventModel {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  eventDate: string;
  expiresAt: string;
  isPublic: boolean;
  isActive: boolean;
  defaultPhotoPrice: number;
  defaultVideoPrice: number;
}

export interface MediaAssetModel {
  id: string;
  eventId: string;
  type: MediaType;
  title: string;
  watermarkedPath?: string;
  thumbnailPath?: string;
  price: number;
  expiresAt?: string;
  status: MediaStatus;
  processingProgress?: number | null;
  mimeType: string;
  errorMessage?: string | null;
  createdAt: string;
}

export interface OrderModel {
  id: string;
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "REFUNDED";
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    id: string;
    mediaAssetId: string;
    price: number;
    mediaAsset: MediaAssetModel;
  }>;
  downloadLinks?: Array<{
    id: string;
    token: string;
    expiresAt: string;
  }>;
}
