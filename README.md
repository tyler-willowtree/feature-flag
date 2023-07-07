# Feature Flags

> Fullstack example of using feature flags in an application.
> 
> Backend uses Nestjs, Prisma, GraphQL, MySQL (using docker), EJS, and Web components to create a feature flagging system along with a page on the server side to create, edit, toggle, and 
> delete flags.
> All of these languages can be changed out to your liking, with a some update to the code.
> 
> There are examples of the frontend in different languages including React, Vue and Web components. React and Vue use Prisma & GraphQL, while Web components just uses fetch. Again the way in 
> which data is fetched can be updated to your liking.
> 
> **Now includes A/B testing**

## Server/API/Database
### Installation

Update `docker-compose.yml` to your liking, then run the following:
```bash
$ docker-compose up -d
$ yarn
```
Create a `.env` file in the root of the project and add the following:
```dotenv
DATABASE_URL="mysql://<username>:<password>@<host>:<port>/<database>"
```

Choose which database option you want to use ("own" or "shared") and update the `prisma/schema.prisma` file accordingly.

Note: you can run the server with both in order to make a choice.

### Running the app

If this is the first time running the app, you will need to run the following commands to create the table and seed it with the example flag.

```bash
$ yarn migrate
$ yarn seed
```

```bash
# development
$ yarn start:dev
```

If you are still deciding on which database option to use, you can go to `http://localhost:<port_of_server_or_3010>/` to see the server side see both examples, otherwise you can go to 
`http://localhost:<port_of_server_or_3010>/<DB_OPTION>` to see the page of your choice directly.

## Clients
### Installation

```bash
$ cd client/app-<language_of_choice>
$ yarn
```
Create a `.env` file in the root of the chosen client (ex: `client/app-react/`) and add the following:
```dotenv
# For Vue client
VITE_APP_API_URL="http://localhost:<port_of_server_or_3010>/graphql"

# For React client
REACT_APP_API_URL="http://localhost:<port_of_server_or_3010>/graphql"

# For Web component client
JS_APP_API_URL="http://localhost:<port_of_server_or_3010>/graphql"
```

### Running the app

```bash
# development
$ yarn start
```

## Understanding How Feature Flags Work
Think of the flag itself as being enabled/disabled not the feature behind the flag. So if a flag is set to true or does not exist in the database, the feature will not render or can render an 
alternate component.

### Creating a flag
To create a flag, you can use the page on the server side, or you can use the GraphQL playground. The GraphQL playground can be accessed at `http://localhost:<port_of_server_or_3010>/graphql`. The 
GraphQL playground will allow you to do all the things the server side page can do. Names need to be unique and should include the name of the feature you are trying to toggle.

#### Example of creating a flag using the GraphQL playground
```graphql
mutation Mutation($data: FeatureFlagCreateInput!) {
  createFlag(data: $data) {
    abHideCount
    abPercentage
    abShowCount
    description
    enabled
    id
    name
    updatedAt
  }
}
```
Variables:
```json
{
  "data": {
    "name": "example-flag",
    "description": "This is an example flag",
    "abPercentage": 100
  }
}
```

#### On the client side
You will need to wrap the feature you want to toggle using the `FlaggedFeature` component and pass in the `name` of the flag you created above. This component will check if the 
flag is enabled or not. If the flag exists and is enabled, the component will render the feature, if not, it will not render the feature, or render an alternate component if specified.
See each language's component for setting it up correctly.

React Example:
```jsx
import { FlaggedFeature } from 'path/to/FlaggedFeature/component';

const Example = () => {
  return (
    <div>
      {/* Without an alternate component */}
      <FlaggedFeature flagKey="example-flag">
        <p>This is the feature that will be toggled</p>
      </FlaggedFeature>

      {/* With an alternate component */}
      <FlaggedFeature
        flagKey="example-flag-with-alt"
        altElement={<div>This will be shown if the flag is enabled</div>}
      >
        <p>This is the feature and will be shown if the flag is disabled</p>
      </FlaggedFeature>
    </div>
  );
};
```