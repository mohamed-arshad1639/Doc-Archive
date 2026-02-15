export interface DocXDocument {
  id?: number;
  name: string;
  type: 'image/jpeg' | 'image/png' | 'application/pdf' | string;
  size: number;
  blob: Blob; // The actual file content
  thumbnail?: string; // Data URL of the thumbnail
  createdAt: Date;
  isFavorite: boolean;
  pageCount?: number;
  // For double-sided or multi-page support in future
  pages?: Blob[];
  folderId?: number | null; // Null means root level
  isDeleted?: boolean;
}
