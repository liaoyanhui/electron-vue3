###
 # @Description: 打包脚本 命令 ./build.sh [mac|win64]
 # [mac|win64] 选一个平台打包 如果不写就表示两个平台都打包
 # @Author: 尚夏
 # @Date: 2024-01-22 16:24:13
 # @LastEditTime: 2024-03-11 14:03:34
 # @FilePath: /cbank-client/build.sh
### 

#step1 打包生成dist
npm run electron_production

#step2 删除electron/dist 并且将最新的dist移动到electron下
rm -rf ./electron/dist
mv dist ./electron/

#step3 删除electron下之前打包生成的文件 packages
rm -rf ./electron/packages

#step4 取消签名(因为当前没有证书)
export CSC_IDENTITY_AUTO_DISCOVERY=false

#step5 打包
cd electron
if [ "$1" = "mac" ] || [ "$1" = "win64" ]; then
  if [ "$1" = "mac" ]; then
    npm run package-mac
  elif [ "$1" == "win64" ]; then
    npm run package-win64
  fi
else
  #打包mac
  npm run package-mac

  #打包win
  npm run package-win64
fi
