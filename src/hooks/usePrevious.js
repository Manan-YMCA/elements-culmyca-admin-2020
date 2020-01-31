import { useEffect, useRef } from 'react';

/**
 * This hook can be used to persist any value across renders in a
 * functional component
 *
 * It works just like putting a value as a property on a React class.
 * Since, functions cannot have their own instance variables we need
 * to use this hook to persist any value (i.e. not state or props) across
 * multiple re-renders
 *
 * This is most commonly used to access prevState or prevProps values
 *
 * @param value
 */
function usePrevious(value){
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current || null;
}

export default usePrevious;
