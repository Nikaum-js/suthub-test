<template>
  <div class="min-h-screen bg-gray-50">
    <div class="fixed inset-0 flex z-40 lg:hidden" role="dialog" aria-modal="true" v-if="sidebarOpen">
      <div 
        class="fixed inset-0 bg-gray-800/70 backdrop-blur-sm transition-opacity duration-300" 
        @click="sidebarOpen = false"
      ></div>
      
      <div class="relative flex-1 flex flex-col max-w-xs w-full transform transition-all duration-300 ease-in-out translate-x-0">
        <div 
          class="h-full rounded-r-2xl shadow-2xl overflow-y-auto bg-gradient-to-br from-indigo-600 to-purple-700"
        >
          <div class="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              class="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
              @click="sidebarOpen = false"
            >
              <span class="sr-only">Fechar sidebar</span>
              <XIcon class="h-5 w-5 text-white" />
            </button>
          </div>
          
          <div class="pt-6 pb-4">
            <div class="flex-shrink-0 flex items-center px-6 mb-8">
              <div class="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                <LayoutGridIcon class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-white text-xl font-bold ml-3">Suthub Teste</h1>
            </div>
            
            <div class="px-4">
              <p class="text-xs font-medium text-indigo-100/70 uppercase tracking-wider px-3 mb-3">
                Menu
              </p>
              <nav class="space-y-1.5">
                <NuxtLink
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.href"
                  :class="[
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-lg shadow-indigo-900/20'
                      : 'text-indigo-100 hover:bg-white/10',
                    'group flex items-center px-3 py-2.5 text-base font-medium rounded-xl transition duration-200'
                  ]"
                >
                  <component 
                    :is="item.icon" 
                    class="h-6 w-6 mr-3"
                    :class="[isActive(item.href) ? 'text-white' : 'text-indigo-200 group-hover:text-white', 'transition duration-200']" 
                  />
                  {{ item.name }}
                </NuxtLink>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto bg-gradient-to-br from-indigo-600 to-purple-700">
          <div class="flex-shrink-0 flex items-center px-6 mb-8">
            <div class="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <LayoutGridIcon class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-white text-xl font-bold ml-3">Suthub Teste</h1>
          </div>
          
          <div class="px-4 flex-1 flex flex-col justify-between">
            <div>
              <p class="text-xs font-medium text-indigo-100/70 uppercase tracking-wider px-3 mb-3">
                Menu
              </p>
              <nav class="space-y-1.5">
                <NuxtLink
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.href"
                  :class="[
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-lg shadow-indigo-900/20'
                      : 'text-indigo-100 hover:bg-white/10',
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition duration-200'
                  ]"
                >
                  <component 
                    :is="item.icon" 
                    class="h-5 w-5 mr-3"
                    :class="[isActive(item.href) ? 'text-white' : 'text-indigo-200 group-hover:text-white', 'transition duration-200']" 
                  />
                  {{ item.name }}
                </NuxtLink>
              </nav>
            </div>
            
            <div class="mt-auto px-3">
              <div class="flex items-center p-3 bg-black/10 rounded-xl mt-8 mb-4">
                <img
                  class="h-9 w-9 rounded-full bg-indigo-300"
                  src="https://avatars.githubusercontent.com/u/62979208?v=4"
                  alt="Avatar do usuário"
                />
                <div class="ml-3">
                  <p class="text-sm font-medium text-white">Nikolas Santana</p>
                  <p class="text-xs text-indigo-200">Nikolas@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:pl-72 flex flex-col flex-1">
      <header class="sticky top-0 z-10 lg:hidden bg-white shadow-sm">
        <div class="flex items-center justify-between h-16 px-4">
          <button
            type="button"
            class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="sidebarOpen = true"
          >
            <span class="sr-only">Abrir sidebar</span>
            <MenuIcon class="h-6 w-6" />
          </button>
          
          <div class="flex items-center">
            <LayoutGridIcon class="w-8 h-8 text-indigo-600" />
            <h1 class="text-lg font-bold text-gray-900 ml-2">Suthub Teste</h1>
          </div>
          
          <div class="w-10"></div>
        </div>
      </header>

      <main class="flex-1 py-6 px-4  sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { 
  ClipboardPlus,
  Utensils, 
  Users, 
  X as XIcon, 
  Menu as MenuIcon,
  LayoutGrid as LayoutGridIcon 
} from 'lucide-vue-next';

const route = useRoute();
const sidebarOpen = ref(false);

const navigation = [
  {
    name: 'Cadastro',
    href: '/',
    icon: ClipboardPlus
  },
  {
    name: 'Receitas',
    href: '/recipes',
    icon: Utensils
  },
  {
    name: 'Usuários',
    href: '/users',
    icon: Users
  }
];

const isActive = (path) => {
  return route.path === path;
};
</script>