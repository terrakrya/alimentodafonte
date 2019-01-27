import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `O valor inválido.`,
  after: (field, [target]) => `O valor deste campo deve estar depois do campo ${target}.`,
  alpha: (field) => `O valor deste campo deve conter somente letras.`,
  alpha_dash: (field) => `O valor deste campo deve conter letras, números e traços.`,
  alpha_num: (field) => `O valor deste campo deve conter somente letras e números.`,
  alpha_spaces: (field) => `O valor deste campo só pode conter caracteres alfabéticos e espaços.`,
  before: (field, [target]) => `O valor deste campo deve estar antes do campo ${target}.`,
  between: (field, [min, max]) => `O valor deste campo deve estar entre ${min} e ${max}.`,
  confirmed: (field, [confirmedField]) => `Os campos ${field} e ${confirmedField} devem ser iguais.`,
  credit_card: (field) => `O valor deste campo é inválido.`,
  date_between: (field, [min, max]) => `O valor deste campo deve estar entre ${min} e ${max}.`,
  date_format: (field, [format]) => `O valor deste campo deve estar no formato ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `O valor deste campo deve ser numérico e deve conter ${!decimals || decimals === '*' ? '' : decimals} casas decimais.`,
  digits: (field, [length]) => `O valor deste campo deve ser numérico e ter exatamente ${length} dígitos.`,
  dimensions: (field, [width, height]) => `O valor deste campo deve ter ${width} pixels de largura por ${height} pixels de altura.`,
  email: (field) => `O valor deste campo deve ser um email válido.`,
  excluded: (field) => `O valor deste campo deve ser um valor válido.`,
  ext: (field) => `O valor deste campo deve ser um arquivo válido.`,
  image: (field) => `O valor deste campo deve ser uma imagem.`,
  included: (field) => `O valor deste campo deve ter um valor válido.`,
  integer: (field) => `O valor deste campo deve ser um número inteiro.`,
  ip: (field) => `O valor deste campo deve ser um endereço IP válido.`,
  length: (field, [length, max]) => {
    if (max) {
      return `O tamanho deste campo está entre ${length} e ${max}.`;
    }

    return `O tamanho deste campo deve ser ${length}.`;
  },
  max: (field, [length]) => `O valor deste campo não deve ter mais que ${length} caracteres.`,
  max_value: (field, [max]) => `O valor deste campo precisa ser ${max} ou menor.`,
  mimes: (field) => `O valor deste campo deve ser um tipo de arquivo válido.`,
  min: (field, [length]) => `O valor deste campo deve conter pelo menos ${length} caracteres.`,
  min_value: (field, [min]) => `O valor deste campo precisa ser ${min} ou maior.`,
  numeric: (field) => `O valor deste campo deve conter apenas números`,
  regex: (field) => `O valor deste campo possui um formato inválido.`,
  required: (field) => `O valor deste campo é obrigatório.`,
  size: (field, [size]) => `O valor deste campo deve ser menor que ${formatFileSize(size)}.`,
  url: (field) => `O valor deste campo não é uma URL válida.`
};

const locale = {
  name: 'pt_BR',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
