// 图片格式的正则表达式
const IMAGE_URL_REGEX = /\.(png|jpg|jpeg|gif|bmp|tiff|tif)(\?.*)?$/i;

// 处理导航事件，拦截图片URL
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // 检查是否是主框架导航（不是iframe等）
  if (details.frameId === 0 && IMAGE_URL_REGEX.test(details.url)) {
    // 是图片链接，拦截并跳转到查看器
    redirectToViewer(details.url, details.tabId);
    return;
  }
});

// 点击扩展图标时的行为
chrome.action.onClicked.addListener((tab) => {
  // 如果当前标签页的URL是图片，则打开查看器
  if (tab.url && IMAGE_URL_REGEX.test(tab.url)) {
    redirectToViewer(tab.url, tab.id);
  } else {
    // 否则显示提示
    chrome.tabs.create({
      url: chrome.runtime.getURL('viewer.html')
    });
  }
});

// 重定向到查看器
function redirectToViewer(imageUrl, tabId) {
  const viewerUrl = chrome.runtime.getURL('viewer.html') + '?imageUrl=' + encodeURIComponent(imageUrl);
  
  // 在同一个标签页打开查看器
  chrome.tabs.update(tabId, { url: viewerUrl });
}

// 安装或更新扩展时显示使用说明
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('viewer.html?welcome=true')
    });
  }
}); 