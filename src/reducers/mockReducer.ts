import {
  MOCK_ACTION_ERROR,
  MOCK_ACTION_FETCH,
  MOCK_ACTION_SUCCESS,
  MockActionAction,
} from '@/actions/mockAction/mockAction';

const initialState = {
  mock: {},
};

export default function mockReducer(state = initialState, action: MockActionAction) {
  switch (action.type) {
    case MOCK_ACTION_FETCH:
      return { ...state };
    case MOCK_ACTION_SUCCESS:
      return { ...state, mock: action.payload };
    case MOCK_ACTION_ERROR:
      return {
        ...state,
        success: false,
        error: action.errorMessage,
      };
    default:
      return { ...state };
  }
}
