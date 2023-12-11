import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const addImageStorage = createAsyncThunk("cartView/setImageStorage", async(data) =>{
    return data;
})

// Slice
export const imageStorageSlice = createSlice({
    name: 'imageStorage',
    initialState: {
        images: [],
    },
    extraReducers:(builder)=>{
        // 메인 카테고리 받기
        builder.addCase(addImageStorage.fulfilled,(state, action)=>{
            let currentImages = Object.assign([],state.images);
            currentImages.push(action.payload)
            state.images = currentImages;
        })
        
    }
});

