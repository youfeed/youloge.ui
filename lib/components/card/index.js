/**
 * 卡片组件
 * 采用 Github风格
 */
import yCard from './card.vue';
yCard.install = app => {
    app.component('y-card', yCard);
};
export default yCard;