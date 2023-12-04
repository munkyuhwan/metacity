import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Animated, TouchableWithoutFeedback, View } from 'react-native';
import { colorRed, tabBaseColor } from '../../assets/colors/color';
import { SideMenuItemOff, SideMenuItemOn, SideMenuItemWrapper, SideMenuText } from '../../styles/main/sideMenuStyle';
import { useDispatch, useSelector } from 'react-redux';
import { getSubCategories, setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { useFocusEffect } from '@react-navigation/native';
import { SideMenuItemTouchableOff } from './sideMenuItem';
import {isEmpty} from 'lodash';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';
import { initMenuDetail } from '../../store/menuDetail';

const LeftMenuList = (props) => {
    const dispatch = useDispatch();
    const data = props?.data;
    const initSelect = props?.initSelect;
    const [selectIndex, setSelectedIndex] = useState(0);
    const {selectedMainCategory,mainCategories} = useSelector((state)=>state.categories);
    const {menuCategories} = useSelector(state=>state.menuExtra);
    const {language} =  useSelector(state=>state.languages);
    //console.log("menuCategories: ",menuCategories);
    // 이미지 찾기
    //const itemExtra = menuExtra.filter(el=>el.pos_code == item.ITEM_ID);

    const onPressAction = (index, groupCode) =>{
        setSelectedIndex(index);
        dispatch(initMenuDetail());
        props?.onSelectItem(groupCode);
    }
    const ItemTitle = (categoryID, index) => {
        let selTitleLanguage = "";
        const selExtra = menuCategories?.filter(el=>el.cate_code1==categoryID);
        
        if(language=="korean") {
            selTitleLanguage = data[index]?.PROD_L1_NM;
        }
        else if(language=="japanese") {
            selTitleLanguage = selExtra[0]?.cate_name1_jp || data[index]?.PROD_L1_NM;
        }
        else if(language=="chinese") {
            selTitleLanguage = selExtra[0]?.cate_name1_cn|| data[index]?.PROD_L1_NM;
        }
        else if(language=="english") {
            selTitleLanguage = selExtra[0]?.cate_name1_en|| data[index]?.PROD_L1_NM;
        }

        return selTitleLanguage;    
    }

    useEffect(()=>{
        if(!isEmpty(mainCategories)){
            if(mainCategories.length>0){
                if(!isEmpty(menuCategories)){
                    if(menuCategories.length>0){
                        dispatch(setSelectedMainCategory(mainCategories[0].PROD_L1_CD)); 
                        dispatch(setSelectedSubCategory(DEFAULT_CATEGORY_ALL_CODE));
                    }
                }
            }
        }
    },[mainCategories, menuCategories])
    //console.log("selectedMainCategory: ",selectedMainCategory);
     return(
        <>
            {data?.map((item, index)=>{     
                return(
                    <TouchableWithoutFeedback key={"leftItem_"+index} onPress={()=>{{ onPressAction(index,item?.PROD_L1_CD); }}}>
                        <SideMenuItemWrapper>
                            {item?.PROD_L1_CD==selectedMainCategory &&
                                <SideMenuItemOn>
                                    <SideMenuText>{ItemTitle(item?.PROD_L1_CD,index)||data[index]?.PROD_L1_NM }</SideMenuText>
                                </SideMenuItemOn>
                            }
                            {item?.PROD_L1_CD!=selectedMainCategory &&
                                <SideMenuItemOff>
                                    <SideMenuText>{ItemTitle(item?.PROD_L1_CD,index)||data[index]?.PROD_L1_NM}</SideMenuText>
                                </SideMenuItemOff>
                            }
                        </SideMenuItemWrapper>
                    </TouchableWithoutFeedback>
                )
            })}
        </>
    )
}
export default LeftMenuList;