package com.metacity.modules.koces;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.metacity.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;

public class KocesPayModule extends ReactContextBaseJavaModule {
    private Context mContext = null;
    private int KOCES_REQUEST_CODE = 1910;
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener(){
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);
            System.out.println("================================on activity result================================");
            System.out.println("intent====="+requestCode);
            System.out.println(data);
            if(data != null) {
                System.out.println(data.getExtras().keySet());
                for (String key : data.getExtras().keySet()) {
                    System.out.println(key + " : " + (data.getExtras().get(key) != null ? data.getExtras().get(key) : "NULL"));
                }
            }


        }
    };

    KocesPayModule(ReactApplicationContext context) {
        super(context);
        getReactApplicationContext().addActivityEventListener(mActivityEventListener);
        mContext=context;

    }

    @NonNull
    @Override
    public String getName() {
        return "KocesPay";
    }

    @ReactMethod
    public void prepareKocesPay(ReadableMap data, Callback errorCallback, Callback successCallback) {
        System.out.println("==============================prepare koces pay==============================");
        HashMap dataHash = data.toHashMap();
        System.out.println(dataHash);

        String tid = getReactApplicationContext().getString(R.string.TID);
        String bsnNo = getReactApplicationContext().getString(R.string.BusinessID);
        String serial = getReactApplicationContext().getString(R.string.SN);
        HashMap<String, String> hashMap = new HashMap<>();
        Intent intent = new Intent();
        intent.addCategory(Intent.CATEGORY_LAUNCHER);
        intent.setClassName("com.koces.androidpos","com.koces.androidpos.AppToAppActivity");
        intent.setPackage(getReactApplicationContext().getPackageName());
        //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_FROM_BACKGROUND);
        /*
        hashMap.put("TrdType","D10");
        hashMap.put("TermID",tid);
        hashMap.put("BsnNo",bsnNo);
        hashMap.put("Serial",serial);
        hashMap.put("MchData","");
        */
        if(dataHash != null) {
            for (Object key : dataHash.keySet()) {
                System.out.println(key + " : " + (dataHash.get(key) != null ? dataHash.get(key) : "NULL"));
                hashMap.put(key.toString(),(dataHash.get(key) != null ? dataHash.get(key).toString() : "NULL") );

                //System.out.println(key + " : " + (dataHash.get(key) != null ? dataHash.get(key) : "NULL"));
            }
        }
        System.out.println("hashMap: "+hashMap);

        intent.putExtra("hashMap",hashMap);
        getReactApplicationContext().startActivityForResult(intent, KOCES_REQUEST_CODE,null);

    }


}
