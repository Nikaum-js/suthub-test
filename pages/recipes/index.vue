<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
          Galeria de Receitas
        </h1>
        <div class="hidden sm:flex space-x-2">
          <button 
            @click="viewMode = 'grid'"
            class="p-2 rounded-md transition-colors"
            :class="viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
          >
            <LayoutGrid class="h-5 w-5" />
          </button>
          <button 
            @click="viewMode = 'list'"
            class="p-2 rounded-md transition-colors"
            :class="viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
          >
            <AlignLeft class="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="w-full lg:w-1/4 lg:sticky lg:top-4 lg:self-start">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div class="p-5 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <Filter class="h-5 w-5 mr-2 text-indigo-600" />
                Filtrar Receitas
              </h2>
            </div>
            
            <div class="p-5 space-y-5">
  <div class="flex items-center justify-between mb-4">
    <span class="text-sm text-gray-600">
      {{ recipes.length }} receitas encontradas
    </span>
    <button 
      v-if="selectedTags.length > 0"
      @click="clearTags" 
      class="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm transition-all duration-200 flex items-center"
    >
      Limpar filtros
    </button>
  </div>
  
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search class="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      v-model="tagSearch"
      placeholder="Digite o nome da tag para filtrar..."
      class="block w-full text-sm pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
    />
    <div v-if="tagSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
      <button @click="tagSearch = ''" class="text-gray-400 hover:text-gray-500">
        <X class="h-5 w-5" />
      </button>
    </div>
  </div>
  
  <div v-if="selectedTags.length > 0" class="mb-4">
    <div class="flex items-center justify-between mb-2">
      <p class="text-sm font-medium text-gray-700">Tags selecionadas:</p>
      <button 
        @click="clearTags" 
        class="text-xs text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
      >
        <span class="underline">Remover todas</span>
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in selectedTags"
        :key="tag"
        class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 shadow-sm"
      >
        {{ tag }}
        <button
          type="button"
          class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 transition-colors"
          @click="removeTag(tag)"
        >
          <X class="h-3 w-3" />
        </button>
      </span>
    </div>
  </div>
  
          <div class="mt-1">
            <p class="text-sm font-medium text-gray-700 mb-2">Todas as tags:</p>
            <div class="max-h-[500px] overflow-y-auto pr-2 flex flex-wrap gap-2 overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
              <button
                v-for="tag in filteredTags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                ]"
              >
                {{ tag }}
                <span v-if="selectedTags.includes(tag)" class="ml-1">✓</span>
              </button>
            </div>
          </div>
        </div>
          </div>
        </div>
        
        <div class="w-full lg:w-3/4">
          <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12 flex justify-center items-center">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p class="text-gray-500">Carregando receitas...</p>
            </div>
          </div>
          
          <div v-else-if="recipes.length === 0 && selectedTags.length > 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
            <div class="flex flex-col items-center max-w-md mx-auto py-6">
              <div class="rounded-full bg-gray-100 p-6 mb-6">
                <FrownIcon class="h-12 w-12 text-gray-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhuma receita encontrada</h3>
              <p class="text-gray-600 mb-6">
                Não encontramos receitas com a combinação de tags <strong>{{ selectedTags.join(' + ') }}</strong>.
                <br>Tente selecionar outras combinações de tags.
              </p>
              <button
                @click="clearTags"
                class="px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition-all"
              >
                Limpar filtros e tentar novamente
              </button>
            </div>
          </div>
          
          <div v-else>
            <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div
                v-for="recipe in recipes"
                :key="recipe.id"
                class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group"
                @click="openRecipeDetails(recipe)"
              >
                <div class="h-48 w-full overflow-hidden relative">
                  <img
                    :src="recipe.image"
                    :alt="recipe.name"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <h3 class="text-lg font-semibold text-white group-hover:text-white/95 transition-colors line-clamp-2">{{ recipe.name }}</h3>
                  </div>
                </div>
                <div class="p-4">
                  <div class="flex items-center text-gray-500 text-sm mb-3 space-x-4">
                    <div class="flex items-center">
                      <Clock class="h-4 w-4 mr-1" />
                      {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} min
                    </div>
                    <div class="flex items-center">
                      <Star class="h-4 w-4 mr-1" />
                      {{ recipe.rating.toFixed(1) }}
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in recipe.tags.slice(0, 4)"
                      :key="`${recipe.id}-${tag}`"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {{ tag }}
                    </span>
                    <span
                      v-if="recipe.tags.length > 4"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      +{{ recipe.tags.length - 4 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="recipe in recipes"
                :key="recipe.id"
                class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group"
                @click="openRecipeDetails(recipe)"
              >
                <div class="flex flex-col sm:flex-row">
                  <div class="sm:w-48 h-48 sm:h-auto overflow-hidden relative">
                    <img
                      :src="recipe.image"
                      :alt="recipe.name"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div class="p-4 sm:p-6 flex-1">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">{{ recipe.name }}</h3>
                    
                    <div class="flex items-center text-gray-500 text-sm mb-3 space-x-4">
                      <div class="flex items-center">
                        <Clock class="h-4 w-4 mr-1" />
                        {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} min
                      </div>
                      <div class="flex items-center">
                        <Star class="h-4 w-4 mr-1" />
                        {{ recipe.rating.toFixed(1) }}
                      </div>
                      <div class="flex items-center">
                        <Users class="h-4 w-4 mr-1" />
                        {{ recipe.servings }} porções
                      </div>
                      <div class="hidden md:flex items-center">
                        <MessageSquare class="h-4 w-4 mr-1" />
                        {{ recipe.reviewCount }} reviews
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        :class="{
                          'bg-green-100 text-green-800': recipe.difficulty === 'Easy',
                          'bg-yellow-100 text-yellow-800': recipe.difficulty === 'Medium',
                          'bg-red-100 text-red-800': recipe.difficulty === 'Hard'
                        }"
                      >
                        {{ recipe.difficulty }}
                      </span>
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2"
                      >
                        {{ recipe.cuisine }}
                      </span>
                    </div>
                    
                    <div class="flex flex-wrap gap-1 mt-auto">
                      <span
                        v-for="tag in recipe.tags"
                        :key="`${recipe.id}-${tag}`"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            v-if="recipes.length > 0 && !loading && canLoadMore" 
            class="mt-10 flex justify-center"
          >
            <button
              @click="loadMoreRecipes"
              class="px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center"
              :disabled="loadingMore"
            >
              <div v-if="loadingMore" class="flex items-center">
                <LoaderCircle />
                Carregando mais receitas...
              </div>
              <div v-else class="flex items-center">
                <ChevronDown class="w-5 h-5 mr-2" />
                Carregar mais receitas
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ModalDialog
      :is-open="showRecipeModal"
      :title="selectedRecipe ? selectedRecipe.name : ''"
      :max-width="'max-w-4xl'"
      @close="showRecipeModal = false"
    >
      <template v-if="selectedRecipe" #default>
        <div class="max-h-[80vh] overflow-y-auto">
          <div class="h-64 sm:h-80 w-full overflow-hidden relative mb-6">
            <img
              :src="selectedRecipe.image"
              :alt="selectedRecipe.name"
              class="w-full h-full object-cover rounded-xl"
            />
          </div>
          
          <div class="mb-6">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in selectedRecipe.tags"
                :key="tag"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl text-center">
              <div class="text-sm text-indigo-900 font-medium mb-2">Tempo Total</div>
              <div class="font-bold text-xl text-indigo-900">
                {{ selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes }} min
              </div>
              <div class="text-xs text-indigo-700 mt-1">
                Preparo: {{ selectedRecipe.prepTimeMinutes }}min | Cozimento: {{ selectedRecipe.cookTimeMinutes }}min
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl text-center">
              <div class="text-sm text-amber-900 font-medium mb-2">Avaliação</div>
              <div class="text-center text-amber-900">
                <div class="flex justify-center text-xl">
                  <span v-for="star in Math.floor(selectedRecipe.rating)" :key="star">⭐</span>
                  <span v-if="selectedRecipe.rating % 1 >= 0.5">⭐</span>
                </div>
                <div class="text-xs text-amber-700 mt-1">({{ selectedRecipe.reviewCount }} avaliações)</div>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl text-center">
              <div class="text-sm text-emerald-900 font-medium mb-2">Porções</div>
              <div class="font-bold text-xl text-emerald-900 flex items-center justify-center">
                <span v-for="n in Math.min(selectedRecipe.servings, 4)" :key="n" class="mx-0.5">🍽️</span>
                <span v-if="selectedRecipe.servings > 4" class="ml-1 text-sm">
                  (+{{ selectedRecipe.servings - 4 }})
                </span>
              </div>
              <div class="text-xs text-emerald-700 mt-1">
                Serve {{ selectedRecipe.servings }} {{ selectedRecipe.servings > 1 ? 'pessoas' : 'pessoa' }}
              </div>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info class="h-5 w-5 mr-2 text-indigo-600" />
              Informações Nutricionais e Detalhes
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-gray-50 p-4 rounded-xl">
                <div class="text-sm text-gray-500 mb-1">Dificuldade</div>
                <div class="font-medium text-gray-900">{{ selectedRecipe.difficulty }}</div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-xl">
                <div class="text-sm text-gray-500 mb-1">Cozinha</div>
                <div class="font-medium text-gray-900">{{ selectedRecipe.cuisine }}</div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-xl">
                <div class="text-sm text-gray-500 mb-1">Calorias</div>
                <div class="font-medium text-gray-900">{{ selectedRecipe.caloriesPerServing }} por porção</div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-xl">
                <div class="text-sm text-gray-500 mb-1">Tipo de Refeição</div>
                <div class="font-medium text-gray-900">{{ selectedRecipe.mealType.join(', ') }}</div>
              </div>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="border-b border-gray-200">
              <nav class="flex -mb-px space-x-6">
                <button
                  @click="activeTab = 'ingredients'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    activeTab === 'ingredients'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <ShoppingCart class="h-5 w-5 inline mr-2" />
                  Ingredientes
                </button>
                <button
                  @click="activeTab = 'instructions'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    activeTab === 'instructions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <ClipboardList class="h-5 w-5 inline mr-2" />
                  Instruções
                </button>
              </nav>
            </div>
            
            <div v-if="activeTab === 'ingredients'" class="py-6">
              <ul class="space-y-3">
                <li 
                  v-for="(ingredient, index) in selectedRecipe.ingredients" 
                  :key="index" 
                  class="flex items-start"
                >
                  <div class="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm font-medium mr-3">
                    {{ index + 1 }}
                  </div>
                  <span class="text-gray-700">{{ ingredient }}</span>
                </li>
              </ul>
            </div>
            
            <div v-if="activeTab === 'instructions'" class="py-6">
              <ol class="space-y-6">
                <li 
                  v-for="(instruction, index) in selectedRecipe.instructions" 
                  :key="index" 
                  class="flex"
                >
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium mr-4">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <p class="text-gray-700">{{ instruction }}</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </template>
      
      <template #footer>
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          @click="showRecipeModal = false"
        >
          Fechar
        </button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  AlignLeft, 
  ChevronDown, 
  Clock, 
  ClipboardList, 
  Filter, 
  FrownIcon, 
  Info, 
  LayoutGrid, 
  MessageSquare, 
  Search, 
  ShoppingCart, 
  Star, 
  LoaderCircle,
  Users, 
  X 
} from 'lucide-vue-next';
import ModalDialog from '../../components/Modal.vue';

const allRecipes = ref([]);
const allTags = ref([]);
const recipesByTag = ref({});
const recipes = ref([]);
const selectedTags = ref([]);
const tagSearch = ref('');
const loading = ref(true);
const loadingMore = ref(false);
const page = ref(1);
const limit = ref(10);
const totalCount = ref(0);
const hasMorePages = ref(true);
const viewMode = ref('grid');
const activeTab = ref('ingredients');

const showRecipeModal = ref(false);
const selectedRecipe = ref(null);

const canLoadMore = computed(() => {
  if (selectedTags.value.length === 0) {
    return recipes.value.length < totalCount.value;
  } else if (selectedTags.value.length === 1) {
    const tag = selectedTags.value[0];
    const tagInfo = tagTotalCounts.value[tag];
    if (tagInfo) {
      return recipes.value.length < tagInfo.total;
    }
  }
  
  return false;
});

const tagTotalCounts = ref({});

const filteredTags = computed(() => {
  if (!tagSearch.value) {
    return allTags.value.sort();
  }
  
  return allTags.value
    .filter(tag => tag.toLowerCase().includes(tagSearch.value.toLowerCase()))
    .sort();
});

const fetchAllTags = async () => {
  try {
    const response = await fetch('https://dummyjson.com/recipes/tags');
    const data = await response.json();
    allTags.value = data;
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
  }
};

const fetchInitialRecipes = async () => {
  loading.value = true;
  try {
    const response = await fetch(`https://dummyjson.com/recipes?limit=${limit.value}`);
    const data = await response.json();
    
    totalCount.value = data.total;
    allRecipes.value = data.recipes;
    recipes.value = data.recipes;
    
    page.value = 1;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
  } finally {
    loading.value = false;
  }
};

const loadMoreRecipes = async () => {
  if (!hasMorePages.value || loadingMore.value) return;
  
  const newPage = page.value + 1;
  const skip = page.value * limit.value;
  
  loadingMore.value = true;
  try {
    if (selectedTags.value.length > 0) {
      if (selectedTags.value.length === 1) {
        const tag = selectedTags.value[0];
        const response = await fetch(`https://dummyjson.com/recipes/tag/${tag}?limit=${limit.value}&skip=${skip}`);
        const data = await response.json();
        
        if (data.recipes && data.recipes.length > 0) {
          tagTotalCounts.value[tag] = {
            total: data.total,
            loaded: (recipesByTag.value[tag]?.length || 0) + data.recipes.length
          };
          
          const existingIds = new Set(recipesByTag.value[tag]?.map(r => r.id) || []);
          const newRecipes = data.recipes.filter(r => !existingIds.has(r.id));
          
          if (newRecipes.length > 0) {
            recipesByTag.value[tag] = [...(recipesByTag.value[tag] || []), ...newRecipes];
            
            applyTagFilters();
            
            page.value = newPage;
          } else {
            hasMorePages.value = false;
          }
        } else {
          hasMorePages.value = false;
        }
      }
    } else {
      const response = await fetch(`https://dummyjson.com/recipes?limit=${limit.value}&skip=${skip}`);
      const data = await response.json();
      
      if (data.recipes && data.recipes.length > 0) {
        const existingIds = new Set(allRecipes.value.map(r => r.id));
        const newRecipes = data.recipes.filter(r => !existingIds.has(r.id));
        
        if (newRecipes.length > 0) {
          allRecipes.value = [...allRecipes.value, ...newRecipes];
          recipes.value = allRecipes.value;
          page.value = newPage;
        } else {
          hasMorePages.value = false;
        }
      } else {
        hasMorePages.value = false;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar mais receitas:', error);
  } finally {
    loadingMore.value = false;
  }
};

const toggleTag = async (tag) => {
  if (selectedTags.value.includes(tag)) {
    removeTag(tag);
  } else {
    if (selectedTags.value.length < 2) {
      page.value = 1;
      hasMorePages.value = true;
      
      selectedTags.value.push(tag);
      
      if (!recipesByTag.value[tag]) {
        await fetchRecipesByTag(tag);
      } else {
        applyTagFilters();
      }
    }
  }
};

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
  
  page.value = 1;
  hasMorePages.value = true;
  
  applyTagFilters();
};

const clearTags = () => {
  selectedTags.value = [];
  
  page.value = 1;
  hasMorePages.value = true;
  
  recipes.value = allRecipes.value;
};

const applyTagFilters = () => {
  if (selectedTags.value.length === 0) {
    recipes.value = allRecipes.value;
    return;
  }
  
  if (selectedTags.value.length === 1) {
    const tag = selectedTags.value[0];
    recipes.value = recipesByTag.value[tag] || [];
    return;
  }
  
  const tag1 = selectedTags.value[0];
  const tag2 = selectedTags.value[1];
  
  const recipesWithTag1 = recipesByTag.value[tag1] || [];
  const recipesWithTag2 = recipesByTag.value[tag2] || [];
  
  const tag2RecipeIds = new Set(recipesWithTag2.map(recipe => recipe.id));
  
  recipes.value = recipesWithTag1.filter(recipe => tag2RecipeIds.has(recipe.id));
  
  hasMorePages.value = false;
};

const fetchRecipesByTag = async (tag) => {
  loading.value = true;
  try {
    const response = await fetch(`https://dummyjson.com/recipes/tag/${tag}`);
    const data = await response.json();
    
    if (data.recipes) {
      tagTotalCounts.value[tag] = {
        total: data.total,
        loaded: data.recipes.length
      };
      
      recipesByTag.value[tag] = data.recipes;
      
      applyTagFilters();
    }
  } catch (error) {
    console.error(`Erro ao buscar receitas por tag ${tag}:`, error);
  } finally {
    loading.value = false;
  }
};

const openRecipeDetails = async (recipe) => {
  activeTab.value = 'ingredients';
  
  if (!recipe.ingredients || !recipe.instructions) {
    try {
      loading.value = true;
      const response = await fetch(`https://dummyjson.com/recipes/${recipe.id}`);
      selectedRecipe.value = await response.json();
      loading.value = false;
    } catch (error) {
      console.error(`Erro ao buscar detalhes da receita ${recipe.id}:`, error);
      selectedRecipe.value = recipe;
      loading.value = false;
    }
  } else {
    selectedRecipe.value = recipe;
  }
  
  showRecipeModal.value = true;
};

onMounted(async () => {
  await Promise.all([
    fetchAllTags(),
    fetchInitialRecipes()
  ]);
});
</script>