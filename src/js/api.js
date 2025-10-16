/**
 * API调用工具类
 * 根据api-docs.json中的接口定义封装的API调用方法
 */
import md5 from 'js-md5';

class ApiClient {
  constructor(baseURL = 'http://localhost:47631', defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      headers: {
        // 'Content-Type': 'application/json',
        ...defaultOptions.headers
      },
      ...defaultOptions
    };
    this.token = null;
    this.setSocketToken = (token)=>{}
  }

  /**
   * 设置认证token
   * @param {string} token - 认证token
   */
  setToken(token) {
    this.token = token;
    // 更新默认请求头
    this.defaultOptions.headers.Authorization = `${token}`;
  }

  /**
   * 获取当前token
   * @returns {string|null} 当前token
   */
  getToken() {
    return this.token;
  }

  /**
   * 合并请求选项
   * @param {Object} options - 请求选项
   * @returns {Object} 合并后的选项
   */
  mergeOptions(options) {
    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      }
    };

    // 如果有token，确保它在请求头中
    if (this.token) {
      mergedOptions.headers.Authorization = `${this.token}`;
    }

    return mergedOptions;
  }

  /**
   * 发送请求
   * @param {string} url - 请求地址
   * @param {Object} options - 请求选项
   * @returns {Promise} 响应Promise
   */
  async request(url, options = {}) {
    const fullURL = this.baseURL + url;
    const mergedOptions = this.mergeOptions(options);
    
    try {
      const response = await fetch(fullURL, mergedOptions);
      
      // 检查响应头中是否有新的token
      const refreshedToken = response.headers.get('X-Refreshed-Token');
        console.log( refreshedToken)
      if (refreshedToken) {
        this.setToken(refreshedToken);
        this.setSocketToken(refreshedToken)
      }
      
      if (!response.ok) {
        // 返回包含错误码的响应
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          status: response.status,
          message: `HTTP error! status: ${response.status}`,
          data: errorData
        };
      }

    return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error.message,
        status: -1 // 网络错误或其他异常情况使用-1作为状态码
      };
    }
  }

  // ========== 登录注册接口 ==========

  /**
   * 用户登录
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Promise} 登录结果
   */
  async login(email, password) {
    const url = `/unauth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(md5(password))}`;
    const response = await this.request(url, {
      method: 'POST'
    });
    
    // 如果登录成功且返回了token，则设置token
    if (response.success && response.data && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  /**
   * 用户注册
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @param {string} email - 邮箱
   * @returns {Promise} 注册结果
   */
  async register(username, password, email) {
    const url = `/unauth/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(md5(password))}&email=${encodeURIComponent(email)}`;
    const response = await this.request(url, {
      method: 'POST'
    });
    
    // 如果注册成功且返回了token，则设置token
    if (response.success && response.data && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  // ========== 用户相关接口 ==========

  /**
   * 获取当前登录用户的详细信息
   * @returns {Promise} 用户信息
   */
  getSelf() {
    return this.request('/user/getSelf', {
      method: 'GET'
    });
  }

  /**
   * 向用户邮箱发送6位数字验证码
   * @returns {Promise} 发送结果
   */
  sendEmailCode() {
    return this.request('/user/sendEmailCode', {
      method: 'GET'
    });
  }

  /**
   * 校验邮箱验证码是否正确
   * @param {string} code - 邮箱验证码
   * @returns {Promise} 校验结果
   */
  verifyEmailCode(code) {
    const url = `/user/verifyEmailCode?code=${encodeURIComponent(code)}`;
    return this.request(url, {
      method: 'POST'
    });
  }

  /**
   * 修改当前用户的信息
   * @param {Object} userData - 用户信息数据
   * @returns {Promise} 修改结果
   */
  updateSelf(userData) {
    return this.request('/user/updateSelf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
  }

  // ========== 系统配置接口 ==========

  /**
   * 获取所有配置项
   * @returns {Promise} 所有配置项
   */
  getAllConfig() {
    return this.request('/config/all', {
      method: 'GET'
    });
  }

  /**
   * 批量保存配置项
   * @param {Object} configData - 配置项对象，key为配置名，value为对象{value,remark}
   * @returns {Promise} 保存结果
   */
  saveConfig(configData) {
    return this.request('/config/save', {
      method: 'POST',
      body: JSON.stringify(configData),
        headers: {
          'Content-Type': 'application/json'
        }
    });
  }

  /**
   * 删除配置项
   * @param {string} key - 配置项key
   * @returns {Promise} 删除结果
   */
  deleteConfig(key) {
    const url = `/config/delete/${encodeURIComponent(key)}`;
    return this.request(url, {
      method: 'DELETE'
    });
  }

  // ========== 版本接口 ==========

  /**
   * 获取服务信息
   * @returns {Promise} 服务信息
   */
  getVersion() {
    return this.request('/unauth/version', {
      method: 'GET'
    });
  }

  // ========== 服务器信息接口 ==========

  /**
   * 获取服务器信息
   * @returns {Promise} 服务器信息
   */
  getServerInfo() {
    return this.request('/server/info', {
      method: 'GET'
    });
  }

  // ========== 聊天消息接口 ==========

  /**
   * 获取比指定ID小的历史消息
   * @param {number} id - 消息ID
   * @returns {Promise} 消息列表
   */
  getMessagesBeforeId(id) {
    const url = `/api/messages/before?id=${encodeURIComponent(id)}`;
    return this.request(url, {
      method: 'GET'
    });
  }

  /**
   * 获取比指定ID大的消息
   * @param {number} id - 消息ID
   * @returns {Promise} 消息列表
   */
  getMessagesAfterId(id) {
    const url = `/api/messages/after?id=${encodeURIComponent(id)}`;
    return this.request(url, {
      method: 'GET'
    });
  }

  // ========== 文件管理接口 ==========

  /**
   * 上传文件
   * @param {File} file - 要上传的文件对象
   * @returns {Promise} 上传结果
   */
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('/file/upload', {
      method: 'POST',
      body: formData,
      // // 覆盖默认的Content-Type头部，让浏览器自动设置multipart/form-data
      // headers: {
      //   // 移除默认的Content-Type，让浏览器自动设置
      // }
    });
  }

  /**
   * 修改文件公开属性
   * @param {number} id - 文件ID
   * @param {boolean} isPublic - 是否公开
   * @returns {Promise} 修改结果
   */
  updateFilePublicStatus(id, isPublic) {
    const url = `/file/${id}/public?isPublic=${encodeURIComponent(isPublic)}`;
    return this.request(url, {
      method: 'POST'
    });
  }

  /**
   * 获取公开文件（无需登录）
   * @param {number} id - 文件ID
   * @returns {Promise} 文件数据
   */
  downloadPublicFile(id) {
    const url = `/file/public/${encodeURIComponent(id)}`;
    return this.request(url, {
      method: 'GET'
    });
  }

  /**
   * 获取文件（需要登录）
   * @param {number} id - 文件ID
   * @returns {Promise} 文件数据
   */
  privateFile(id) {
    const url = `/file/private/${encodeURIComponent(id)}`;
    return this.request(url, {
      method: 'GET'
    });
  }

  /**
   * 获取当前用户上传的文件列表
   * @returns {Promise} 文件列表
   */
  getCurrentUserFiles() {
    return this.request('/file/my-files', {
      method: 'GET'
    });
  }
}

// 创建默认实例
const apiClient = new ApiClient();

// 导出类和默认实例
export default apiClient;
export { ApiClient };