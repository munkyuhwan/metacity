import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Animated,FlatList,Text,TouchableWithoutFeedback, View } from 'react-native'
import { MenuListWrapper } from '../../styles/main/menuListStyle';
import MenuItem from '../mainComponents/menuItem';
import ItemDetail from '../detailComponents/itemDetail';
import { getDisplayMenu, getMenu, getMenuState, updateMenu } from '../../store/menu';
import { widthAnimationStyle } from '../../utils/animation';
import { setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { useSharedValue } from 'react-native-reanimated';
import { openFullSizePopup, openPopup } from '../../utils/common';
import { DEFAULT_CATEGORY_ALL_CODE } from '../../resources/defaults';

// 스크롤링 관련
var touchStartOffset = 0;
var touchEndOffset = 0;
var currentOffset = 0;
var scrollDownReached = false;
var scrollUpReached = false;
var isScrolling = false;
let direction = "";

const MenuListView = () => {

    const dispatch = useDispatch();
    const listRef = useRef();

    const {displayMenu,menu, allSets} = useSelector((state)=>state.menu);
    const {isOn} = useSelector((state)=>state.cartView);
    const {language} = useSelector(state=>state.languages);

    const [numColumns, setNumColumns] = useState(3);
    const [isDetailShow, setDetailShow] = useState(false);

    // 선택 카테고리
    const {mainCategories, selectedMainCategory, selectedSubCategory, allCategories} = useSelector((state)=>state.categories);


    const toNextCaterogy = () =>{
        const selectedCat = allCategories.filter(e => e.PROD_L1_CD==selectedMainCategory);
        const selectedIndex = allCategories.indexOf(selectedCat[0]);
        var nextPage = 0;
        nextPage = selectedIndex+1;
        if(nextPage>allCategories.length-1) nextPage=allCategories.length-1;
        dispatch(setSelectedMainCategory(allCategories[nextPage].PROD_L1_CD)); 
        dispatch(setSelectedSubCategory("0000"))
    }
    const toPrevCaterogy = () =>{
        const selectedCat = allCategories.filter(e => e.PROD_L1_CD==selectedMainCategory);
        const selectedIndex = allCategories.indexOf(selectedCat[0]);
        var nextPage = 0;
        nextPage = selectedIndex-1;
        if(nextPage<0) nextPage=0;
        if(nextPage>allCategories.length-1) nextPage=allCategories.length-1;
        dispatch(setSelectedMainCategory(allCategories[nextPage].PROD_L1_CD)); 
        dispatch(setSelectedSubCategory("0000"))
    }
    useEffect(()=>{
        if(isOn) {
            setNumColumns(2);
        }else {
            setNumColumns(3);
        }
    },[isOn])

    useEffect(()=>{
        if(isDetailShow)setDetailShow(false);
        //if((selectedMainCategory!=0 || selectedSubCategory!=0)) {
            dispatch(getDisplayMenu())
        //}
    },[selectedMainCategory,selectedSubCategory])

    useEffect(()=>{
        if(displayMenu.length<=0) {
            //dispatch(getDisplayMenu());
        }
    },[displayMenu, menu])
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 2;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
    };

    const isCloseToTop = ({contentOffset}) => {
        return contentOffset.y == 0;
    };
    //console.log("mainCategories: ",mainCategories[0].ITEM_GR`OUP_CODE)
    return(
        <>
            <MenuListWrapper>
                <FlatList
                    ref={listRef}
                    columnWrapperStyle={{gap:11}}
                    style={{height:'100%', zIndex: 99 }}
                    data={displayMenu}
                    renderItem={({item, index})=>{return(<MenuItem isDetailShow={isDetailShow} setDetailShow={setDetailShow} item={item} index={index} /> );}}
                    numColumns={numColumns}
                    key={numColumns}
                    keyExtractor={(item,index)=>index}
                    onTouchStart={(event)=>{
                        touchStartOffset = event.nativeEvent.pageY;
                    }}
                    onTouchEnd={(event)=>{   
                        // 스크롤 잇을떄는 호출 안됨
                        touchEndOffset = event.nativeEvent.pageY;
                        const touchSize = touchStartOffset - touchEndOffset;
                        
                        if(touchSize < 0) {
                            // swipe down
                            if( (touchSize*-1) > 25 ) {
                                // action
                                toPrevCaterogy();
                            }
                        }else {
                            // swipe up
                            if(touchSize>25) {
                                //action
                                toNextCaterogy();
                            } 
                        }
                        
                    }}
                    onScroll={(event)=>{
                        direction = event.nativeEvent.contentOffset.y > currentOffset ? 'down' : 'up';
                        currentOffset = event.nativeEvent.contentOffset.y;
                        
                        scrollDownReached = false;
                        scrollUpReached = false;

                        if (isCloseToBottom(event.nativeEvent)) {
                            if(direction == "down") scrollDownReached = true; scrollUpReached = false;
                        }
                        if (isCloseToTop(event.nativeEvent)) {
                            if(direction == 'up') scrollUpReached = true; scrollDownReached = false;
                        }
                    }}
                    onScrollBeginDrag={(ev)=>{
                        // 스크롤 없을떄는 호출 안됨
                        isScrolling=true;
                    }}
                    onScrollEndDrag={(ev)=>{
                       
                        if(scrollDownReached ) {
                            toNextCaterogy();
                        }
                        if(scrollUpReached) {
                            toPrevCaterogy();
                        }
                    }}
                />
            </MenuListWrapper>
            {/*isDetailShow&&
            <ItemDetail isDetailShow={isDetailShow} setDetailShow={setDetailShow} language={language}/>
                */}
        </>
    );
}

export default MenuListView;
