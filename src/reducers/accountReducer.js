import { produce } from 'immer';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SILENT_LOGIN,
  UPDATE_PROFILE,
  UPDATE_DOCTORID, UPDATE_PICTURE, isNotification
} from 'src/actions/accountActions';

const initialState = {
  user: null,
  formPicture: null
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST: {
      return produce(state, (draft) => {
        // Ensure we clear current session
        draft.user = null;
      });
    }

    case LOGIN_SUCCESS: {
      const { user } = action.payload;
      return produce(state, (draft) => {
        draft.user = user;
      });
    }

    case isNotification: {
      const isNotify = action.payload;
      return produce(state, (draft) => {
        draft.isNotify = isNotify;
      });
    }

    case LOGIN_FAILURE: {
      return produce(state, () => {
        // Maybe store error
      });
    }

    case LOGOUT: {
      return produce(state, (draft) => {
        draft.user = null;
      });
    }

    case SILENT_LOGIN: {
      const { user } = action.payload;

      return produce(state, (draft) => {
        draft.user = user;
      });
    }

    case UPDATE_DOCTORID: {
      const { response } = action.payload;

      return produce(state, (draft) => {
        console.log(state, response, draft.user);
        draft.user.doctorId = '123';
      });
    }


    case UPDATE_PROFILE: {
      const { updatedUser } = action.payload;
      return produce(state, (draft) => {
        draft.user = updatedUser;
      });
    }

    case UPDATE_PICTURE: {
      return produce(state, (draft) => {
        draft.formPicture = action.payload;
      });
    }

    default: {
      return state;
    }
  }
};

export default accountReducer;
