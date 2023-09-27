// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // Define an initial state
// const initialState = {
//     data: [],
//     status: 'idle',
//     error: '',
// };

// // Define an async thunk to fetch the data
// export const fetchData = createAsyncThunk('data/fetchData', async () => {
//     try {
//         const response = await fetch('/api/requests'); // Assuming you set up an API route for this
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         throw error;
//     }
// });

// // Create a data slice
// const dataSlice = createSlice({
//     name: 'data',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchData.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchData.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//                 state.data = action.payload;
//             })
//             .addCase(fetchData.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = 'action.error.message';
//             });
//     },
// });

// export default dataSlice.reducer;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/* Instruments */
const URL = process.env.NEXT_PUBLIC_VENDOR_API;
export const newRegistrationSlice = createApi({
    reducerPath: 'vendorRequestApi',
    refetchOnFocus: true,
    baseQuery: fetchBaseQuery({
        baseUrl: URL,
    }),
    endpoints: () => ({}),
});
