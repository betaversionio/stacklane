import type { RouteObject } from 'react-router-dom';
import { KeychainPage } from '@/pages/keychain';

export const keychainRoutes: RouteObject[] = [
  {
    path: 'keychain',
    element: <KeychainPage />,
  },
];
