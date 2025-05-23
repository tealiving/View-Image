document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const imageUrlInput = document.getElementById('imageUrl');
    const loadBtn = document.getElementById('loadBtn');
    const fileInput = document.getElementById('fileInput');
    const loadFileBtn = document.getElementById('loadFileBtn');
    const imageContainer = document.getElementById('imageContainer');
    const imageInfo = document.getElementById('imageInfo');
    const dropZone = document.getElementById('dropZone');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    // 工具栏按钮
    const downloadBtn = document.getElementById('downloadBtn');
    const rotateBtn = document.getElementById('rotateBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // 图片变换状态
    let currentRotation = 0;
    let currentScale = 1;
    let currentImage = null;
    let currentImageUrl = '';
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrlParam = urlParams.get('imageUrl');
    const welcomeParam = urlParams.get('welcome');
    
    // 如果是欢迎页面，显示欢迎信息
    if (welcomeParam === 'true') {
        welcomeMessage.style.display = 'block';
    }
    
    // 如果URL包含图片参数，自动加载图片
    if (imageUrlParam) {
        imageUrlInput.value = decodeURIComponent(imageUrlParam);
        loadImageFromUrl(imageUrlParam);
    }
    
    // 从URL加载图片
    loadBtn.addEventListener('click', () => {
        const url = imageUrlInput.value.trim();
        if (!url) {
            alert('请输入有效的图片URL');
            return;
        }
        
        loadImageFromUrl(url);
    });
    
    // 从本地文件加载图片
    loadFileBtn.addEventListener('click', () => {
        if (fileInput.files.length === 0) {
            alert('请选择一个图片文件');
            return;
        }
        
        const file = fileInput.files[0];
        if (!file.type.startsWith('image/')) {
            alert('请选择有效的图片文件');
            return;
        }
        
        loadImageFromFile(file);
    });
    
    // 拖放文件处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageContainer.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        imageContainer.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageContainer.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                loadImageFromFile(file);
            } else {
                alert('请拖放有效的图片文件');
            }
        }
    });
    
    // 工具栏功能
    downloadBtn.addEventListener('click', downloadImage);
    rotateBtn.addEventListener('click', rotateImage);
    zoomInBtn.addEventListener('click', () => zoomImage(0.1));
    zoomOutBtn.addEventListener('click', () => zoomImage(-0.1));
    resetBtn.addEventListener('click', resetImageView);
    
    // 从URL加载图片到内存并显示
    function loadImageFromUrl(url) {
        // 显示加载状态
        showLoading();
        
        // 重置图像变换
        resetImageTransform();
        
        // 使用Fetch API加载图片
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`网络响应错误: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                currentImageUrl = url;
                displayImage(blob, url);
            })
            .catch(error => {
                showError(`加载图片失败: ${error.message}`);
                console.error('加载图片错误:', error);
            });
    }
    
    // 从本地文件加载图片
    function loadImageFromFile(file) {
        // 显示加载状态
        showLoading();
        
        // 重置图像变换
        resetImageTransform();
        
        // 使用FileReader加载图片
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const blob = new Blob([arrayBuffer], {type: file.type});
            currentImageUrl = file.name;
            displayImage(blob, file.name);
        };
        
        reader.onerror = function() {
            showError('读取文件失败');
            console.error('FileReader错误:', reader.error);
        };
        
        // 读取文件为ArrayBuffer
        reader.readAsArrayBuffer(file);
    }
    
    // 显示图片
    function displayImage(blob, sourceInfo) {
        const isTiff = blob.type === 'image/tiff' || 
                      sourceInfo.toLowerCase().endsWith('.tif') || 
                      sourceInfo.toLowerCase().endsWith('.tiff');
        
        if (isTiff && window.Tiff) {
            displayTiffImage(blob);
        } else {
            displayRegularImage(blob);
        }
        
        // 隐藏拖放区域
        dropZone.classList.add('hidden');
    }
    
    // 显示普通图片
    function displayRegularImage(blob) {
        // 创建一个Object URL
        const objectUrl = URL.createObjectURL(blob);
        
        // 创建图片元素
        const img = new Image();
        
        // 图片加载完成后清空容器并添加图片
        img.onload = function() {
            clearImageContainer();
            imageContainer.appendChild(img);
            currentImage = img;
            
            // 显示图片信息
            displayImageInfo(img.naturalWidth, img.naturalHeight, blob.type || '未知', blob.size);
            
            // 释放Object URL
            URL.revokeObjectURL(objectUrl);
        };
        
        img.onerror = function() {
            showError('图片加载失败');
            // 释放Object URL
            URL.revokeObjectURL(objectUrl);
        };
        
        // 设置图片源
        img.src = objectUrl;
    }
    
    // 显示TIFF图片
    function displayTiffImage(blob) {
        // 先将blob转换为ArrayBuffer
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const tiff = new Tiff({buffer: e.target.result});
                const width = tiff.width();
                const height = tiff.height();
                
                // 转换TIFF为canvas
                const canvas = tiff.toCanvas();
                if (canvas) {
                    // 清空容器并添加canvas
                    clearImageContainer();
                    imageContainer.appendChild(canvas);
                    currentImage = canvas;
                    
                    // 显示图片信息
                    displayImageInfo(width, height, 'TIFF', blob.size);
                }
            } catch (error) {
                showError(`无法处理TIFF图片: ${error.message}`);
                console.error('TIFF处理错误:', error);
            }
        };
        
        reader.onerror = function() {
            showError('读取TIFF文件失败');
            console.error('FileReader错误:', reader.error);
        };
        
        reader.readAsArrayBuffer(blob);
    }
    
    // 显示图片信息
    function displayImageInfo(width, height, type, size) {
        imageInfo.innerHTML = `
            <p>图片尺寸: ${width} × ${height} 像素</p>
            <p>文件类型: ${type}</p>
            <p>文件大小: ${formatFileSize(size)}</p>
            <p>图片来源: ${currentImageUrl}</p>
        `;
    }
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    }
    
    // 清空图片容器
    function clearImageContainer() {
        // 保留拖放区域，移除其他内容
        const children = [...imageContainer.children];
        for (const child of children) {
            if (child !== dropZone) {
                imageContainer.removeChild(child);
            }
        }
    }
    
    // 显示加载状态
    function showLoading() {
        clearImageContainer();
        const loadingElement = document.createElement('p');
        loadingElement.textContent = '正在加载图片...';
        imageContainer.appendChild(loadingElement);
        dropZone.classList.add('hidden');
    }
    
    // 显示错误消息
    function showError(message) {
        clearImageContainer();
        const errorElement = document.createElement('p');
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        imageContainer.appendChild(errorElement);
        dropZone.classList.remove('hidden');
    }
    
    // 下载当前图片
    function downloadImage() {
        if (!currentImage || !currentImageUrl) {
            alert('没有可下载的图片');
            return;
        }
        
        const a = document.createElement('a');
        let url;
        
        if (currentImage instanceof HTMLImageElement) {
            // 如果是<img>元素
            url = currentImage.src;
        } else if (currentImage instanceof HTMLCanvasElement) {
            // 如果是<canvas>元素
            url = currentImage.toDataURL('image/png');
        } else {
            alert('无法下载此类型的图片');
            return;
        }
        
        a.href = url;
        a.download = getFilenameFromUrl(currentImageUrl);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    // 从URL中获取文件名
    function getFilenameFromUrl(url) {
        try {
            // 尝试从URL中提取文件名
            const pathname = new URL(url, window.location.origin).pathname;
            const filename = pathname.split('/').pop();
            return filename || 'image.png';
        } catch (e) {
            // 如果URL解析失败，直接返回URL作为文件名
            return url.split('/').pop() || 'image.png';
        }
    }
    
    // 旋转图片
    function rotateImage() {
        if (!currentImage) return;
        
        currentRotation = (currentRotation + 90) % 360;
        applyImageTransform();
    }
    
    // 缩放图片
    function zoomImage(delta) {
        if (!currentImage) return;
        
        currentScale = Math.max(0.1, Math.min(3, currentScale + delta));
        applyImageTransform();
    }
    
    // 重置图像视图
    function resetImageView() {
        if (!currentImage) return;
        
        resetImageTransform();
        applyImageTransform();
    }
    
    // 重置图像变换
    function resetImageTransform() {
        currentRotation = 0;
        currentScale = 1;
    }
    
    // 应用图像变换
    function applyImageTransform() {
        if (!currentImage) return;
        
        currentImage.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
    }
}); 