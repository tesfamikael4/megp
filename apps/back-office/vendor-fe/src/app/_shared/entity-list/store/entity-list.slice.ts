import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface EntityListState {
  fullScreen: boolean;
}

const initialState: EntityListState = {
  fullScreen: false,
};

export const entityListSlice = createSlice({
  name: 'entityList',
  initialState,
  reducers: {
    toggleFullScreen: (state) => {
      state.fullScreen = !state.fullScreen;
    },
  },
});

export const { toggleFullScreen } = entityListSlice.actions;

export const selectFullScreen = (state: any) => state.entityList.fullScreen;

export const entityListReducer = entityListSlice.reducer;
