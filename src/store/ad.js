import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAdminBanners } from '../utils/apis';

export const getAD = createAsyncThunk("ads/getAD", async(_,{dispatch}) =>{
    const result = await getAdminBanners(dispatch).catch(err=> {return []});
    const payload = result?.data;
    return payload;
})


// Slice
export const adSlice = createSlice({
    name: 'ads',
    initialState: {
        adList:[],
    },
    extraReducers:(builder)=>{
        // 고ㅏㅇ고  받기
        builder.addCase(getAD.fulfilled,(state, action)=>{
            state.adList = action.payload;
        })
    }
});

