import { combineReducers } from '@reduxjs/toolkit';
import { userSlice } from './user/user_slice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export default rootReducer;
