<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-opacity-25 backdrop-blur-xs" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel 
              class="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              :class="[maxWidth]"
            >
              <div v-if="showIcon" class="flex justify-center mb-4">
                <slot name="icon">
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Check class="h-6 w-6 text-green-600" />
                  </div>
                </slot>
              </div>
              
              <DialogTitle as="h3" :class="[titleCenter ? 'text-center' : '', 'text-lg font-medium leading-6 text-gray-900']">
                {{ title }}
              </DialogTitle>
              
              <div class="mt-2">
                <slot>
                  <p :class="[contentCenter ? 'text-center' : '', 'text-sm text-gray-500']">
                    {{ content }}
                  </p>
                </slot>
              </div>

              <div :class="[buttonCenter ? 'justify-center' : 'justify-end', 'mt-4 flex']">
                <slot name="footer">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    @click="$emit('close')"
                  >
                    {{ buttonText }}
                  </button>
                </slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot 
} from '@headlessui/vue';
import { Check } from 'lucide-vue-next';

const ModalComponent = defineComponent({
  name: 'ModalDialog',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    Check
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Fechar'
    },
    maxWidth: {
      type: String,
      default: 'max-w-md'
    },
    titleCenter: {
      type: Boolean,
      default: false
    },
    contentCenter: {
      type: Boolean,
      default: false
    },
    buttonCenter: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup() {
    return {}
  }
});

export default ModalComponent;
</script>