 !macro customUnInstall
    SetRegView 64
     DeleteRegKey /ifempty SHCTX "Software\Microsoft\Windows\CurrentVersion\Run\com.lachangba.cbank app"
    SetRegView 32
     DeleteRegKey /ifempty SHCTX "Software\Microsoft\Windows\CurrentVersion\Run\com.lachangba.cbank app"
 !macroend