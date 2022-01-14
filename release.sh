:<<EOF
    bash release.sh
    新版本发布
EOF
set -e

if [[ -z $1 ]]; then
    echo $1
else
    echo '默认发版程序'
fi
# 原版本号
VERSION=$(node -e "(function () { console.log(require('./package.json').version) })()")
V1=${VERSION%%.*}
VV=${VERSION#*.}
V2=${VV%%.*}
V3=${VERSION##*.}

# 新版本号
if [ `expr ${V3} + 1` -gt 9 ]; then
    if [ `expr ${V2} + 1` -gt 9 ]; then
        V1=`expr ${V1} + 1`
        V2=0
        V3=0
    else 
        V2=`expr ${V2} + 1`
        V3=0
    fi
else 
    V3=`expr ${V3} + 1`
fi
NEWVERSION="$V1.$V2.$V3"
read -p "发布新版本 $NEWVERSION (原版本$VERSION) - 确定? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "开始发布..."
#   if [[ -z $SKIP_TESTS ]]; then
#     npm run lint
#     npm run flow
#     npm run test:cover
#     npm run test:e2e -- --env phantomjs
#     npm run test:ssr
  fi

  # Sauce Labs tests has a decent chance of failing
  # so we usually manually run them before running the release script.

  # if [[ -z $SKIP_SAUCE ]]; then
  #   export SAUCE_BUILD_ID=$VERSION:`date +"%s"`
  #   npm run test:sauce
  # fi

  # build
#   VERSION=$NEWVERSION npm run build
#   echo $NEWVERSION
  # update packages
  # using subshells to avoid having to cd back
# ( 
    # ( cd packages/vue-template-compiler
    #     npm version "$VERSION"
    #     if [[ -z $RELEASE_TAG ]]; then
    #         npm publish
    #     else
    #         npm publish --tag "$RELEASE_TAG"
    #     fi
    # )

#   cd packages/vue-server-renderer
#   npm version "$VERSION"
#   if [[ -z $RELEASE_TAG ]]; then
#     npm publish
#   else
#     npm publish --tag "$RELEASE_TAG"
#   fi
# )

  # commit
  echo "开始提交代码"
  git add .
#   git add -f \
#     dist/*.js \
#     packages/vue-server-renderer/basic.js \
#     packages/vue-server-renderer/build.dev.js \
#     packages/vue-server-renderer/build.prod.js \
#     packages/vue-server-renderer/server-plugin.js \
#     packages/vue-server-renderer/client-plugin.js \
#     packages/vue-template-compiler/build.js \
#     packages/vue-template-compiler/browser.js
  git commit -m "build: build $NEWVERSION"
  # generate release note
#   npm run release:note
  # tag version
  npm version "$NEWVERSION" --message "build: release $NEWVERSION"

  # publish
  echo "开始上传到git代码库.."
  git push
  
  echo "开始上传到npm..."
  if [[ -z $RELEASE_TAG ]]; then
    echo "提交新的npm包版本"
    npm publish
  else
    echo "提交新的npm包版本"
    npm publish --tag "$RELEASE_TAG"
  fi
fi