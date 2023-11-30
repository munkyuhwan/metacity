import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';
import { MENU_DATA } from '../resources/menuData';
import axios from 'axios';
import { adminMenuEdit, posMenuEdit, posMenuState, posOrderNew } from '../utils/apis';
import { setMainCategories } from './categories';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initMenuExtra = createAsyncThunk("menu/initMenuExtra", async() =>{
    return [];
})
export const setMenuExtra = createAsyncThunk("menu/setMenuExtra", async(data) =>{
    return data;
})
export const setMenuCategories = createAsyncThunk("menu/setMenuCategories", async(data) =>{
    return data; 
})
export const setOptionExtra = createAsyncThunk("menu/setOptionExtra", async(data) =>{
    return data;
})

// Slice
export const menuExtraSlice = createSlice({
    name: 'menuExtra',
    initialState: {
        menuExtra: [],
        optionCategoryExtra:[],
        optionExtra:[],
        menuCategories:[],
    },
    extraReducers:(builder)=>{
        // 메뉴 기타 초기화 받기
        builder.addCase(initMenuExtra.fulfilled,(state, action)=>{
            state.menuExtra = action.payload;
        })
        // 메뉴 기타 세팅
        builder.addCase(setMenuExtra.fulfilled,(state, action)=>{
            state.menuExtra = action.payload;
        })
        // 옵션 기타 세팅
        builder.addCase(setOptionExtra.fulfilled,(state, action)=>{
            state.optionCategoryExtra = action.payload.option_category;
            state.optionExtra = action.payload.option;
        })
        // 메뉴 카테고리 세팅
        builder.addCase(setMenuCategories.fulfilled,(state, action)=>{
            state.menuCategories = action.payload;
        })


    }
});

