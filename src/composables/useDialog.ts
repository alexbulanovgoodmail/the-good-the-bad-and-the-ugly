import type { ModalSlot } from 'vue-final-modal'
import type { Component } from 'vue'
import { useModal, useModalSlot, useVfm } from 'vue-final-modal'
import AppModal from '@/components/AppModal.vue'

interface ModalConfig {
	component?: Component
	modalProps?: Record<string, unknown>
	componentProps?: Record<string, unknown>
}

export const useDialog = () => {
	const { closeAll } = useVfm()

	const openModal = async (config?: ModalConfig) => {
		const slots: { [key: string]: ModalSlot | undefined } = {}

		if (config?.component) {
			slots.default = useModalSlot({
				component: config.component,
				attrs: config.componentProps || {}
			})
		}

		const { open } = useModal({
			component: AppModal,
			attrs: {
				modalProps: config?.modalProps
			},
			slots
		})

		await closeAll()
		await open()
	}

	return {
		closeAll,
		openModal
	}
}
