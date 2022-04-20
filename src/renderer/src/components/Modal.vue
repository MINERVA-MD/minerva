<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal">
			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="min-h-screen px-4 text-center">
					<TransitionChild
							as="template"
							enter="duration-300 ease-out"
							enter-from="opacity-0"
							enter-to="opacity-100"
							leave="duration-200 ease-in"
							leave-from="opacity-100"
							leave-to="opacity-0"
					>
			     <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</TransitionChild>

					<span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

					<TransitionChild
							as="template"
							enter="duration-300 ease-out"
							enter-from="opacity-0 scale-95"
							enter-to="opacity-100 scale-100"
							leave="duration-200 ease-in"
							leave-from="opacity-100 scale-100"
							leave-to="opacity-0 scale-95"
					>
						<div
								class="inline-block w-full max-w-7xl h-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
						>
							<div class="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
								<div>
									<button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-opacity-60 bg-minerva-purple text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-minerva-purple sm:ml-3 sm:w-auto sm:text-sm" @click="closeModal">Use Selected Template</button>
									<button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-minerva-purple sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="closeModal" ref="cancelButtonRef">Cancel</button>
								</div>
								<h1 class="text-2xl font-bold text-gray-900">Markdown Templates</h1>
							</div>
							<div class="mt-2">
								<slot></slot>
							</div>
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay,
	DialogTitle,
} from '@headlessui/vue'

const isOpen = ref(true)

function closeModal() {
	isOpen.value = false
}
function openModal() {
	isOpen.value = true
}
</script>
