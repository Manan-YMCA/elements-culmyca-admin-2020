import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

import usePrevious from './usePrevious';

function useErrorSnackbar(error) {
  const { enqueueSnackbar } = useSnackbar();
  const previousErrorTimestamp = usePrevious(error ? error.timestamp : null);

  useEffect(() => {
    if (error && previousErrorTimestamp !== error.timestamp) {
      enqueueSnackbar(error.details, {
        variant: 'error',
        key: error.timestamp,
        preventDuplicate: true,
      });
    }
  }, [error, enqueueSnackbar, previousErrorTimestamp]);
}

export default useErrorSnackbar;
