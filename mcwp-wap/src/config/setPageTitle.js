// import favicon from '../assets/favicon.ico'

export default (title) => {
  document.title = title
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  // 替换成站标favicon路径或者任意存在的较小的图片即可
  // iframe.setAttribute('src', favicon)
  const iframeCallback = function () {
    setTimeout(function () {
      iframe.removeEventListener('load', iframeCallback)
      document.body.removeChild(iframe)
    }, 0)
  }
  iframe.addEventListener('load', iframeCallback)
  document.body.appendChild(iframe)
}
