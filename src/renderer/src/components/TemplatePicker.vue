<template>
	<div class="h-full bg-gray-100">
		<div class="h-full">
			<div class="h-full flex flex-col">
				<div class="min-h-0 flex-1 flex">
						<splitpanes class="default-theme">
							<pane size="30"  min-size="20" max-size="50">
									<div class="h-full relative flex flex-col border-r border-gray-200 bg-gray-100">
										<div>
											<!--Sorted-->
											<div class="border-b border-gray-200 bg-gray-50"></div>
										</div>
					  				<nav aria-label="Message list" class="overflow-y-auto">
											<ul role="list" class="border-b border-gray-200 divide-y divide-gray-200">
												<li v-for="template in templates" :key="template.id" class="relative bg-white py-5 px-6 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600">
													<div class="flex justify-between space-x-3">
														<div class="min-w-0 flex-1">
															<a :href="template.href" @click="setTemplatePreview(template)" class="block focus:outline-none">
																<span class="absolute inset-0" aria-hidden="true" />
																<p class="text-sm font-medium text-gray-900 truncate">{{ template.name }}</p>
<!--																<p class="text-sm text-gray-500 truncate">{{ template.subject }}</p>-->
															</a>
														</div>
														<time :datetime="template.datetime" class="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">{{ template.date }}</time>
													</div>
													<div class="mt-1">
														<p class="line-clamp-2 text-sm text-gray-600" v-html="template.description"/>
													</div>
												</li>

											</ul>
										</nav>
									</div>
							</pane>
							<pane min-size="50" max-size="80">
				  			<section aria-labelledby="template-heading" class="min-w-0 flex-1 h-full flex flex-col">
									<div class="min-h-0 flex-1 overflow-y-auto">
										<div class="bg-white pt-5 pb-6 shadow">
											<div class="px-4 sm:flex sm:justify-between sm:items-baseline sm:px-6 lg:px-8">
												<div class="sm:w-0 sm:flex-1">
													<h1 id="template-heading" class="text-lg font-medium text-gray-900">
														{{ selectedTemplate.name }}
													</h1>
													<p class="mt-1 text-sm text-gray-500 truncate">
														{{ selectedTemplate.description }}
													</p>
												</div>

												<div class="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
													<div class="ml-3 relative inline-block text-left">
														<div>
															<a :href="selectedTemplate.github" target="_blank" class="-my-2 p-2 rounded-full bg-white flex items-center text-gray-400 hover:text-minerva-purple">
																<span class="sr-only">Open options</span>
																	<svg role="img" class="h-5 w-5" aria-hidden="true"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
															</a>
														</div>
													</div>
												</div>
											</div>
										</div>
										<!-- Thread section-->
										<div class="m-4">
											<div class="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6">
												<div class="mt-4 text-sm text-gray-800">
														<p class="markdown-body" v-html="setTemplatePreview(selectedTemplate)"></p>
												</div>
											</div>
										</div>
									</div>
								</section>
							</pane>
						</splitpanes>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MD_TEMPLATES from "../templates";
import PreviewService from "../services/preview.service";

import {
	Dialog,
	DialogOverlay,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';

import {
	ArchiveIcon as ArchiveIconSolid,
	ChevronDownIcon,
	ChevronUpIcon,
	DotsVerticalIcon,
	FolderDownloadIcon,
	PencilIcon,
	ReplyIcon,
	SearchIcon,
	UserAddIcon,
} from '@heroicons/vue/solid';

import {
	ArchiveIcon as ArchiveIconOutline,
	BanIcon,
	BellIcon,
	FlagIcon,
	InboxIcon,
	MenuIcon,
	PencilAltIcon,
	UserCircleIcon,
	XIcon,
	BookmarkAltIcon,
	CalendarIcon,
	ShieldCheckIcon,
	SupportIcon
} from '@heroicons/vue/outline';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

const templates = [
	{
			id: 1,
			icon: BookmarkAltIcon,
			name: 'Simple README (Default)',
			creator: '@othneildrew',
			github: 'https://github.com/othneildrew/Best-README-Template',
			href: '#',
			md: MD_TEMPLATES.README_DEFAULT,
			preview: 'Template 1',
			description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 2,
		name: '',
		icon: CalendarIcon,
	  creator: '@othneildrew',
	  github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
	  md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 2',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 3,
		name: '',
		icon: ShieldCheckIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 3',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 4,
		name: '',
	  icon: CalendarIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 4',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 5,
		name: '',
	  icon: ShieldCheckIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 5',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 6,
		name: '',
	  icon: ShieldCheckIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 6',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 7,
		name: '',
	  icon: ShieldCheckIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 7',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 8,
		name: '',
	  icon: CalendarIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 8',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 9,
		name: '',
	  icon: ShieldCheckIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 9',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
	{
		id: 10,
		name: '',
	  icon: CalendarIcon,
		creator: '@othneildrew',
		github: 'https://github.com/othneildrew/Best-README-Template',
		href: '#',
		md: MD_TEMPLATES.README_ADVANCED,
		preview: 'Template 10',
	  description: 'Compater de magnum victrix, perdere axona! Sunt fortises promissio clemens, mirabilis castores. Est castus zelus, cesaris.'
	},
];

export default {
	components: {
		Dialog,
		DialogOverlay,
		Menu,
		MenuButton,
		MenuItem,
		MenuItems,
		TransitionChild,
		TransitionRoot,
		ArchiveIconSolid,
		BellIcon,
		ChevronDownIcon,
		ChevronUpIcon,
		DotsVerticalIcon,
		FolderDownloadIcon,
		MenuIcon,
		PencilIcon,
		ReplyIcon,
		SearchIcon,
		UserAddIcon,
		XIcon,
	  BookmarkAltIcon,
	  CalendarIcon,
	  ShieldCheckIcon,
	  SupportIcon,
	  Pane,
		Splitpanes
	},
	setup() {
		return {
			templates
		}
	},

	data() {
		return {
			selectedTemplate: templates[0]
		}
	},
	methods: {
		setTemplatePreview(selectedTemplate) {
			this.selectedTemplate = selectedTemplate;
			return PreviewService.generatePreview(this.selectedTemplate.md);
		}
	}
}
</script>

<style>
@import '../css/github-markdown.css';
</style>
