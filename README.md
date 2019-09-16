# vue-typescript-webpack4

从零搭建 vue 脚手架

## UI 组件使用

| achor | 组件名       | component  |
| ----- | ------------ | ---------- |
| 1     | 无占位滚动条 | scroll-bar |
| 2     | 滚动条       | bar        |

---

## Usage

### 1 scroll-bar

#### Prop

| 参数      | 说明                             | 类型         | 可选值 | 默认值 |
| --------- | -------------------------------- | ------------ | ------ | ------ |
| tag       | 内容区元素标签类型               | string       | -      | 'div'  |
| viewClass | 内容区类名                       | array/object | -      | -      |
| viewStyle | 内容区样式                       | array/object | -      | -      |
| wrapStyle | （内容区+滚动区）的父容器        | object       | -      | -      |
| wrapClass | （内容区+滚动区）的样式          | object       | -      | -      |
| native    | 是否使用原生自带 scroll          | boolean      | -      | false  |
| noresize  | 内容区无变化（滚动条不影响宽度） | boolean      | -      | false  |

---

```Vue
 <scroll-bar>
    <div class="test-height">
      hello world
    </div>
 </scroll-bar>
```
