// Portuguese (Brazil) translations for UTM Generator
export const translations = {
  // UserGenerator Component
  generator: {
    title: 'Gerador de Links UTM',
    subtitle: 'Gere parâmetros UTM formatados corretamente',
    baseUrl: 'URL Base',
    baseUrlPlaceholder: 'https://example.com',
    utmParameters: 'Parâmetros UTM',
    generatedUrl: 'URL Gerada',
    copyButton: 'Copiar',
    copiedMessage: 'Copiado para área de transferência!',
    selectFieldPlaceholder: (fieldLabel: string) => `Selecione ${fieldLabel}...`,
    enterFieldPlaceholder: (fieldLabel: string) => `Digite ${fieldLabel}...`,
  },

  // AdminPanel Component
  admin: {
    title: 'Painel Administrativo',
    subtitle: 'Configure campos UTM e dependências',
    logout: 'Sair',
    saveChanges: 'Salvar Todas as Alterações',

    tabs: {
      fields: 'Campos',
      options: 'Opções',
      dependencies: 'Dependências',
      config: 'Configurações',
    },

    // Fields Tab
    addCustomField: 'Adicionar Campo Personalizado',
    fieldName: 'Nome do Campo (parâmetro UTM)',
    fieldNamePlaceholder: 'ex: utm_custom',
    displayLabel: 'Rótulo de Exibição',
    displayLabelPlaceholder: 'ex: Campo Personalizado',
    fieldType: 'Tipo de Campo',
    fieldTypeDropdown: 'Dropdown (selecionar entre opções)',
    fieldTypeString: 'Entrada de Texto (texto livre)',
    fieldTypeInteger: 'Entrada de Número (apenas inteiros)',
    description: 'Descrição (para tooltip)',
    descriptionPlaceholder: 'Descrição que aparecerá ao passar o mouse sobre o ícone ℹ️',
    addField: 'Adicionar Campo',
    saveChangesField: 'Salvar Alterações',
    cancel: 'Cancelar',
    deleteField: 'Deletar campo',
    editField: 'Editar campo',
    cannotDeleteStandardField: 'Não é possível deletar campos UTM padrão',
    fieldUpdatedSuccessfully: 'Campo atualizado com sucesso!',

    // Options Tab
    selectField: 'Selecionar Campo',
    chooseField: 'Escolha um campo...',
    options: 'Opções (uma por linha)',
    optionsPlaceholder: 'Opção 1\nOpção 2\nOpção 3',
    saveOptions: 'Salvar Opções',
    optionsUpdated: 'Opções atualizadas!',
    noteNonDropdownField: 'Nota: Este campo é do tipo {fieldType} e não usa opções. Opções são usadas apenas em campos dropdown.',

    // Dependencies Tab
    addDependencyRule: 'Adicionar Regra de Dependência',
    ifField: 'Se Campo',
    selectSourceField: 'Selecionar campo...',
    equals: 'Igual a',
    selectValue: 'Selecionar valor...',
    thenLimitField: 'Então Limitar Campo',
    toTheseValues: 'Para Estes Valores (uma por linha)',
    addRule: 'Adicionar Regra',
    deleteDependency: 'Deletar regra',
    allDependencyFieldsRequired: 'Todos os campos de dependência são obrigatórios',
    dependencyAddedSuccessfully: 'Regra de dependência adicionada com sucesso!',

    // Config Tab
    changeAdminPassword: 'Alterar Senha do Admin',
    newPassword: 'Nova senha',
    updatePassword: 'Atualizar Senha',
    passwordUpdated: 'Senha atualizada!',
    configuration: 'Configuração',
    exportConfig: 'Exportar Configuração',
    importConfig: 'Importar Configuração',
    configurationImportedSuccessfully: 'Configuração importada com sucesso!',
    dangerousActions: 'Ações Perigosas',
    resetToDefaults: 'Restaurar Padrões',
    resetConfirmation: 'Restaurar para configuração padrão? Esta ação não pode ser desfeita.',
    configurationResetToDefaults: 'Configuração restaurada para os padrões',

    // Messages
    errorMessages: {
      fieldNameAndLabelRequired: 'Nome do campo e rótulo são obrigatórios',
      passwordCannotBeEmpty: 'A senha não pode estar vazia',
      importFailed: 'Falha ao importar',
    },

    successMessages: {
      configurationSavedSuccessfully: 'Configuração salva com sucesso!',
    },
  },

  // PasswordGuard Component
  passwordGuard: {
    title: 'Acesso Administrativo',
    subtitle: 'Digite a senha para gerenciar configurações UTM',
    passwordPlaceholder: 'Digite a senha',
    unlock: 'Acessar Painel',
    invalidPassword: 'Senha inválida',
  },

  // App Component
  app: {
    admin: 'Admin',
  },
};
