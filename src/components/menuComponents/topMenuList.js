import React, { useState, useEffect, useCallback } from 'react'
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { CategoryDefault, CategorySelected, TopMenuText } from '../../styles/main/topMenuStyle';
import { colorBrown, tabBaseColor } from '../../assets/colors/color';
import { RADIUS_DOUBLE } from '../../styles/values';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSubCategory } from '../../store/categories';
import { useFocusEffect } from '@react-navigation/native';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';


const TopMenuList = (props) => {
    const dispatch = useDispatch();
    const data = props.data;
    const initSelect = props.initSelect;
    const {selectedMainCategory, selectedSubCategory, subCategories} = useSelector((state)=>state.categories);
    const [selectedCode, setSelectedCode] = useState(DEFAULT_CATEGORY_ALL_CODE);

    const {menuCategories} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    
    const ItemTitle = (cateCode) => {
        const subCategories = menuCategories?.filter(el=>el.cate_code1 == selectedMainCategory);
        const subCatList = subCategories[0]?.level2
        const subCatData = subCatList?.filter(el=>el.cate_code2 == cateCode);
        let selTitleLanguage = "";
        if(subCatData){
            if(language=="korean") {
                selTitleLanguage = subCatData[0]?.cate_name2
            }
            else if(language=="japanese") {
                selTitleLanguage = subCatData[0]?.cate_name2_jp||subCatData[0]?.cate_name2
            }
            else if(language=="chinese") {
                selTitleLanguage = subCatData[0]?.cate_name2_cn||subCatData[0]?.cate_name2
            }
            else if(language=="english") {
                selTitleLanguage = subCatData[0]?.cate_name2_en||subCatData[0]?.cate_name2
            }
        }
        return selTitleLanguage;
    }
    const ItemWhole = () =>{
        let selTitleLanguage = "";
        if(language=="korean") {
            selTitleLanguage = '전체'
        }
        else if(language=="japanese") {
            selTitleLanguage = "全体"
        }
        else if(language=="chinese") {
            selTitleLanguage = "全部的"
        }
        else if(language=="english") {
            selTitleLanguage = "ALL"
        }
        return selTitleLanguage; 
    }
    useEffect(()=>{
        if(selectedCode!=null) {
            props?.onSelectItem(selectedCode);
        }
    },[selectedCode])

    const onPressAction = (index) =>{
        setSelectedCode(index);
    }

    return (
        <>
        {selectedSubCategory == DEFAULT_CATEGORY_ALL_CODE &&
            <TouchableWithoutFeedback key={"subcat_"} onPress={()=>{}}>
                <CategorySelected>
                    <TopMenuText key={"subcatText_"} >{ItemWhole()}</TopMenuText>
                </CategorySelected>
            </TouchableWithoutFeedback>
        }
        {selectedSubCategory != DEFAULT_CATEGORY_ALL_CODE &&
            <TouchableWithoutFeedback key={"subcat_"} onPress={()=>{onPressAction(DEFAULT_CATEGORY_ALL_CODE);}}>
                <CategoryDefault>
                <TopMenuText key={"subcatText_"} >{ItemWhole()}</TopMenuText>
                </CategoryDefault>
            </TouchableWithoutFeedback>
        }
        {data &&
        data.map((el, index)=>{
            return(
                <>            
                        {
                        (el?.cate_code2==selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.cate_code2} onPress={()=>{ onPressAction(el?.cate_code2); }}>
                                <CategorySelected>
                                    <TopMenuText key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </CategorySelected>
                            </TouchableWithoutFeedback>
                        }
                        {
                        (el?.cate_code2!=selectedSubCategory) &&
                            <TouchableWithoutFeedback key={"subcat_"+el?.cate_code2} onPress={()=>{ onPressAction(el?.cate_code2); }}>
                                <CategoryDefault>
                                    <TopMenuText key={"subcatText_"+el?.cate_code2} >{ItemTitle(el?.cate_code2)}</TopMenuText>
                                </CategoryDefault>
                            </TouchableWithoutFeedback>
                        }
                        
                </>
            )
        })}
        </>
    )

/* 
    return (
        <>
        {data.map((el, index)=>{
            return(
                <>
                    <TouchableWithoutFeedback key={"subcat_"+index} onPress={()=>{onPressAction(index); }}>
                        <Animated.View key={"subcatAni_"+index}  style={[{   ...animatedColorArray[index]},{...boxStyleArray[index]}]} >
                            <TopMenuText key={"subcatText_"+index} >{el.title}</TopMenuText>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </>
            )
        })}
        </>
    )
     */
}

export default TopMenuList