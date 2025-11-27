<template>
    <div class="y-card" :class="cardClass" :style="cardStyle">
        <!-- 加载状态遮罩 -->
        <div v-if="loading" class="y-card__loading">
            <div class="y-loading-spinner"></div>
        </div>
        
        <!-- 卡片头部 -->
        <div v-if="slots.header || title || subtitle" class="y-card__header">
            <slot name="header">
                <div class="y-card__header-content">
                    <h3 v-if="title" class="y-card__title">{{ title }}</h3>
                    <p v-if="subtitle" class="y-card__subtitle">{{ subtitle }}</p>
                    <p v-if="description" class="y-card__description">{{ description }}</p>
                </div>
            </slot>
        </div>
        
        <!-- 卡片主体 -->
        <div class="y-card__body">
            <slot name="default"></slot>
        </div>
        
        <!-- 卡片底部 -->
        <div v-if="slots.footer" class="y-card__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';

defineOptions({ name: 'y-card' });

const slots = useSlots();
const props = defineProps({
    // 标题相关
    title: String,
    subtitle: String,
    description: String,
    
    // 状态控制
    loading: {
        type: Boolean,
        default: false
    },
    
    // 样式控制
    border: {
        type: Boolean,
        default: true
    },
    
    // 阴影控制
    shadow: {
        type: String,
        default: 'hover',
        validator: val => ['always', 'never', 'hover'].includes(val)
    },
    
    // 尺寸控制
    size: {
        type: String,
        default: 'md',
        validator: val => ['sm', 'md', 'lg'].includes(val)
    },
    
    // 间距控制
    padding: {
        type: String,
        default: 'md',
        validator: val => ['none', 'sm', 'md', 'lg'].includes(val)
    },
    
    // 圆角控制
    rounded: {
        type: String,
        default: 'lg',
        validator: val => ['none', 'sm', 'md', 'lg', 'xl', 'full'].includes(val)
    },
    
    // 自定义类名
    class: {
        type: String,
        default: ''
    },
    
    // 自定义样式
    style: {
        type: [String, Object],
        default: ''
    }
});

const emit = defineEmits(['']);

// 计算卡片类名
const cardClass = computed(() => {
    const classes = [
        'y-card',
        'bg-bg-primary',
        'transition-shadow',
        'duration-200'
    ];
    
    // 尺寸类名
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };
    classes.push(sizeClasses[props.size] || sizeClasses.md);
    
    // 内边距类名
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4', 
        lg: 'p-6'
    };
    classes.push(paddingClasses[props.padding] || paddingClasses.md);
    
    // 圆角类名
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md', 
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };
    classes.push(roundedClasses[props.rounded] || roundedClasses.lg);
    
    // 边框控制
    if (props.border) {
        classes.push('border', 'border-border-light');
    } else {
        classes.push('border-0');
    }
    
    // 阴影控制
    const shadowClasses = {
        always: 'shadow-md',
        never: '',
        hover: 'hover:shadow-lg'
    };
    classes.push(shadowClasses[props.shadow] || shadowClasses.hover);
    
    // 加载状态
    if (props.loading) {
        classes.push('relative', 'overflow-hidden');
    }
    
    // 自定义类名
    if (props.class) {
        classes.push(props.class);
    }
    
    return classes;
});

// 计算卡片样式
const cardStyle = computed(() => {
    const styles = [];
    
    // 处理自定义样式
    if (props.style) {
        if (typeof props.style === 'string') {
            styles.push(props.style);
        } else if (typeof props.style === 'object') {
            Object.entries(props.style).forEach(([key, value]) => {
                styles.push(`${key}: ${value}`);
            });
        }
    }
    
    return styles.join(';');
});
</script>

<style scoped>
/* 卡片基础样式增强 */
.y-card {
    display: block;
    position: relative;
    overflow: hidden;
}

/* 卡片头部样式 */
.y-card__header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--y-border-light);
}

.y-card__header-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.y-card__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--y-text-primary);
}

.y-card__subtitle {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--y-text-secondary);
}

.y-card__description {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--y-text-tertiary);
}

/* 卡片主体样式 */
.y-card__body {
    flex: 1;
}

/* 卡片底部样式 */
.y-card__footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--y-border-light);
}

/* 加载状态样式 */
.y-card__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    backdrop-filter: blur(2px);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
    .y-card__loading {
        background-color: rgba(0, 0, 0, 0.8);
    }
}

/* 响应式适配 */
@media (max-width: 768px) {
    .y-card__header,
    .y-card__footer {
        margin-bottom: 12px;
        margin-top: 12px;
        padding-bottom: 8px;
        padding-top: 8px;
    }
    
    .y-card__title {
        font-size: 16px;
    }
}

/* 动画增强 */
.y-card {
    transition: all 0.2s ease-in-out;
}

.y-card:hover {
    transform: translateY(-1px);
}

/* 焦点状态 */
.y-card:focus-visible {
    outline: 2px solid var(--y-primary);
    outline-offset: 2px;
}
</style>