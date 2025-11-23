<template>
    <div class="flex flex-col gap-4 p-6">
        <!-- 基础按钮 -->
        <y-button type="primary" size="md">主要按钮</y-button>
        
        <!-- 不同尺寸 -->
        <div class="flex gap-2 items-center">
            <y-button type="default" size="sm">小按钮</y-button>
            <y-button type="success" size="md">中按钮</y-button>
            <y-button type="warning" size="lg">大按钮</y-button>
        </div>
        
        <!-- 不同形状 -->
        <div class="flex gap-2 items-center">
            <y-button type="primary" rounded="sm">小圆角</y-button>
            <y-button type="primary" rounded="lg">大圆角</y-button>
            <y-button type="primary" rounded="full">圆形</y-button>
        </div>
        
        <!-- 不同状态 -->
        <div class="flex gap-2 items-center">
            <y-button type="primary" disabled>禁用</y-button>
            <y-button type="primary" loading>加载中</y-button>
            <y-button type="ghost" no-hover>无Hover</y-button>
        </div>
        
        <!-- 块级按钮 -->
        <y-button type="primary" block>块级按钮</y-button>
        
        <!-- 带图标 -->
        <y-button type="outline">
            <template #icon>📎</template>
            带图标按钮
        </y-button>
        
        <!-- 响应式示例 -->
        <y-button class="w-full md:w-auto" type="accent">
            响应式宽度
        </y-button>
    </div>
</template>