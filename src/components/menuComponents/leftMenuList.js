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
        if(groupCode) dispatch(setSelectedMainCategory(groupCode));
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
     return(
        <>
            {data?.map((item, index)=>{    
                if(item?.PROD_L1_NM=="주문X" || item?.PROD_L1_NM=="스넥" || item?.PROD_L1_NM == "포인트"  || item?.PROD_L1_NM == "선물(굿즈)"  || item?.PROD_L1_NM == "리뷰이벤트" || item?.PROD_L1_NM == "서비스" || item?.PROD_L1_NM == "배달"  || item?.PROD_L1_NM == "배 달"  || item?.PROD_L1_NM == "함박추가" || item?.PROD_L1_NM == "음료선택" ) {
                    return(<></>)
                }else {
                    if(item?.USE_YN == 'Y') { 
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
                    }else {
                        return(<></>)
                    }
                }
            })}
        </>
    )
}
export default LeftMenuList;