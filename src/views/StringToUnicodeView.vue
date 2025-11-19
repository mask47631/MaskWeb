<script setup>
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')
const conversionMode = ref('ascii') // 默认保留ASCII

// 转换函数
function stringToUnicode(str, mode) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    
    // 根据模式决定是否转换
    if (mode === 'ascii' && charCode < 128) {
      // 保留ASCII字符
      result += str.charAt(i)
    } else if (mode === 'latin1' && charCode < 256) {
      // 保留Latin1字符
      result += str.charAt(i)
    } else {
      // 转换为Unicode
      const hexCode = charCode.toString(16).padStart(4, '0')
      result += '\\u' + hexCode
    }
  }
  return result
}

// 反向转换函数
function unicodeToString(str) {
  // 匹配 \uXXXX 格式的Unicode编码
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    const charCode = parseInt(hex, 16)
    return String.fromCharCode(charCode)
  })
}

function handleStringToUnicode() {
  outputText.value = stringToUnicode(inputText.value, conversionMode.value)
}

function handleUnicodeToString() {
  outputText.value = unicodeToString(inputText.value)
}

// 清空输入和输出
function clearAll() {
  inputText.value = ''
  outputText.value = ''
}

// 交换输入和输出
function swapText() {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}
</script>

<template>
<div class="stu-view">
  <div class="container">
    <h2>字符串 ↔ Unicode 转换器</h2>
    
    <div class="input-section">
      <div class="section-header">
        <label for="input-text">输入内容</label>
      </div>
      <textarea 
        id="input-text"
        v-model="inputText" 
        placeholder="请输入要转换的文本...">
      </textarea>
    </div>
    
    <div class="controls">
      <div class="mode-selector">
        <label for="conversion-mode">转换模式:</label>
        <select id="conversion-mode" v-model="conversionMode">
          <option value="ascii">保留ASCII</option>
          <option value="latin1">保留Latin1</option>
          <option value="none">不保留</option>
        </select>
      </div>
      
      <div class="buttons">
        <button class="btn primary" @click="handleStringToUnicode">
          字符串 → Unicode
        </button>
        <button class="btn primary" @click="handleUnicodeToString">
          Unicode → 字符串
        </button>
        <button class="btn secondary" @click="swapText">
          交换
        </button>
        <button class="btn danger" @click="clearAll">
          清空
        </button>
      </div>
    </div>
    
    <div class="output-section">
      <div class="section-header">
        <label for="output-text">转换结果</label>
      </div>
      <textarea 
        id="output-text"
        v-model="outputText" 
        placeholder="转换结果将显示在这里...">
      </textarea>
    </div>
  </div>
</div>
</template>

<style scoped>
.stu-view {
  height: 100%;
  width: 100%;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 1.25rem;
}

.container {
  width: 100%;
  background: white;
  border-radius: 0.625rem;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2);
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

h2 {
  text-align: center;
  color: #333;
  margin-top: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.section-header {
  margin-bottom: 0.625rem;
}

.section-header label {
  font-weight: bold;
  color: #555;
  font-size: 1.1rem;
}

textarea {
  width: 100%;
  min-height: 7.5rem;
  padding: 0.9375rem;
  border: 0.125rem solid #ddd;
  border-radius: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  flex: 1;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 0.125rem rgba(102, 126, 234, 0.2);
}

.mode-selector {
  display: flex;
  align-items: center;
  gap: 0.9375rem;
  margin: 0.9375rem 0;
  padding: 0.9375rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.mode-selector label {
  font-weight: bold;
  color: #555;
}

.mode-selector select {
  padding: 0.625rem 0.9375rem;
  border: 0.125rem solid #ddd;
  border-radius: 0.375rem;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.mode-selector select:focus {
  outline: none;
  border-color: #667eea;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.9375rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 7.5rem;
}

.btn:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn.secondary {
  background: #6c757d;
  color: white;
}

.btn.danger {
  background: #dc3545;
  color: white;
}

.input-section, .output-section {
  display: flex;
  flex-direction: column;
  flex: 1;
}

@media (max-width: 37.5rem) {
  .container {
    padding: 0.9375rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .mode-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
  }
}
</style>