<template>
    <div class="y-input">
        <input type="text" id="input" placeholder=""/>
        <label for="input">Label for input</label>
    </div>
</template>

<script setup>
import { computed, reactive, toRefs, inject } from 'vue'
const props = defineProps({
    form: {
        type: String,
        default: '23',
    },
    name: {
        type: String,
        default: '',
        required: true,
    },
    options: {
        type: Array,
        required: true,
        default: [],
    }
}), emits = defineEmits(['change']);
</script>

<style lang="scss">
    .y-input  {
        position: relative;
        input {
            padding: 6px 4px;
            border: 1px solid #ccc;
            width: 100%;
            border-radius: 4px;
            &:focus {
                outline: none;
                border-color: blue;
                color: blue;
            }
            &:focus+label{
                color: blue;
            }
            &:not(:placeholder-shown) + label,
            &:not(:placeholder-shown)+label {
                transform: translate(1em, -2.3em);
                font-size: 0.8em; 
                background-color: #fff;
            }
        }
        label {
            position: absolute;
            top: 50%;
            left: 5px;
            font-size: 1em;
            transform: translateY(-50%);
            transition: all 0.3s ease;
            pointer-events: none;
        }
    }
    // input:placeholder-shown + label {
    //   color: gray;
    //   transform: translateY(50%);
    // }
    // input:not(:placeholder-shown) + label {
    //   color: blue;
    //   transform: translateY(-20px);
    //   font-size: 0.8em;
    // }
</style>