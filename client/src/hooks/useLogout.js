import { useAuthContext } from './useAuthContext';
import { usePicksContext } from './usePicksContexts';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: picksDispatch } = usePicksContext();

  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      dispatch({ type: 'LOGOUT' });
    } catch (err) {}
    picksDispatch({ type: 'SET_PICKS', payload: null });
  };

  return { logout };
};