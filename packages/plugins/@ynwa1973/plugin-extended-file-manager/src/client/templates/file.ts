/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { CollectionTemplate, getConfigurableProperties } from '@nocobase/client';
import { NAMESPACE } from '../locale';

export class FileCollectionTemplate extends CollectionTemplate {
  name = 'file';
  title = `{{t("Oracle file collection", { ns: "${NAMESPACE}" })}}`;
  order = 3;
  color = 'blue';
  default = {
    createdBy: true,
    updatedBy: true,
    fields: [
      {
        interface: 'input',
        type: 'string',
        name: 'title',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("Title")}}`,
          'x-component': 'Input',
        },
      },
      {
        interface: 'input',
        type: 'string',
        name: 'filename',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("File name", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'Input',
          'x-read-pretty': true,
        },
      },
      {
        interface: 'input',
        type: 'string',
        name: 'extname',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("Extension name", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'Input',
          'x-read-pretty': true,
        },
      },
      {
        interface: 'integer',
        type: 'integer',
        name: 'size',
        deletable: false,
        uiSchema: {
          type: 'number',
          title: `{{t("Size", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'InputNumber',
          'x-read-pretty': true,
          'x-component-props': {
            stringMode: true,
            step: '0',
          },
        },
      },
      {
        interface: 'input',
        type: 'string',
        name: 'mimetype',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("MIME type", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'Input',
          'x-read-pretty': true,
        },
      },
      {
        interface: 'input',
        type: 'text',
        name: 'path',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("Path", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'TextAreaWithGlobalScope',
          'x-read-pretty': true,
        },
      },
      {
        interface: 'url',
        type: 'text',
        name: 'url',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("URL")}}`,
          'x-component': 'Input.URL',
          'x-read-pretty': true,
        },
      },
      {
        interface: 'url',
        type: 'text',
        name: 'preview',
        field: 'url',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("Preview", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'Preview',
          'x-read-pretty': true,
        },
      },
      {
        comment: 'Oracle storage',
        type: 'belongsTo',
        name: 'storage',
        target: 'storages',
        foreignKey: 'storageId',
        deletable: false,
        uiSchema: {
          type: 'string',
          title: `{{t("Oracle storage", { ns: "${NAMESPACE}" })}}`,
          'x-component': 'Input',
          'x-read-pretty': true,
        },
      },
      {
        type: 'jsonb',
        name: 'meta',
        deletable: false,
        defaultValue: {},
      },
    ],
  };
  presetFieldsDisabled = true;
  configurableProperties = {
    ...getConfigurableProperties('title', 'name'),
    inherits: {
      ...getConfigurableProperties('inherits').inherits,
      'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
    },
    ...getConfigurableProperties('category', 'description'),
    storage: {
      type: 'string',
      name: 'storage',
      title: `{{t("File storage", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'RemoteSelect',
      'x-component-props': {
        service: {
          resource: 'storages',
          params: {
            // pageSize: -1
          },
        },
        manual: false,
        fieldNames: {
          label: 'title',
          value: 'name',
        },
      },
    },
    ...getConfigurableProperties('presetFields'),
  };
}
