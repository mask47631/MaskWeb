import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取 __dirname 等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取命令行参数
const args = process.argv.slice(2);
let version = null;

console.log('参数:', args)
// 解析参数
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--version' || args[i] === '-v') {
    version = args[i + 1];
    i++; // 跳过下一个参数，因为它是版本号
  }
}

if (!version) {
  console.error('错误: 请提供版本号，例如: node build.js --version 1.0.0');
  process.exit(1);
}

// 读取 package.json 文件
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 更新版本号
console.log(`正在将版本号从 ${packageJson.version} 更新为 ${version}`);
packageJson.version = version;

// 写入更新后的 package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('package.json 版本号更新完成');

// 执行打包命令
try {
  console.log('开始执行打包...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('打包完成!');
} catch (error) {
  console.error('打包过程中出现错误:', error.message);
  process.exit(1);
}