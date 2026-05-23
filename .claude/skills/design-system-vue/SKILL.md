---
name: design-system-vue
description: |
  基于Figma设计系统生成Vue 3组件和原型的技能。当用户需要以下帮助时使用：
  1. 从Figma设计稿生成符合设计规范的Vue组件和页面原型
  2. 产品经理快速生成高保真页面原型，无需写代码
  3. 设计师验证实现是否与设计规范对齐
  4. 生成可直接使用的Vue组件代码，包含设计令牌
  5. 确保生成的界面严格遵循公司设计规范（颜色、间距、字体、圆角）
  需要Figma MCP服务器已连接。
---

# 🎨 Design System Vue Skill - 完整使用指南

## 📋 前置条件

- **Figma MCP服务器必须已连接**（你已经在终端配置好了！）
- 用户需提供Figma链接：`https://figma.com/design/:fileKey/:fileName?node-id=节点ID`
- 或使用Figma桌面版时直接选中节点（无需链接）

## 🚀 核心工作流（6步法）

### 步骤1：获取设计数据

当用户提供Figma链接时，提取关键信息：

| 参数 | 说明 | 示例 |
| :--- | :--- | :--- |
| **fileKey** | 文件唯一标识 | `HQFmiqvskukzAAKbiB1sla` |
| **nodeId** | 节点ID | `54-587` |

### 步骤2：读取设计系统令牌

#### 🎨 颜色系统
从Figma中读取颜色变量，使用以下CSS变量名：

| 设计令牌 | 用途 | 使用场景 |
| :--- | :--- | :--- |
| `--color-primary-600` | 品牌主色 | 主要按钮、品牌标识、链接 |
| `--color-primary-100` | 品牌浅色 | 选中背景、提示背景 |
| `--color-success-500` | 成功色 | 成功状态、完成提示 |
| `--color-warning-500` | 警告色 | 警告状态、待处理标识 |
| `--color-error-500` | 错误色 | 错误状态、删除操作 |

**重要规则**：⚠️ **禁止硬编码色值**，必须使用从Figma读取的CSS变量。

#### 📏 间距系统（4px网格）
| 设计令牌 | 值 | 使用场景 |
| :--- | :--- | :--- |
| `--spacing-1` | 4px | 紧凑元素间距 |
| `--spacing-2` | 8px | 按钮内文字与图标间距 |
| `--spacing-3` | 12px | 表单标签与输入框间距 |
| `--spacing-4` | 16px | 卡片内边距 |
| `--spacing-6` | 24px | 区块间距 |
| `--spacing-8` | 32px | 大区块间距 |
| `--spacing-10` | 40px | 按钮高度、输入框高度 |

#### ✍️ 字体系统
| 设计令牌 | 字号 | 使用场景 | 字重 |
| :--- | :--- | :--- | :--- |
| `--font-size-xs` | 12px | 辅助文字、标签 | Regular |
| `--font-size-sm` | 14px | 正文、表格内容 | Regular |
| `--font-size-base` | 16px | 卡片标题、输入框 | Medium |
| `--font-size-lg` | 18px | 小标题 | Medium |
| `--font-size-xl` | 20px | 二级标题 | Semibold |
| `--font-size-2xl` | 24px | 一级标题 | Semibold |

#### 🔘 圆角系统
| 设计令牌 | 值 | 使用场景 |
| :--- | :--- | :--- |
| `--radius-sm` | 4px | 按钮、输入框 |
| `--radius-md` | 8px | 卡片 |
| `--radius-lg` | 12px | 弹窗 |
| `--radius-full` | 50% | 圆形元素 |

### 步骤3：识别核心组件规范

#### 按钮 (Button)
| 属性 | 规范 |
| :--- | :--- |
| **尺寸** | small: 32px / medium: 40px / large: 48px |
| **内边距** | small: 12px / medium: 16px / large: 20px |
| **圆角** | `--radius-sm` (4px) |
| **主要按钮** | `--color-primary-600` 背景 + 白色文字 |
| **次要按钮** | 白色背景 + `--color-gray-300` 边框 + `--color-gray-700` 文字 |
| **危险按钮** | `--color-error-500` 背景 + 白色文字 |

#### 输入框 (Input)
| 属性 | 规范 |
| :--- | :--- |
| **高度** | `--spacing-10` (40px) |
| **内边距** | `--spacing-3` (12px) `--spacing-4` (16px) |
| **圆角** | `--radius-sm` (4px) |

### 步骤4：生成Vue组件代码

#### Vue按钮组件示例

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--disabled': disabled }]"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.btn--medium {
  height: var(--spacing-10, 40px);
  padding: 0 var(--spacing-4);
  font-size: var(--font-size-base);
}

.btn--primary {
  background-color: var(--color-primary-600);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-700);
}

.btn--danger {
  background-color: var(--color-error-500);
  color: white;
}
</style>