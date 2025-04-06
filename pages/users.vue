<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 class="text-3xl font-bold text-gray-800">Lista de Usuários</h1>
          
          <div class="relative w-full md:w-96">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar por nome"
              class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
            <button 
              v-if="searchQuery"
              @click="clearSearch" 
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="searchQuery && !isLoading" class="mb-4 px-2">
        <p class="text-sm text-gray-600">
          <span v-if="users.length > 0">
            {{ users.length }} resultado(s) encontrado(s) para "{{ searchQuery }}"
          </span>
          <span v-else>
            Nenhum resultado encontrado para "{{ searchQuery }}"
            <button @click="clearSearch" class="text-indigo-600 hover:text-indigo-800 underline ml-2">
              Limpar busca
            </button>
          </span>
        </p>
      </div>
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center my-12">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p class="mt-4 text-gray-600">Carregando usuários...</p>
      </div>
      
      <div v-else-if="users.length > 0" class="hidden md:block overflow-hidden bg-white rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome Completo
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Nascimento
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gênero
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-12 w-12 rounded-full overflow-hidden border border-gray-200">
                  <img :src="user.image" :alt="`${user.firstName} ${user.lastName}`" class="h-full w-full object-cover" 
                       @error="handleImageError" />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.firstName }} {{ user.lastName }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ user.email }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-700">
                  {{ formatBirthDate(user.birthDate) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ calculateAge(user.birthDate) }} anos
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="{ 
                        'bg-blue-100 text-blue-800': user.gender === 'male',
                        'bg-pink-100 text-pink-800': user.gender === 'female'
                      }">
                  {{ formatGender(user.gender) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-700 max-w-xs">
                  <p>{{ formatAddress(user.address) }}</p>
                  <a 
                    :href="getMapLink(user.address.coordinates)" 
                    target="_blank"
                    class="inline-flex items-center mt-2 px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <MapPin class="h-4 w-4 mr-1" />
                    Ver no Mapa
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="users && users.length > 0" class="md:hidden space-y-4">
        <div v-for="user in users" :key="user.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-4">
            <div class="flex items-center">
              <div class="h-16 w-16 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <img :src="user.image" :alt="`${user.firstName} ${user.lastName}`" class="h-full w-full object-cover" 
                     @error="handleImageError" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</h3>
                <div class="flex items-center mt-1">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="{ 
                          'bg-blue-100 text-blue-800': user.gender === 'male',
                          'bg-pink-100 text-pink-800': user.gender === 'female'
                        }">
                    {{ formatGender(user.gender) }}
                  </span>
                  <span class="ml-2 text-sm text-gray-600">{{ calculateAge(user.birthDate) }} anos</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ user.email }}</p>
              </div>
            </div>
            
            <div class="mt-4 border-t pt-4">
              <div class="flex justify-between items-baseline">
                <h4 class="text-sm font-semibold text-gray-700">Data de Nascimento</h4>
                <p class="text-sm text-gray-600">{{ formatBirthDate(user.birthDate) }}</p>
              </div>
              
              <div class="mt-3">
                <h4 class="text-sm font-semibold text-gray-700">Localização</h4>
                <p class="text-sm text-gray-600 mt-1">{{ formatAddress(user.address) }}</p>
                <a 
                  :href="getMapLink(user.address.coordinates)" 
                  target="_blank"
                  class="inline-flex items-center mt-2 px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full justify-center"
                >
                  <MapPin class="h-4 w-4 mr-1" />
                  Ver no Mapa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="!isLoading && users.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
        <Frown class="h-16 w-16 mx-auto text-gray-400" />
        <h3 class="mt-4 text-xl font-medium text-gray-900">Nenhum usuário encontrado</h3>
        <p class="mt-2 text-sm text-gray-500">Tente ajustar seus critérios de busca.</p>
        <button 
          v-if="searchQuery" 
          @click="clearSearch"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Limpar busca
        </button>
      </div>
      
      <div v-if="!isLoading && users.length > 0" class="mt-6 bg-white rounded-xl shadow-md p-4 border border-gray-100 animate-fade-in">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-700 order-2 sm:order-1 text-center sm:text-left font-medium">
            <span class="hidden sm:inline">Mostrando </span>
            <span class="font-bold text-indigo-600">{{ (currentPage - 1) * limit + 1 }}-{{ Math.min(currentPage * limit, total) }}</span> 
            <span class="hidden sm:inline"> de </span>
            <span class="sm:hidden inline">/ </span>
            <span class="font-bold text-indigo-600">{{ total }}</span> resultados
          </div>
          
          <div class="flex items-center justify-center order-1 sm:order-2 w-full sm:w-auto">
            <nav class="relative z-0 inline-flex rounded-lg shadow-sm overflow-hidden" aria-label="Paginação">
              <button 
                @click="goToPage(1)" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-lg border text-sm font-medium transition-all focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                :class="currentPage === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-300' : 'bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300'"
                aria-label="Primeira página"
              >
                <ChevronsLeft class="h-5 w-5" />
              </button>
              
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 border-t border-b border-gray-300 text-sm font-medium transition-all focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                :class="currentPage === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'"
                aria-label="Página anterior"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              
              <div class="hidden md:flex">
                <template v-for="page in visiblePageNumbers">
                  <button 
                    v-if="page !== '...'"
                    :key="page"
                    @click="goToPage(page)" 
                    class="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 text-sm font-medium transition-all focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    :class="[
                      currentPage === page 
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 font-bold' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600',
                    ]"
                    :aria-current="currentPage === page ? 'page' : undefined"
                  >
                    {{ page }}
                  </button>
                  <span 
                    v-else
                    :key="`ellipsis-${page}`"
                    class="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>
              </div>
              
              <span class="relative md:hidden inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium">
                <select 
                  v-model="currentPage" 
                  @change="goToPage(currentPage)"
                  class="appearance-none bg-transparent pr-8 pl-1 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 w-16 font-medium text-center"
                  aria-label="Selecionar página"
                >
                  <option v-for="page in totalPages" :key="page" :value="page">
                    {{ page }}
                  </option>
                </select>
                <span class="text-gray-500 ml-1">de {{ totalPages }}</span>
                <ChevronDown class="h-5 w-5 text-gray-400 absolute right-0 pointer-events-none" aria-hidden="true" />
              </span>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages"
                class="relative inline-flex items-center px-2 py-2 border-t border-b border-gray-300 text-sm font-medium transition-all focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                :class="currentPage >= totalPages ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'"
                aria-label="Próxima página"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
              
              <button 
                @click="goToPage(totalPages)" 
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-lg border text-sm font-medium transition-all focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                :class="currentPage === totalPages ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-300' : 'bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300'"
                aria-label="Última página"
              >
                <ChevronsRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
          
          <div class="order-3 flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto text-sm text-gray-700">
            <label for="page-size" class="hidden sm:inline font-medium">Por página:</label>
            <select 
              id="page-size"
              v-model="limit" 
              @change="handlePageSizeChange"
              class="form-select rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-2"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, X, MapPin, Frown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// Estado reativo para armazenar parâmetros de busca
const queryParams = reactive({
  page: parseInt(route.query.page) || 1,
  limit: parseInt(route.query.limit) || 20,
  search: route.query.search || ''
})

// Refs para UI e manipulação de estado
const searchQuery = ref(queryParams.search)
const searchTimeout = ref(null)

// Calcular valores derivados
const currentPage = computed({
  get: () => queryParams.page,
  set: (value) => {
    queryParams.page = value
    updateRoute()
  }
})

const limit = computed({
  get: () => queryParams.limit,
  set: (value) => {
    queryParams.limit = parseInt(value)
    updateRoute()
  }
})

// Função para atualizar a rota com os parâmetros de busca
const updateRoute = () => {
  router.push({
    query: {
      page: queryParams.page,
      limit: queryParams.limit,
      search: queryParams.search || undefined
    }
  })
}

// Buscar dados usando useAsyncData para SSR
const { data: userData, pending: isLoading, refresh: refreshUsers } = useAsyncData(
  () => fetchUsers(queryParams),
  {
    watch: [() => queryParams.page, () => queryParams.limit, () => queryParams.search],
    server: true, // Garantir que os dados sejam buscados no servidor
    initialCache: false,
    default: () => ({ users: [], total: 0 })
  }
)

// Extrair dados do resultado
const users = computed(() => userData.value?.users || [])
const total = computed(() => userData.value?.total || 0)

// Buscar usuários da API
async function fetchUsers({ page, limit, search }) {
  const skip = (page - 1) * limit
  
  try {
    let url = ''
    
    if (search) {
      url = `https://dummyjson.com/users/search?q=${search}&limit=${limit}&skip=${skip}&sortBy=firstName&order=asc`
    } else {
      url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}&sortBy=firstName&order=asc`
    }
    
    const response = await $fetch(url)
    return response
  } catch (error) {
    console.error('Error fetching users:', error)
    return { users: [], total: 0 }
  }
}

// Manipular mudanças na busca
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    queryParams.page = 1
    queryParams.search = searchQuery.value
    updateRoute()
  }, 300)
}

// Limpar busca
const clearSearch = () => {
  searchQuery.value = ''
  queryParams.search = ''
  queryParams.page = 1
  updateRoute()
}

// Navegação de página
const handlePageSizeChange = () => {
  queryParams.page = 1
  updateRoute()
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    queryParams.page = page
    updateRoute()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

const nextPage = () => {
  if (currentPage.value * limit.value < total.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// Cálculos e formatação
const totalPages = computed(() => Math.ceil(total.value / limit.value))

const visiblePageNumbers = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    let startPage = Math.max(2, currentPage.value - 1)
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1)
    
    if (currentPage.value <= 3) {
      endPage = 4
    } else if (currentPage.value >= totalPages.value - 2) {
      startPage = totalPages.value - 3
    }
    
    if (startPage > 2) {
      pages.push('...')
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    if (endPage < totalPages.value - 1) {
      pages.push('...')
    }
    
    pages.push(totalPages.value)
  }
  
  return pages
})

const formatBirthDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const calculateAge = (dateString) => {
  if (!dateString) return '-'
  
  const birthDate = new Date(dateString)
  const today = new Date()
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

const formatGender = (gender) => {
  if (gender === 'male') return 'Masculino'
  if (gender === 'female') return 'Feminino'
  return gender
}

const formatAddress = (address) => {
  if (!address) return '-'
  
  return `${address.address}, ${address.city}, ${address.state} - ${address.postalCode}, ${address.country}`
}

const getMapLink = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) return '#'
  
  return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/150?text=User'
}

// Observar mudanças no limite e ajustar página se necessário
watch(limit, () => {
  if (currentPage.value > Math.ceil(total.value / limit.value)) {
    currentPage.value = 1
  }
})
</script>