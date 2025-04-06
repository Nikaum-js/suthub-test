<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}{{ required ? '*' : '' }}
    </label>
    <div class="mt-1" :class="{ 'flex': hasButton, 'relative': hasPrefix }">
      <div v-if="hasPrefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm">{{ prefix }}</span>
      </div>
      
      <slot name="field" :error-class="{'border-red-500': error || errorMessage}">
        <input
          v-if="!isSelect"
          :id="id"
          :name="name || id"
          :type="type"
          :required="required"
          :maxlength="maxlength"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value); $emit('input', $event)"
          @blur="onBlur"
          :class="[
            {'border-red-500': error || errorMessage},
            {'pl-10': hasPrefix},
            'custom-placeholder appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          ]"
          v-bind="$attrs"
        />
        <select
          v-else
          :id="id"
          :name="name || id"
          :required="required"
          :disabled="disabled"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          @blur="onBlur"
          :class="[
            {'border-red-500': error || errorMessage},
            'custom-placeholder appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          ]"
          v-bind="$attrs"
        >
          <slot></slot>
        </select>
      </slot>
      
      <slot name="button"></slot>
    </div>
    <p v-if="errorMessage || error" class="mt-1 text-sm text-red-600">{{ errorMessage || error }}</p>
    <p v-else-if="helpText" class="mt-1 text-sm text-gray-600">{{ helpText }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'FormField',
  props: {
    id: { type: String, required: true },
    name: { type: String, default: null },
    label: { type: String, required: true },
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    error: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    maxlength: { type: String, default: undefined },
    min: { type: [String, Number], default: undefined },
    max: { type: [String, Number], default: undefined },
    step: { type: [String, Number], default: undefined },
    disabled: { type: Boolean, default: false },
    prefix: { type: String, default: '' },
    helpText: { type: String, default: '' },
    isSelect: { type: Boolean, default: false },
    hasButton: { type: Boolean, default: false },
    validateField: { type: Function, default: null },
  },
  emits: ['update:modelValue', 'input', 'blur'],
  setup(props, { emit }) {
    const hasPrefix = computed(() => !!props.prefix)
    
    const onBlur = (event: Event) => {
      if (props.validateField) {
        props.validateField()
      }
      emit('blur', event)
    }
    
    return {
      hasPrefix,
      onBlur
    }
  }
})
</script>

<style>
.custom-placeholder::placeholder {
  color: oklch(70.7% 0.022 261.325);
}
</style>