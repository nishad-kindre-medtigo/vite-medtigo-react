import UserAccessService from 'src/services/userAccessService';
export const GET_INSTITUTES = 'GET_INSTITUTES';

export function getInstitutes() {
  return async dispatch => {
    const useraccesses = await UserAccessService.getAllInstitutes();
    dispatch({
      type: GET_INSTITUTES,
      payload: useraccesses
    });
  };
}
