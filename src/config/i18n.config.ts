import { AcceptLanguageResolver, I18nOptions } from 'nestjs-i18n';
import * as path from 'node:path';

export const I18nConfig: I18nOptions = {
  fallbackLanguage: 'en',

  loaderOptions: {
    path: path.join(__dirname, '..', '/i18n/'),
    watch: true,
  },

  resolvers: [AcceptLanguageResolver],
};
