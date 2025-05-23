# 图片查看器 Chrome 扩展

这是一个Chrome浏览器扩展，用于拦截图片链接并在线预览，支持多种图片格式。

## 功能

- 自动拦截图片链接（.png, .jpg, .jpeg, .gif, .bmp, .tif, .tiff）并在查看器中打开
- 从URL加载图片
- 从本地文件加载图片
- 支持拖放图片文件
- 支持旋转、缩放图片
- 显示图片尺寸、类型和文件大小信息
- 特别支持TIFF格式图片（使用tiff.js库）
- 下载图片功能

## 安装方法

1. 下载或克隆本仓库
2. 打开Chrome浏览器，转到扩展页面 (chrome://extensions/)
3. 启用开发者模式 (右上角开关)
4. 点击"加载已解压的扩展程序"按钮
5. 选择本仓库中的`chrome_extension`文件夹
6. 安装完成后，扩展图标将显示在浏览器工具栏中

## 使用方法

### 自动拦截图片链接

当您访问直接指向图片的链接时（如 https://example.com/image.jpg），扩展将自动拦截并在查看器中打开图片。

### 手动使用图片查看器

1. 点击扩展图标打开图片查看器
2. 输入图片URL并点击"加载图片"按钮
3. 或者上传本地图片文件
4. 也可以将图片文件拖放到查看区域

### 图片操作

- 点击"↓"按钮下载当前图片
- 点击"⟳"按钮旋转图片
- 点击"+"按钮放大图片
- 点击"-"按钮缩小图片
- 点击"⟲"按钮重置图片视图

## 技术细节

- 使用Chrome扩展API拦截图片URL
- 使用Fetch API和FileReader加载图片
- 使用tiff.js库处理TIFF格式图片
- 通过Canvas显示TIFF图片

## 浏览器兼容性

该扩展专为Chrome浏览器设计。 