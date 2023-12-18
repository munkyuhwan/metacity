import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAdminBanners } from '../utils/apis';
import { adFileDownloader } from '../utils/common';

export const getAD = createAsyncThunk("ads/getAD", async(_,{dispatch}) =>{
    const result = await getAdminBanners(dispatch).catch(err=> {return []});
    const payload = result?.data;
    for(var i=0;i<payload.length;i++) {
        await adFileDownloader(dispatch, `${payload[i].img_chg}`,ADMIN_BANNER_DIR+payload[i].img_chg).catch("");
    }
    return payload;
})

export const setAdImgs = createAsyncThunk("ads/setAdImgs", async(data,{dispatch, getState}) =>{
    const {adImgs} = getState().ads;
    let prevImgs = Object.assign([],adImgs)
    prevImgs = prevImgs.filter(el=>el.name!=data.name);
    prevImgs.push(data); 
    return prevImgs;
})

// Slice
export const adSlice = createSlice({
    name: 'ads',
    initialState: {
        adList:[],
        adImgs:[],

    },
    extraReducers:(builder)=>{
        // 고ㅏㅇ고  받기
        builder.addCase(getAD.fulfilled,(state, action)=>{
            state.adList = action.payload;
        })
        builder.addCase(setAdImgs.fulfilled,(state, action)=>{
            state.adImgs = action.payload;
        })
    }
});

