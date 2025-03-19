
export type PopupType = 'welcome' | 'exit' | 'feedback' | 'social-proof' | 'offer';

export interface BasePopupProps {
  onAction: () => void;
  onClose?: () => void;
}
