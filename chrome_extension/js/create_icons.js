// 这个脚本用于创建简单的图标文件
// 请在Chrome开发者工具的控制台中运行此代码

function createIcon(size) {
  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // 绘制背景
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, size, size);
  
  // 绘制图片图标
  ctx.fillStyle = 'white';
  const padding = Math.floor(size / 4);
  ctx.fillRect(padding, padding, size - padding * 2, size - padding * 2);
  
  // 绘制对角线
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = Math.max(2, Math.floor(size / 16));
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(size - padding, size - padding);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(size - padding, padding);
  ctx.lineTo(padding, size - padding);
  ctx.stroke();
  
  // 获取数据URL
  return canvas.toDataURL('image/png');
}

// 创建三种尺寸的图标
const sizes = [16, 48, 128];
const iconUrls = {};

sizes.forEach(size => {
  iconUrls[size] = createIcon(size);
  console.log(`${size}x${size} 图标已创建`);
  
  // 显示下载链接
  const link = document.createElement('a');
  link.href = iconUrls[size];
  link.download = `icon${size}.png`;
  link.textContent = `下载 ${size}x${size} 图标`;
  link.style.display = 'block';
  link.style.margin = '10px';
  document.body.appendChild(link);
});

console.log('请点击链接下载图标文件，然后将它们放入chrome_extension/images目录'); 