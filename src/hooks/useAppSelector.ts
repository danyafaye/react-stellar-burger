import { useSelector } from 'react-redux';

import type { RootState } from '@services/store.ts';

export const useAppSelector = useSelector.withTypes<RootState>();
