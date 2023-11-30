import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableWithoutFeedback} from 'react-native'
import { LogoTop, LogoWrapper, SideBottomButton, SideBottomIcon, SideBottomText, SideBottomWrapper, SideMenuItem, SideMenuItemWrapper, SideMenuScrollView, SideMenuWrapper } from '../../styles/main/sideMenuStyle'
import _ from "lodash";
import { colorRed, colorWhite } from '../../assets/colors/color'
import { openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import LeftMenuList from '../menuComponents/leftMenuList'
import { getMainCategories, getSubCategories, setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { setCartView } from '../../store/cart';
import { LANGUAGE } from '../../resources/strings';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';
const SideMenu = () =>{
    const dispatch = useDispatch();
    const {mainCategories} = useSelector((state)=>state.categories);
    const {language} = useSelector(state=>state.languages);
    
    // 메뉴 아이템 받아오기 
    const onItemPress = (index) =>{
        dispatch(setSelectedMainCategory(index)); 
        dispatch(setSelectedSubCategory(DEFAULT_CATEGORY_ALL_CODE));
    }
    // 문제 없으면 /components/menuComponents/sideMenuItem.js 제거
    if(mainCategories.length <=0) {
        return (
            <SideMenuWrapper>
                <LogoWrapper>
                    <LogoTop source={require("../../assets/icons/logo.png")}  />
                </LogoWrapper>
                
                <SideBottomWrapper>
                    <TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{openPopup(dispatch, {innerView:"LanguageSelectPopup", isPopupVisible:true}); }} >
                            <SideBottomButton borderColor={colorWhite} >
                                <SideBottomText>{LANGUAGE[language]?.sideMenu.languageSelect}</SideBottomText>
                                <SideBottomIcon source={require("../../assets/icons/korean.png")} />
                            </SideBottomButton>
                        </TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerFullView:"CallServer", isFullPopupVisible:true});}} >
                        <SideBottomButton bg={"red"} borderColor={colorRed} >
                            <SideBottomText>{LANGUAGE[language]?.sideMenu.callServer}</SideBottomText>
                            <SideBottomIcon source={require("../../assets/icons/bell_trans.png")}  />
                        </SideBottomButton>
                    </TouchableWithoutFeedback>
                </SideBottomWrapper>
            </SideMenuWrapper>    
        )
    }
    return(
        <>
            <SideMenuWrapper>
                <LogoWrapper>
                    <LogoTop source={require("../../assets/icons/logo.png")}  />
                </LogoWrapper>
                <SideMenuScrollView showsVerticalScrollIndicator={false} >
                    <SideMenuItemWrapper>
                        {mainCategories &&
                            <LeftMenuList
                                data={mainCategories}
                                onSelectItem={(index)=>{onItemPress(index);}}
                                initSelect={mainCategories[0].ITEM_GROUP_CODE}
                            />
                        }
                    </SideMenuItemWrapper>
                </SideMenuScrollView>
                <SideBottomWrapper>
                    <TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{openPopup(dispatch, {innerView:"LanguageSelectPopup", isPopupVisible:true}); }} >
                            <SideBottomButton borderColor={colorWhite} >
                                <SideBottomText>{LANGUAGE[language]?.sideMenu.languageSelect}</SideBottomText>
                                <SideBottomIcon source={require("../../assets/icons/korean.png")} />
                            </SideBottomButton>
                        </TouchableWithoutFeedback>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerFullView:"CallServer", isFullPopupVisible:true});}} >
                        <SideBottomButton bg={"red"} borderColor={colorRed} >
                            <SideBottomText>{LANGUAGE[language]?.sideMenu.callServer}</SideBottomText>
                            <SideBottomIcon source={require("../../assets/icons/bell_trans.png")}  />
                        </SideBottomButton>
                    </TouchableWithoutFeedback>

                </SideBottomWrapper>
            </SideMenuWrapper>
        </>
    )
}

export default SideMenu