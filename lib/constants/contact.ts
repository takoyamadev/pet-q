export const CONTACT_SUBJECTS = [
  { value: "general", label: "一般的なお問い合わせ" },
  { value: "bug", label: "不具合・バグの報告" },
  { value: "feature", label: "機能改善の要望" },
  { value: "abuse", label: "不適切な投稿の報告" },
  { value: "other", label: "その他" },
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number]["value"];
