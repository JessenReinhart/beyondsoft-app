import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type LocResponseType = {
  attributes: {
    longitude: number;
    latitude: number;
    long_name: string;
  };
};

export interface LocationState {
  latitude: number;
  longitude: number;
  isLoading: boolean;
  options: { label: string; value: string }[];
}

//defaulting to greenwich
const initialState: LocationState = {
  latitude: 51.4825766,
  longitude: -0.0076589,
  isLoading: false,
  options: [],
};

const API_KEY = "7db03d63d37628978d0f93d542b81303";
const SECRET_KEY = "a83de4d87f3889a7b2c7c288b5333dfa";
const LOC_URL = "https://api.roadgoat.com/api/v2/destinations";

export const searchLocation = createAsyncThunk(
  "map/fetchOptions",
  async (query: string) => {
    const res = await fetch(LOC_URL + "/auto_complete?q=" + query, {
      headers: {
        Authorization: "Basic " + btoa(API_KEY + ":" + SECRET_KEY),
      },
    });
    const { data } = await res.json();

    return { data };
  }
);

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setLocation: (state, { payload }) => {
      state.latitude = payload.latitude;
      state.longitude = payload.longitude;
    },
    clearMap: (state) => {
      state.latitude = initialState.latitude;
      state.longitude = initialState.longitude;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchLocation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(searchLocation.fulfilled, (state, action) => {
      const { data } = action.payload;

      state.isLoading = false;
      state.options = data.map((item: LocResponseType) => ({
        label: item.attributes.long_name,
        value: JSON.stringify({
          longitude: item.attributes.longitude,
          latitude: item.attributes.latitude,
          label: item.attributes.long_name,
        }),
      }));
    });
  },
});
export const { setLocation, clearMap } = mapSlice.actions;
export default mapSlice.reducer;
