import * as sst from '@serverless-stack/resources';
import { ApiAuthorizationType } from '@serverless-stack/resources';

type ApiStackProps = sst.StackProps & {
  table: sst.Table;
};

export default class ApiStack extends sst.Stack {
  // Public reference to the API
  api;

  constructor(scope: sst.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { table } = props;

    // Create the API
    this.api = new sst.Api(this, 'Api', {
      defaultAuthorizationType: ApiAuthorizationType.AWS_IAM,
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
          STRIPE_SECRET_KEY:
            process.env.STRIPE_SECRET_KEY || 'missing_stripe_env_variable',
        },
      },
      routes: {
        'GET    /notes': 'src/list.main',
        'GET    /notes/{id}': 'src/get.main',
        'POST   /notes': 'src/create.main',
        'PUT    /notes/{id}': 'src/update.main',
        'DELETE /notes/{id}': 'src/delete.main',
        'POST   /billing': 'src/billing.main',
      },
    });

    // Allow the API to access the table
    this.api.attachPermissions([table]);

    // Show the API endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
