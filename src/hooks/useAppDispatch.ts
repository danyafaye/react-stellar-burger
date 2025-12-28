import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@services/store.ts';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
