import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chosenColor: {
    h: 0,
    s: 0,
    v: 0,
  },
  colorOptions: [
    {
      h: Math.floor(Math.random() * 360),
      s: 80,
      v: 80,
    },
    {
      h: Math.floor(Math.random() * 360),
      s: 80,
      v: 80,
    },
    {
      h: Math.floor(Math.random() * 360),
      s: 80,
      v: 80,
    },
  ],
  isColorChosen: false,
};

export const colorSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {
    chooseColor: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.chosenColor = action.payload;
      state.isColorChosen = true;
    },
    getOptions: (state) => {
      let colors = [
        {
          h: Math.floor(Math.random() * 360),
          s: 80,
          v: 80,
        },
        {
          h: Math.floor(Math.random() * 360),
          s: 80,
          v: 80,
        },
        {
          h: Math.floor(Math.random() * 360),
          s: 80,
          v: 80,
        },
      ];
      state.colorOptions = colors;
      state.isColorChosen = false;
    },
    reset: (state) => {
      state = initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { chooseColor, getOptions, reset } = colorSlice.actions;

export default colorSlice.reducer;
