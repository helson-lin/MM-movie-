export const isPad = () => {
    const aspectRatioMatchPad = (window.screen.width / window.screen.height) > 1.5
    const judgepadByUserAgent = navigator.userAgent.match(/pad/i) !== null
    return aspectRatioMatchPad || judgepadByUserAgent
}
/**
 * @description lock device to landscape mode
 * @return {void}
 */
export const forceLandscape = () => {
    if (typeof screen.orientation.lock === 'undefined') {
        console.log("不支持方法,跳过锁定方向的代码")
        // 不支持方法,跳过锁定方向的代码
    } else if (screen.orientation.type.includes('portrait')) {
        // 当前为竖屏,请求锁定方向权限
        try {
            screen.orientation.lock('landscape')
        } catch (e) {
            console.log("无法自动切换横屏")
        }
    }
}
/**
 * @description if device is pad lock device to landscape mode
 * @return {void}
 */
export const lockScreen = () => {
    if (isPad()) {
        forceLandscape()
    }
}
