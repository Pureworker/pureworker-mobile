package com.rtnmylocation;

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider

class MyLocationPackage : TurboReactPackage() {
  override fun getModule(name: String?, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == MyLocationModule.NAME){
        MyLocationModule(reactContext)
    } else {
        null
    }
  }
  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider?{
    return ReactModuleInfoProvider {
        val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
        moduleInfos[MylocationModule.NAME] = ReactModuleInfo(
            MylocationModule.NAME,
            MyLocationModule.NAME,
            false, //canOverrideExistingModule
            false, //needsEagerInit
            true, //hasConstants
            false, //isCxxModule
            true //isTurboModule
            moduleInfos
        )
    }
  }
}