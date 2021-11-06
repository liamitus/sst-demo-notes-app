import * as sst from '@serverless-stack/resources';
import { HttpMethods } from '@aws-cdk/aws-s3';

export default class StorageStack extends sst.Stack {
  // Public reference to the bucket
  bucket;

  // Public reference to the table
  table: sst.Table;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    this.bucket = new sst.Bucket(this, 'Uploads', {
      s3Bucket: {
        // Allow client side access to the bucket from a different domain
        cors: [
          {
            maxAge: 3000,
            allowedOrigins: ['*'],
            allowedHeaders: ['*'],
            allowedMethods: [
              HttpMethods.GET,
              HttpMethods.PUT,
              HttpMethods.POST,
              HttpMethods.DELETE,
              HttpMethods.HEAD,
            ],
          },
        ],
      },
    });

    // Create the DynamoDB table
    this.table = new sst.Table(this, 'Notes', {
      fields: {
        userId: sst.TableFieldType.STRING,
        noteId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: 'userId', sortKey: 'noteId' },
    });
  }
}
