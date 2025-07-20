/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Extended file storage Oracle Object Storage (S3 Compatible) StorageType for NocoBase
 */
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { AttachmentModel, StorageType } from '.';
import { STORAGE_TYPE_ORACLE_OSS } from '../../constants';
import { cloudFilenameGetter } from '../utils';

export default class extends StorageType {
  static defaults() {
    return {
      title: 'Oracle object storage',
      name: 'oracle-oss',
      type: STORAGE_TYPE_ORACLE_OSS,
      baseUrl: process.env.ORACLE_OSS_STORAGE_BASE_URL,
      options: {
        namespace: process.env.ORACLE_OSS_NAMESPACE,
        region: process.env.ORACLE_OSS_REGION,
        accessKeyId: process.env.ORACLE_OSS_ACCESS_KEY_ID,
        secretAccessKey: process.env.ORACLE_OSS_SECRET_ACCESS_KEY,
        bucket: process.env.ORACLE_OSS_BUCKET,
        endpoint: process.env.ORACLE_OSS_ENDPOINT, // optional, can be constructed
      },
    };
  }

  static filenameKey = 'key';

  make() {
    const multerS3 = require('multer-s3');
    const {
      accessKeyId,
      secretAccessKey,
      bucket,
      region,
      namespace,
      endpoint,
      acl = 'public-read',
      ...options
    } = this.storage.options;
    // Construct endpoint if not provided
    const oracleEndpoint = endpoint || `https://${namespace}.compat.objectstorage.${region}.oraclecloud.com`;
    const s3 = new S3Client({
      region,
      endpoint: oracleEndpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      ...options,
    });
    return multerS3({
      s3,
      bucket,
      acl,
      contentType(req, file, cb) {
        if (file.mimetype) {
          cb(null, file.mimetype);
          return;
        }
        multerS3.AUTO_CONTENT_TYPE(req, file, cb);
      },
      key: cloudFilenameGetter(this.storage),
    });
  }

  calculateContentMD5(body) {
    const hash = crypto.createHash('md5').update(body).digest('base64');
    return hash;
  }

  async deleteOracleObjects(bucketName: string, objects: string[]) {
    const { s3 } = this.make();
    const Deleted = [];
    for (const Key of objects) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key,
      });
      await s3.send(deleteCommand);
      Deleted.push({ Key });
    }
    return {
      Deleted,
    };
  }

  async delete(records: AttachmentModel[]): Promise<[number, AttachmentModel[]]> {
    const { Deleted } = await this.deleteOracleObjects(
      this.storage.options.bucket,
      records.map((record) => this.getFileKey(record)),
    );
    return [Deleted.length, records.filter((record) => !Deleted.find((item) => item.Key === this.getFileKey(record)))];
  }
}
