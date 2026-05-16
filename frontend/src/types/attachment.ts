export interface Attachment {
  id: string;
  attachable_type: string;
  attachable_id: string;
  uploaded_by_id: string;
  filename: string;
  url: string;
  file_size?: number;
  content_type?: string;
  created_at: string;
  updated_at: string;
}
