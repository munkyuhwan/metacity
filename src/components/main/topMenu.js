import React, { useEffect, useState } from 'react'
import { 
    SafeAreaView,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import { HeaderLogo, HeaderWrapper } from '../../styles/header/header'
import { LogoTop, LogoWrapper, SideMenuItem, SideMenuItemWrapper, SideMenuWrapper } from '../../styles/main/sideMenuStyle'
import { SideMenuItemTouchable } from '../common/sideMenuItem'
import { TopMenuItemTouchable, TopMenuItemTouchableOff } from '../menuComponents/topMenuItem'
import { CategoryScrollView, CategoryWrapper, IconWrapper, TableName, TableNameBig, TableNameSmall, TopMenuWrapper, TouchIcon } from '../../styles/main/topMenuStyle'
 import TopButton from '../menuComponents/topButton'
import { useDispatch, useSelector } from 'react-redux'
import ItemDetail from '../detailComponents/itemDetail'
import { getSubCategories, setCategories, setSelectedSubCategory } from '../../store/categories'
import { openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import { colorWhite } from '../../assets/colors/color'
import TopMenuList from '../menuComponents/topMenuList'
import VersionCheck from 'react-native-version-check';
import { uploadFile } from '../../store/etcFunctions'

const TopMenu = () =>{
    const dispatch = useDispatch();
    const {tableInfo} = useSelector(state => state.tableInfo);
    const {menuCategories} = useSelector(state=>state.menuExtra);
    const {selectedMainCategory,subCategories} = useSelector(state => state.categories);

    //console.log("menuCategories: ",menuCategories);
    
    const [currentVersion, setCurrentVersion ] = useState("version");

    useEffect(()=>{
        const goodsCategories = menuCategories;
        if(goodsCategories?.length > 0){
            const selectedCategoryItem = goodsCategories.filter(el=>el.cate_code1==selectedMainCategory);
            if(selectedCategoryItem.length > 0) {
                dispatch(setCategories({subCategories:selectedCategoryItem[0]?.level2}));
            }
        } 
    },[selectedMainCategory])

    useEffect(()=>{ 
        setCurrentVersion(VersionCheck.getCurrentVersion());
    },[])

    const onPressItem = (index) => {
        dispatch(setSelectedSubCategory(index)); 
    }
    /* 
    if(subCategories.length <=0) {
        return(<></>)
    }
     */


    
    return(
        <>
            <TopMenuWrapper>
                <SafeAreaView>
                    <CategoryScrollView  horizontal showsHorizontalScrollIndicator={false} >
                        <CategoryWrapper>
                            {
                                <TopMenuList
                                    data={subCategories}
                                    onSelectItem={(index)=>{ onPressItem(index); }}
                                    initSelect={0}
                                />
                            }
                       </CategoryWrapper>
                    </CategoryScrollView>
                </SafeAreaView>
                <TableName>
                    {/* <TableNameSmall>{tableInfo?.TBL_CODE}</TableNameSmall> */}
                    <TableNameBig>{tableInfo?.TBL_NAME}</TableNameBig>
                </TableName>
                <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch,{innerFullView:"Setting", isFullPopupVisible:true}); }} >
                    <Text style={{color:colorWhite}} >설정 {currentVersion}</Text>
                </TouchableWithoutFeedback>
                {/*
                <TouchableWithoutFeedback onPress={()=>{ console.log("upload file"); dispatch(uploadFile()) }} >
                    <Text style={{color:colorWhite, fontSize:20}} >파일올리기 </Text>
                </TouchableWithoutFeedback>
                        */}
            </TopMenuWrapper>
        </>
    )
}

export default TopMenu