# Hostel API

After cloning, run the server with

```bash
yarn
yarn dev
```

## Documentation

The API exposes endpoints for two resources: User and Market. Some routes are only accessible by an Admin.

> Base url: <http://localhost:9005/api/v1>

Returns with `payload` and/or `message` envelop if request is successful.
Returns with `message` and `error` envelope for failed requests.

### User

Authenticate User [POST]

```js
/auth

```

Request Body

```json
{
  "email": "",
  "password": ""
}
```

### Market

### View all markets [GET]

```js
/market/;
```

### View a market [GET]

```js
/market/egilns;
```

Request Params

```json
{
  "searchBy": "<name / foodCategory>",
  "value": ""
}
```

### Create a market [POST]

```js
/market/;
```

Request Body

```json
{
  "email": "",
  "password": ""
}
```

### Delete a market [DELETE]

```js
/market/;
```

Request query

```json
{
  "markets": ["array of ids"]
}
```

### Get nearest Market [GET]

```js
/market/aeenrst;
```

Request query

```json
{
  "market": "address" || {
    "lat": number,
    "lng": number
  }
}
```

### Update Market [PUT]

```js
/market/;
```

Request query

```json
{
  "id": "",
  "name": "",
  "foodCategory": "",
  "description": "",
  "latlng": "lat,lng",
  "images": ["string of img url"]
}
```
