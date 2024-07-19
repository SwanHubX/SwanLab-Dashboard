/**
 * 基础防抖函数，用于减少函数的调用频率，接收两个参数，第一个是要防抖的函数，第二个是延迟的时间
 * @param { Function } func 函数
 * @param { number } [delay=500] 延迟时间，单位毫秒，默认500ms
 * @returns { Function } 返回一个新的函数
 */
export function debounce(func, delay = 500) {
  let timer = null
  return function (/** @type {any[]} */ ...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func?.apply(this, args)
    }, delay)
  }
}
