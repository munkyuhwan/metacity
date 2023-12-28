import { NativeModules } from "react-native"
import { BSN_ID, KOCES_CODE_STORE_DOWNLOAD, SN, TID } from "../../resources/apiResources";
import moment from "moment";

export function KocesAppPay () {
    this.data = {};
}
// 초기화
KocesAppPay.prototype.init = function () {
    console.log("initialize koces");
    this.data = {};
} 
// 가맹점 다운로드
KocesAppPay.prototype.storeDownload = function () {
    this.data = {TrdType:KOCES_CODE_STORE_DOWNLOAD,TermID:TID, BsnNo:BSN_ID, Serial:SN, MchData:""};
} 
// 결제 요청
KocesAppPay.prototype.makePayment = function ({amt,taxAmt,months}) {
    this.data = {
        TrdType:'A10',
        TermID: TID, 
        Audate:`${moment().format("YYMMDD")}`,
        AuNo:'',
        KeyYn:'I',
        TrdAmt:`${amt}`,
        TaxAmt:`${taxAmt}`,
        SvcAmt:"0",
        TaxFreeAmt:"0",
        Month:`${months}`,
        MchData:"wooriorder",
        TrdCode:"",
        TradeNo:"",
        CompCode:"",
        DscYn:"1",
        DscData:"",
        FBYn:"0",
        InsYn:"1",
        CancelReason:"",
        CashNum:"",
        BillNo:"",
    };
} 

// 취소 요청
KocesAppPay.prototype.cancelPayment = function ({amt,taxAmt,auDate,auNo,tradeNo}) {
    this.data = {
        TrdType:'A20',
        TermID: TID, 
        Audate:`${auDate}`,
        AuNo:`${auNo}`,
        KeyYn:'I',
        TrdAmt:`${amt}`,
        TaxAmt:`${taxAmt}`,
        SvcAmt:"0",
        TaxFreeAmt:"0",
        Month:"00",
        MchData:"wooriorder",
        TrdCode:`T`,
        TradeNo:`${tradeNo}`,
        CompCode:"",
        DscYn:1,
        DscData:"",
        FBYn:0,
        InsYn:1,
        CancelReason:"1",
        CashNum:"",
        BillNo:"",
    };


} 

// 결제 등등 요청
KocesAppPay.prototype.requestKoces = async function () {
    const {KocesPay} = NativeModules;
    return await new Promise((resolve, reject)=>{
        KocesPay.prepareKocesPay(
            this.data,
            (error)=>{
                //console.log("error msg: ",error);
                reject(JSON.parse(error));
            },
            (msg)=>{
                //console.log("success msg: ",msg);
                resolve(JSON.parse(msg));
            }
        );
    });

}


export const prepareKocesPay = () =>{
    const {KocesPay} = NativeModules;
    
    const payData = {
        TrdType:'A10',
        TermID: TID, 
        Audate:`${moment().format("YYMMDD")}`,
        AuNo:'',
        KeyYn:'I',
        TrdAmt:"50000",
        TaxAmt:"5000",
        SvcAmt:"0",
        TaxFreeAmt:"0",
        Month:"00",
        MchData:"wooriorder",
        TrdCode:"",
        TradeNo:"",
        CompCode:"",
        DscYn:1,
        DscData:"",
        FBYn:0,
        InsYn:1,
        CancelReason:"",
        CashNum:"",
        BillNo:"",

    };
    KocesPay.prepareKocesPay(
        payData,
        (error)=>{
            reject(error);
        },
        (msg)=>{
            resolve(msg);
        }
    );
}