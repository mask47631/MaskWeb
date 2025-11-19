/**
 * 媒体文件缓存服务
 * 处理媒体文件（图片、视频、音频）的缓存，以支持离线访问
 */

class MediaCache {
  constructor() {
    this.cacheName = 'maskweb-media-cache-v1';
    this.enabled = 'caches' in window;
    // 会话内存缓存，用于跟踪当前会话中已处理的文件
    this.sessionCache = new Set();
  }

  /**
   * 检查当前环境是否支持缓存
   * @returns {boolean} 是否支持缓存
   */
  isSupported() {
    return this.enabled;
  }

  /**
   * 从URL中提取基础路径（去除token等变化参数）
   * @param {string} url - 完整的URL
   * @returns {string} 基础路径
   */
  getBaseURL(url) {
    try {
      // 对于类似 /file/private/{id}/{token} 的URL格式
      // 我们需要提取 /file/private/{id} 作为基础路径
      const urlObj = new URL(url, window.location.origin);
      const pathParts = urlObj.pathname.split('/');
      
      // 检查是否是 /file/private/{id}/{token} 格式
      if (pathParts.length === 5 && pathParts[1] === 'file' && pathParts[2] === 'private') {
        // 重构URL，移除token部分
        const baseURL = `${urlObj.origin}/file/private/${pathParts[3]}`;
        return baseURL;
      }
      
      return urlObj.toString();
    } catch (e) {
      // 如果URL解析失败，返回原URL
      return url;
    }
  }

  /**
   * 检查缓存是否仍然有效
   * @returns {Promise<boolean>} 缓存是否有效
   */
  async validateCache() {
    if (!this.enabled) return false;
    
    try {
      // 检查缓存存储是否存在
      const cacheNames = await caches.keys();
      return cacheNames.includes(this.cacheName);
    } catch (error) {
      console.warn('验证缓存失败:', error);
      return false;
    }
  }

  /**
   * 缓存媒体文件
   * @param {string} url - 媒体文件的URL
   * @param {Blob} blob - 媒体文件的Blob数据
   * @returns {Promise<boolean>} 缓存是否成功
   */
  async cacheMediaFile(url, blob) {
    if (!this.enabled) return false;

    // 使用基础URL作为缓存键，忽略token等变化参数
    const baseURL = this.getBaseURL(url);
    
    // 检查当前会话是否已缓存此文件
    if (this.sessionCache.has(baseURL)) {
      // 验证实际缓存是否存在
      const isValid = await this.validateCache();
      if (!isValid) {
        // 如果缓存不存在，清除sessionCache并重新缓存
        this.sessionCache.delete(baseURL);
      } else {
        return true;
      }
    }

    try {
      const cache = await caches.open(this.cacheName);
      const response = new Response(blob, {
        headers: {
          'Content-Type': blob.type || 'application/octet-stream',
          'Content-Length': blob.size.toString()
        }
      });
      await cache.put(baseURL, response);
      // 标记为当前会话已缓存
      this.sessionCache.add(baseURL);
      return true;
    } catch (error) {
      console.warn('缓存媒体文件失败:', error);
      return false;
    }
  }

  /**
   * 获取已缓存的媒体文件
   * @param {string} url - 媒体文件的URL
   * @returns {Promise<Blob|null>} 缓存的Blob数据，如果未找到则返回null
   */
  async getCachedMediaFile(url) {
    if (!this.enabled) return null;

    // 使用基础URL作为缓存键
    const baseURL = this.getBaseURL(url);

    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(baseURL);
      
      if (response) {
        return await response.blob();
      }
      return null;
    } catch (error) {
      console.warn('获取缓存媒体文件失败:', error);
      return null;
    }
  }

  /**
   * 检查媒体文件是否已缓存
   * @param {string} url - 媒体文件的URL
   * @returns {Promise<boolean>} 文件是否已缓存
   */
  async isMediaFileCached(url) {
    if (!this.enabled) return false;

    // 使用基础URL作为缓存键
    const baseURL = this.getBaseURL(url);
    
    // 首先检查会话缓存
    if (this.sessionCache.has(baseURL)) {
      // 验证实际缓存是否存在
      const isValid = await this.validateCache();
      if (!isValid) {
        // 如果缓存不存在，从sessionCache中移除
        this.sessionCache.delete(baseURL);
        return false;
      }
      return true;
    }

    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(baseURL);
      const cached = !!response;
      // 如果已缓存，添加到会话缓存中
      if (cached) {
        this.sessionCache.add(baseURL);
      }
      return cached;
    } catch (error) {
      console.warn('检查缓存媒体文件失败:', error);
      return false;
    }
  }

  /**
   * 预加载并缓存媒体文件
   * @param {string} url - 媒体文件的URL
   * @returns {Promise<boolean>} 预加载是否成功
   */
  async preloadMediaFile(url) {
    if (!this.enabled) return false;

    try {
      // 首先检查是否已缓存
      const isCached = await this.isMediaFileCached(url);
      if (isCached) return true;

      // 获取文件并缓存
      const response = await fetch(url);
      if (!response.ok) return false;

      const blob = await response.blob();
      return await this.cacheMediaFile(url, blob);
    } catch (error) {
      console.warn('预加载媒体文件失败:', error);
      return false;
    }
  }

  /**
   * 清除所有缓存的媒体文件
   * @returns {Promise<boolean>} 清除是否成功
   */
  async clearCache() {
    if (!this.enabled) return false;

    try {
      await caches.delete(this.cacheName);
      // 同时清除会话缓存
      this.sessionCache.clear();
      return true;
    } catch (error) {
      console.warn('清除媒体缓存失败:', error);
      return false;
    }
  }

  /**
   * 获取缓存统计信息
   * @returns {Promise<Object>} 缓存统计信息
   */
  async getCacheStats() {
    if (!this.enabled) {
      return { supported: false, entries: 0, size: 0 };
    }

    try {
      // 验证缓存是否存在
      const isValid = await this.validateCache();
      if (!isValid) {
        // 如果缓存不存在，重置sessionCache
        this.sessionCache.clear();
        return { supported: true, entries: 0, size: 0 };
      }

      const cache = await caches.open(this.cacheName);
      const keys = await cache.keys();
      
      let totalSize = 0;
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
      
      return {
        supported: true,
        entries: keys.length,
        size: totalSize
      };
    } catch (error) {
      console.warn('获取缓存统计信息失败:', error);
      return { supported: true, entries: 0, size: 0 };
    }
  }
}

// 导出单例实例
export default new MediaCache();