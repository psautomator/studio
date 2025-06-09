import { useContext } from 'react';
// This is a re-export, actual context and hook are in language-provider.tsx
// to avoid circular dependencies with LanguageProvider using useLanguage itself potentially.
// However, the standard pattern is to define the hook alongside the provider.
// For simplicity, we will use the one defined in language-provider.tsx
export { useLanguage } from '@/contexts/language-provider';
