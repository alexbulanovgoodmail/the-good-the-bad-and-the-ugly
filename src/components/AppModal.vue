<script setup lang="ts">
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

interface Props {
  modalProps?: Record<string, unknown>
}

defineProps<Props>()
const slots = defineSlots()
const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'onClosed'): void
}>()

const contentTransition = ref<string>('vfm-slide-in')

const handleBeforeOpen = (): void => {
  const bodyElement: HTMLElement = document.querySelector(
    'body',
  ) as HTMLBodyElement
  const lockPaddingOffset: number = window.innerWidth - bodyElement.offsetWidth

  const matches: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('.lock-padding')

  if (matches.length > 0) {
    matches.forEach(elem => {
      elem.style.paddingRight = `${lockPaddingOffset}px`
    })
  }
}

const handleClosed = (): void => {
  const matches: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('.lock-padding')
  if (matches.length > 0) {
    matches.forEach(elem => {
      elem.style.paddingRight = ''
    })
  }
}
</script>

<template>
  <VueFinalModal
    class="modal final-modal"
    overlay-class="modal__overlay"
    :click-to-close="false"
    :esc-to-close="false"
    :content-class="[
      'modal__content',
      {
        'without-content': !slots.default,
        'always-on-top': modalProps?.alwaysOnTop,
      },
    ]"
    :overlay-transition="'vfm-fade'"
    :content-transition="contentTransition"
    @before-open="handleBeforeOpen"
    @closed="handleClosed"
    @update:model-value="(val: boolean) => emits('update:modelValue', val)"
  >
    <template
      v-if="
        (modalProps && modalProps.title) ||
        (modalProps && modalProps.description)
      "
    >
      <div v-if="modalProps.title" class="modal__header">
        <span class="modal__title">
          {{ modalProps.title }}
        </span>
      </div>
      <div v-if="modalProps.description" class="modal__description">
        <span class="modal__text">
          {{ modalProps.description }}
        </span>
      </div>
    </template>

    <template v-if="$slots.default">
      <div class="modal__slot">
        <slot />
      </div>
    </template>
  </VueFinalModal>
</template>

<style lang="scss">
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0 0;

  &:has(.always-on-top) {
    align-items: self-start;
    justify-content: center;
    padding: 0 0 16px;
  }

  @media screen and (min-width: $sm) {
    align-items: center;
    padding: 16px;
  }

  @media screen and (min-width: $md) {
    padding: 32px;
  }

  &__overlay {
    background-color: transparent;
  }

  &__header {
    text-align: center;
  }

  &__header:not(:last-child) {
    margin-bottom: 24px;
  }

  &__title {
    font-size: 32px;
  }

  &__description {
    text-wrap: pretty;
    text-align: center;
  }

  &__description:not(:last-child) {
    margin-bottom: 24px;
  }

  &__content {
    position: relative;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    padding: 32px 16px 24px;
    overflow: hidden auto;

    @media screen and (min-width: $sm) {
      max-width: $xs;
      padding: 32px 16px;
    }

    @media screen and (min-width: $md) {
      max-width: $md;
      padding: 32px 16px;
    }

    @media screen and (min-width: $lg) {
      padding: 32px;
    }
  }

  &__slot {
    text-align: center;
  }

  &:has(.always-on-top) &__close {
    display: none;
  }

  &:has(.always-on-top) &__content {
    max-width: calc(1280px - 64px);
  }

  /*
		&__content.without-content {
			min-height: 100px;

			@media screen and (min-width: $sm) {
				min-height: 150px;
			}

			@media screen and (min-width: $lg) {
				min-height: 300px;
			}
		}
	*/

  &__content.always-on-top {
    border-radius: 0;
    overflow: hidden;
  }
}
</style>
