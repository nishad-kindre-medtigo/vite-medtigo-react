import { GET_INSTITUTES } from '../actions/institutes';

const initialState = {
  allInstitutes: []
};

const getAllInstitutes = (state = initialState, action) => {
  switch (action.type) {
    case GET_INSTITUTES: {
      return {
        ...state,
        allInstitutes: action.payload
      };
    }

    default: {
      return state;
    }
  }
};

export default getAllInstitutes;
