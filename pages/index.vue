<template>
  <div class="min-h-screen mb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
      <div class="mb-8 flex items-center space-x-3 border-b border-gray-100 pb-5">
        <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg p-2 shadow-md">
          <User class="h-6 w-6 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Cadastro de Usuário</h1>
      </div>
      
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-indigo-700">Progresso</span>
          <span class="text-xs text-gray-500">4 seções</span>
        </div>
        <div class="bg-gray-200 h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-700 h-full rounded-full" :style="`width: ${calculateProgress}%`"></div>
        </div>
      </div>
      
      <form @submit.prevent="submitForm" class="space-y-8">
        <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-2 text-sm font-bold">1</span>
            Dados Pessoais
          </h2>
          
          <div class="space-y-4">
            <FormField
              id="fullName"
              label="Nome completo"
              v-model="v$.fullName.$model"
              :required="true"
              :errorMessage="formTouched && v$.fullName.$error ? v$.fullName.$errors[0].$message : ''"
              icon="user"
              placeholder="Digite seu nome completo"
            />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="taxId"
                label="CPF"
                v-model="v$.taxId.$model"
                :required="true"
                :errorMessage="formTouched && v$.taxId.$error ? v$.taxId.$errors[0].$message : ''"
                maxlength="14"
                @input="handleTaxIdInput"
                icon="credit-card"
                placeholder="000.000.000-00"
              />

              <FormField
                id="birthDate"
                label="Data de nascimento"
                v-model="v$.birthDate.$model"
                type="date"
                :required="true"
                :errorMessage="formTouched && v$.birthDate.$error ? v$.birthDate.$errors[0].$message : ''"
                :max="maxDate"
                :min="minDate"
                icon="calendar"
                placeholder="Selecione sua data de nascimento"

              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="phone"
                label="Telefone celular"
                v-model="v$.phone.$model"
                :required="true"
                :errorMessage="formTouched && v$.phone.$error ? v$.phone.$errors[0].$message : ''"
                maxlength="15"
                @input="handlePhoneInput"
                icon="phone"
                placeholder="(00) 00000-0000"

              />

              <FormField
                id="monthlyIncome"
                label="Renda mensal"
                v-model="formattedMonthlyIncome"
                :required="true"
                :errorMessage="formTouched && v$.monthlyIncome.$error ? v$.monthlyIncome.$errors[0].$message : ''"
                type="text"
                prefix="R$"
                icon="dollar-sign"
                placeholder="0,00"

              />
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-2 text-sm font-bold">2</span>
            Endereço
          </h2>
          
          <div class="space-y-4">
            <div class="flex flex-wrap">
              <div class="w-full sm:w-2/3 pr-0 sm:pr-2">
                <FormField
                  id="zipCode"
                  label="CEP"
                  v-model="v$.zipCode.$model"
                  :required="true"
                  :errorMessage="formTouched && v$.zipCode.$error ? v$.zipCode.$errors[0].$message : ''"
                  maxlength="9"
                  :has-button="false"
                  @input="handleZipCodeInput"
                  @blur="handleFetchAddress"
                  icon="map-pin"
                  placeholder="00000-000"
  
                />
              </div>
              <div class="w-full sm:w-1/3 mt-2 sm:mt-6">
                <button 
                  type="button"
                  @click="handleFetchAddress" 
                  class="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center"
                  :disabled="fetchingZipCode"
                  aria-label="Buscar endereço pelo CEP"
                >
                  <span v-if="!fetchingZipCode">Buscar CEP</span>
                  <Loader2 v-else class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  <span v-if="fetchingZipCode">Buscando...</span>
                </button>
              </div>
            </div>

            <div class="w-full">
              <FormField
                id="street"
                label="Rua"
                v-model="v$.street.$model"
                :required="true"
                :errorMessage="formTouched && v$.street.$error ? v$.street.$errors[0].$message : ''"
                icon="map"
                placeholder="Digite o nome da rua"

              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                id="district"
                label="Bairro"
                v-model="v$.district.$model"
                :required="true"
                :errorMessage="formTouched && v$.district.$error ? v$.district.$errors[0].$message : ''"
                placeholder="Digite o bairro"
                icon="home"

              />

              <FormField
                id="city"
                label="Cidade"
                v-model="v$.city.$model"
                :required="true"
                :errorMessage="formTouched && v$.city.$error ? v$.city.$errors[0].$message : ''"
                placeholder="Digite a cidade"
                icon="building"

              />

              <FormField
                id="state"
                label="Estado"
                v-model="v$.state.$model"
                :required="true"
                :errorMessage="formTouched && v$.state.$error ? v$.state.$errors[0].$message : ''"
                maxlength="2"
                @input="handleStateInput"
                placeholder="UF"
                icon="map-pin"

              />
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-2 text-sm font-bold">3</span>
            Informações sobre veículo
          </h2>
          
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-6">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <HelpCircle class="h-6 w-6 text-indigo-700" />
                  </div>
                  <button
                    type="button"
                    @click="openInfoModal"
                    class="text-sm text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 font-medium underline text-left transition-all duration-200"
                    aria-label="Obter mais informações sobre esta pergunta"
                  >
                    Por que precisamos desta informação?
                  </button>
                </div>
              </div>
              
              <div class="sm:w-1/2">
                <div class="flex flex-col">
                  <label class="text-sm font-medium text-gray-700 mb-2">Possui carro*</label>
                  <div class="relative bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-900">{{ v$.hasCar.$model ? 'Sim, possuo' : 'Não possuo' }}</span>
                      <Switch
                        v-model="v$.hasCar.$model"
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        :class="v$.hasCar.$model ? 'bg-gradient-to-br from-indigo-600 to-purple-700' : 'bg-gray-200'"
                      >
                        <span class="sr-only">Possui carro</span>
                        <span
                          class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          :class="v$.hasCar.$model ? 'translate-x-5' : 'translate-x-0'"
                        >
                          <span
                            class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                            :class="v$.hasCar.$model ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'"
                            aria-hidden="true"
                          >
                            <X class="h-3 w-3 text-gray-400" />
                          </span>
                          <span
                            class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                            :class="v$.hasCar.$model ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'"
                            aria-hidden="true"
                          >
                            <Check class="h-3 w-3 text-indigo-600" />
                          </span>
                        </span>
                      </Switch>
                    </div>
                  </div>
                  <p v-if="formTouched && v$.hasCar.$error" class="mt-1 text-sm text-red-600">{{ v$.hasCar.$errors[0].$message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span class="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-2 text-sm font-bold">4</span>
            Informações sobre o pet
          </h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Espécie do pet*
              </label>
              <div class="flex items-center space-x-4">
                <div 
                  @click="v$.petType.$model = 'cão'" 
                  class="flex-1 rounded-lg p-3 border cursor-pointer transition-all"
                  :class="v$.petType.$model === 'cão' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300'"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-lg" aria-hidden="true">🐕</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between flex-1">
                      <span class="text-sm font-medium text-gray-900">Cão</span>
                      
                      <div 
                        class="h-4 w-4 rounded-full border flex items-center justify-center"
                        :class="v$.petType.$model === 'cão' ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-transparent' : 'bg-white border-gray-300'"
                        aria-hidden="true"
                      >
                        <span v-if="v$.petType.$model === 'cão'" class="h-2 w-2 rounded-full bg-white"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  @click="v$.petType.$model = 'gato'" 
                  class="flex-1 rounded-lg p-3 border cursor-pointer transition-all"
                  :class="v$.petType.$model === 'gato' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-indigo-300'"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-lg" aria-hidden="true">🐈</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between flex-1">
                      <span class="text-sm font-medium text-gray-900">Gato</span>
                      
                      <div 
                        class="h-4 w-4 rounded-full border flex items-center justify-center"
                        :class="v$.petType.$model === 'gato' ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-transparent' : 'bg-white border-gray-300'"
                        aria-hidden="true"
                      >
                        <span v-if="v$.petType.$model === 'gato'" class="h-2 w-2 rounded-full bg-white"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p v-if="formTouched && v$.petType.$error" class="mt-1 text-sm text-red-600">{{ v$.petType.$errors[0].$message }}</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <div class="relative">
                  <label for="petBreed" class="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Raça do pet<span class="ml-0.5 ">*</span>
                  </label>
                  
                  <div class="relative">
                    <Listbox v-model="v$.petBreed.$model" as="div" :disabled="!v$.petType.$model">
                      <div class="relative">
                        <div class="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PawPrint class="h-5 w-5 text-gray-400" />
                        </div>
                        
                        <ListboxButton 
                          class="w-full relative rounded-lg border py-2.5 pl-10 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm cursor-pointer transition-all duration-200"
                          :class="[
                            v$.petType.$model ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 cursor-not-allowed',
                            formTouched && v$.petBreed.$error ? 'border-red-500 text-red-900' : 'border-gray-300 text-gray-900',
                          ]"
                          :disabled="!v$.petType.$model"
                        >
                          <span class="block truncate" :class="!v$.petBreed.$model ? 'text-gray-300' : ''">
                            {{ v$.petBreed.$model || 'Selecione a raça do pet' }}
                          </span>
                          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown class="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        
                        <transition
                          enter-active-class="transition ease-out duration-200"
                          enter-from-class="opacity-0 translate-y-1"
                          enter-to-class="opacity-100 translate-y-0"
                          leave-active-class="transition ease-in duration-150"
                          leave-from-class="opacity-100 translate-y-0"
                          leave-to-class="opacity-0 translate-y-1"
                        >
                          <ListboxOptions 
                            class="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                          >
                            <div v-if="!breedsList.length" class="px-4 py-2 text-sm text-gray-400 italic">
                              Selecione uma espécie de pet primeiro
                            </div>
                            
                            <div v-else class="py-1">
                              <div class="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                                Selecione uma raça
                              </div>
                              
                              <ListboxOption
                                v-for="breed in breedsList"
                                :key="breed"
                                :value="breed"
                                v-slot="{ active, selected }"
                                as="template"
                              >
                                <li 
                                  :class="[
                                    active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                                    'cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-indigo-50 transition-colors duration-100',
                                  ]"
                                >
                                  <span 
                                    :class="[
                                      selected ? 'font-medium' : 'font-normal',
                                      'block truncate',
                                    ]"
                                  >
                                    {{ breed }}
                                  </span>
                                  
                                  <span 
                                    v-if="selected"
                                    :class="[
                                      active ? 'text-indigo-900' : 'text-indigo-600',
                                      'absolute inset-y-0 left-0 flex items-center pl-3',
                                    ]"
                                  >
                                    <Check class="h-5 w-5" aria-hidden="true" />
                                  </span>
                                </li>
                              </ListboxOption>
                            </div>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>
                  
                  <p v-if="formTouched && v$.petBreed.$error" class="mt-1 text-sm text-red-600">
                    {{ v$.petBreed.$errors[0].$message }}
                  </p>
                </div>
              </div>

              <div class="flex-1" v-if="v$.petBreed.$model === 'outro'">
                <FormField
                  id="otherBreed"
                  label="Especifique a raça do pet"
                  v-model="v$.otherBreed.$model"
                  :required="true"
                  :errorMessage="formTouched && v$.otherBreed.$error ? v$.otherBreed.$errors[0].$message : ''"
                  icon="edit"
                  placeholder="Digite a raça do seu pet"
  
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            type="button"
            class="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200 flex items-center"
            @click="resetForm"
            aria-label="Limpar todos os campos do formulário"
          >
            <RotateCcw class="h-4 w-4 mr-1.5" />
            Limpar formulário
          </button>
          
          <button
            type="submit"
            class="px-6 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center"
            aria-label="Enviar formulário para revisão"
          >
            Revisar e Cadastrar
            <ArrowRight class="h-4 w-4 ml-1.5" />
          </button>
        </div>
      </form>
    </div>
    
    <Modal 
      :is-open="infoModalOpen" 
      @close="infoModalOpen = false"
      title="Por que precisamos da informação do carro?"
      content="Esta informação é necessária para avaliarmos seu perfil de segurado e oferecermos o melhor plano para você e seu pet. Possuir um carro pode indicar a facilidade de acesso a clínicas veterinárias em caso de emergências."
      button-text="Entendido"
    />
    
    <Modal 
      :is-open="confirmationModalOpen" 
      @close="confirmationModalOpen = false"
      title="Confira seus dados"
      max-width="max-w-2xl"
    >
      <div class="mt-4 space-y-4">
        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="text-md font-medium text-gray-900 mb-2 flex items-center">
            <User class="h-5 w-5 mr-1.5 text-indigo-600" />
            Dados Pessoais
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Nome completo</p>
              <p class="text-sm text-gray-900">{{ v$.fullName.$model }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">CPF</p>
              <p class="text-sm text-gray-900">{{ v$.taxId.$model }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Data de nascimento</p>
              <p class="text-sm text-gray-900">{{ formatDate(v$.birthDate.$model) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Telefone</p>
              <p class="text-sm text-gray-900">{{ v$.phone.$model }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Renda mensal</p>
              <p class="text-sm text-gray-900">R$ {{ formatCurrency(v$.monthlyIncome.$model) }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="text-md font-medium text-gray-900 mb-2 flex items-center">
            <MapPin class="h-5 w-5 mr-1.5 text-indigo-600" />
            Endereço
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <p class="text-sm font-medium text-gray-500">CEP</p>
              <p class="text-sm text-gray-900">{{ v$.zipCode.$model }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm font-medium text-gray-500">Rua</p>
              <p class="text-sm text-gray-900">{{ v$.street.$model }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Bairro</p>
              <p class="text-sm text-gray-900">{{ v$.district.$model }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Cidade/Estado</p>
              <p class="text-sm text-gray-900">{{ v$.city.$model }}/{{ v$.state.$model }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-md">
          <h4 class="text-md font-medium text-gray-900 mb-2 flex items-center">
            <Info class="h-5 w-5 mr-1.5 text-indigo-600" />
            Outras Informações
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Possui carro</p>
              <p class="text-sm text-gray-900">{{ v$.hasCar.$model ? 'Sim' : 'Não' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Espécie do pet</p>
              <p class="text-sm text-gray-900">{{ v$.petType.$model === 'cão' ? '🐕 Cão' : '🐈 Gato' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Raça do pet</p>
              <p class="text-sm text-gray-900">{{ v$.petBreed.$model === 'outro' ? v$.otherBreed.$model : v$.petBreed.$model }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-all duration-200"
            @click="confirmationModalOpen = false"
            aria-label="Voltar e editar os dados do formulário"
          >
            Voltar e editar
          </button>
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200"
            @click="confirmRegistration"
            aria-label="Confirmar e finalizar o cadastro"
          >
            Confirmar cadastro
          </button>
        </div>
      </template>
    </Modal>
    
    <Modal 
      :is-open="successModalOpen" 
      @close="closeSuccessModal"
      title="Cadastro realizado com sucesso!"
      content="Seus dados foram cadastrados em nosso sistema. Em breve, entraremos em contato para oferecer o melhor plano para você e seu pet."
      button-text="Novo cadastro"
      :title-center="true"
      :content-center="true"
      :button-center="true"
      :show-icon="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minValue } from '@vuelidate/validators'
import { Switch } from '@headlessui/vue'
import { 
  Listbox, 
  ListboxButton, 
  ListboxOptions, 
  ListboxOption 
} from '@headlessui/vue'
import { 
  User, 
  CreditCard, 
  Calendar,
  Phone,
  DollarSign,
  MapPin,
  Map,
  Home,
  Building,
  HelpCircle,
  Check,
  X,
  PawPrint,
  Edit,
  RotateCcw,
  ArrowRight,
  ChevronDown,
  Loader2,
  Info
} from 'lucide-vue-next'

import FormField from '../components/FormField.vue'
import Modal from '../components/Modal.vue'
import {
  validateTaxId,
  formatTaxId,
  formatPhone,
  formatZipCode,
  formatState,
  formatDate,
  formatCurrency,
  currencyToNumber,
  validatePhone,
  validateZipCode,
  validateMinWords,
  getMinDateForAge,
  getMaxDateForAge,
  validateAge,
  validateState,
  fetchAddressByZipCode
} from '../utils/formHelpers'

interface FormDataType {
  fullName: string;
  taxId: string;
  birthDate: string;
  phone: string;
  zipCode: string;
  street: string;
  district: string;
  city: string;
  state: string;
  monthlyIncome: number;
  hasCar: boolean;
  petType: string;
  petBreed: string;
  otherBreed: string;
}

const maxDate = computed((): string => getMinDateForAge(18))
const minDate = computed((): string => getMaxDateForAge(65))

const formData = ref<FormDataType>({
  fullName: '',
  taxId: '',
  birthDate: '',
  phone: '',
  zipCode: '',
  street: '',
  district: '',
  city: '',
  state: '',
  monthlyIncome: 1000,
  hasCar: true,
  petType: '',
  petBreed: '',
  otherBreed: ''
})

const formTouched = ref<boolean>(false)

const rules = computed(() => ({
  fullName: { 
    required: helpers.withMessage('Nome completo é obrigatório', required),
    minWords: helpers.withMessage(
      'O nome precisa ser completo',
      (value: string): boolean => validateMinWords(value)
    )
  },
  taxId: { 
    required: helpers.withMessage('CPF é obrigatório', required),
    validTaxId: helpers.withMessage('CPF inválido', validateTaxId)
  },
  birthDate: { 
    required: helpers.withMessage('Data de nascimento é obrigatória', required),
    validAge: helpers.withMessage(
      'Você deve ter entre 18 e 65 anos',
      (value: string): boolean => validateAge(value, 18, 65)
    )
  },
  phone: { 
    required: helpers.withMessage('Telefone é obrigatório', required),
    validPhone: helpers.withMessage(
      'Telefone inválido. Deve conter DDD + 9 dígitos',
      validatePhone
    )
  },
  zipCode: { 
    required: helpers.withMessage('CEP é obrigatório', required),
    validZipCode: helpers.withMessage(
      'CEP inválido. Deve conter 8 dígitos',
      validateZipCode
    )
  },
  street: { required: helpers.withMessage('Rua é obrigatória', required) },
  district: { required: helpers.withMessage('Bairro é obrigatório', required) },
  city: { required: helpers.withMessage('Cidade é obrigatória', required) },
  state: { 
    required: helpers.withMessage('Estado é obrigatório', required),
    validState: helpers.withMessage(
      'Estado deve conter 2 letras maiúsculas',
      validateState
    )
  },
  monthlyIncome: { 
    required: helpers.withMessage('Renda mensal é obrigatória', required),
    minValue: helpers.withMessage(
      'Renda mensal deve ser no mínimo R$ 1000,00',
      minValue(1000)
    )
  },
  hasCar: { 
    mustBeTrue: helpers.withMessage(
      'É obrigatório possuir um carro',
      (value: boolean): boolean => value === true
    )
  },
  petType: { required: helpers.withMessage('Espécie do pet é obrigatória', required) },
  petBreed: { required: helpers.withMessage('Raça do pet é obrigatória', required) },
  otherBreed: {
    required: helpers.withMessage(
      'Por favor, especifique a raça do pet',
      function(this: any, value: string): boolean {
        return this.petBreed !== 'outro' || !!value
      }
    )
  }
}))

const v$ = useVuelidate(rules, formData)

const formattedMonthlyIncome = computed({
  get(): string {
    return formatCurrency(v$.value.monthlyIncome.$model)
  },
  set(newValue: string): void {
    v$.value.monthlyIncome.$model = currencyToNumber(newValue)
  }
})

const calculateProgress = computed((): number => {
  let filledFields = 0;
  let totalFields = 0;
  
  const basicFields = ['fullName', 'taxId', 'birthDate', 'phone', 'zipCode', 'street', 'district', 'city', 'state', 'monthlyIncome'];
  basicFields.forEach(field => {
    totalFields++;
    if (v$.value[field].$model) filledFields++;
  });
  
  totalFields += 2;
  if (v$.value.petType.$model) filledFields++;
  if (v$.value.petBreed.$model) filledFields++;
  
  if (v$.value.petBreed.$model === 'outro') {
    totalFields++;
    if (v$.value.otherBreed.$model) filledFields++;
  }
  
  return Math.round((filledFields / totalFields) * 100);
})

const petBreedError = computed((): string => {
  if (!formTouched.value) return '';
  return v$.value.petBreed.$error ? v$.value.petBreed.$errors[0].$message as string : '';
});

const dogBreeds: string[] = [
  'Labrador', 
  'Pastor Alemão', 
  'Bulldog', 
  'Golden Retriever', 
  'Poodle', 
  'Husky Siberiano', 
  'Rottweiler', 
  'Boxer', 
  'Border Collie', 
  'Shih Tzu',
  'outro'
]

const catBreeds: string[] = [
  'Persa', 
  'Siamês', 
  'Maine Coon', 
  'Ragdoll', 
  'Bengal', 
  'Sphynx', 
  'Scottish Fold', 
  'British Shorthair', 
  'Abissínio', 
  'Norwegian Forest',
  'outro'
]

const breedsList = computed((): string[] => {
  if (v$.value.petType.$model === 'cão') {
    return dogBreeds
  } else if (v$.value.petType.$model === 'gato') {
    return catBreeds
  }
  return []
})

const fetchingZipCode = ref<boolean>(false)

const infoModalOpen = ref<boolean>(false)
const confirmationModalOpen = ref<boolean>(false)
const successModalOpen = ref<boolean>(false)

watch(() => v$.value.petType.$model, (newType: string): void => {
  v$.value.petBreed.$model = ''
  v$.value.otherBreed.$model = ''
})

watch(() => v$.value.petBreed.$model, (newBreed: string): void => {
  if (newBreed !== 'outro') {
    v$.value.otherBreed.$model = ''
  }
})

const handleTaxIdInput = (): void => {
  v$.value.taxId.$model = formatTaxId(v$.value.taxId.$model)
}

const handlePhoneInput = (): void => {
  v$.value.phone.$model = formatPhone(v$.value.phone.$model)
}

const handleZipCodeInput = (): void => {
  v$.value.zipCode.$model = formatZipCode(v$.value.zipCode.$model)
}

const handleStateInput = (): void => {
  v$.value.state.$model = formatState(v$.value.state.$model)
}

const handleFetchAddress = async (): Promise<void> => {
  const zipCode: string = v$.value.zipCode.$model.replace(/\D/g, '')
  
  if (zipCode.length !== 8) {
    return
  }
  
  fetchingZipCode.value = true
  
  try {
    const addressData = await fetchAddressByZipCode(zipCode)
    v$.value.street.$model = addressData.street
    v$.value.district.$model = addressData.district
    v$.value.city.$model = addressData.city
    v$.value.state.$model = addressData.state
  } catch (error) {
  } finally {
    fetchingZipCode.value = false
  }
}

const openInfoModal = (): void => {
  infoModalOpen.value = true
}

const submitForm = async (): Promise<void> => {
  formTouched.value = true
  
  const isValid: boolean = await v$.value.$validate()
  
  if (isValid) {
    confirmationModalOpen.value = true
  } else {
    const firstErrorField: HTMLElement | null = document.querySelector('.border-red-500')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

const confirmRegistration = (): void => {
  confirmationModalOpen.value = false
  successModalOpen.value = true
}

const closeSuccessModal = (): void => {
  successModalOpen.value = false
  resetForm()
}

const resetForm = (): void => {
  v$.value.$reset()
  
  formTouched.value = false
  
  formData.value = {
    fullName: '',
    taxId: '',
    birthDate: '',
    phone: '',
    zipCode: '',
    street: '',
    district: '',
    city: '',
    state: '',
    monthlyIncome: 1000,
    hasCar: true,
    petType: '',
    petBreed: '',
    otherBreed: ''
  }
}
</script>
