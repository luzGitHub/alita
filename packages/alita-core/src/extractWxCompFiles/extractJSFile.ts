import {getRootPathPrefix} from '../util/util'

import configure from "../configure";
import * as path from "path";


export const handleChanged = (info, finalJSPath) => {
    const newWxOutFiles = {}

    const {outComp, isPageComp} = info.RFInfo


    let outCompCode = `Component(wx.__bridge.WxNormalComp())`

    let renderCode
    if (isPageComp) {
        const projectRelativePath = finalJSPath
            .replace(configure.outputFullpath + path.sep, '')
            .replace('.js', '')
            .replace(/\\/g, '/') // win 平台

        const rootOrSubRootPrefix = getRootPathPrefix(finalJSPath)

        renderCode = `require("${rootOrSubRootPrefix}/_rn_");Component(wx.__bridge.WxNormalComp("${projectRelativePath}"))`
    } else {
        renderCode = outCompCode
    }

    for(let i = 0; i < outComp.length; i++) {
        const name = outComp[i]

        const jspath = (name === 'default' ? finalJSPath : finalJSPath.replace('.js', `${name}.js`))
        const jscode = (name === 'default' ? renderCode : outCompCode)

        newWxOutFiles[jspath] = jscode
    }

    return newWxOutFiles
}
