# gatsby-source-cloudinary-metadata

This plugin turns your Cloudinary media files _including its embedded metadata_ into Gatsby nodes.

## Requirements

All you need is a [Cloudinary](https://www.cloudinary.com) account with some images, your `cloud_name`, `api_key` and `api_secret`.

## Usage

In your Gatsby project run to following to install:

```bash
yarn add @piducancore/gatsby-source-cloudinary-metadata
```

Then in your `gatsby-config.js` file, include the plugin like this:

```js
// gatsby-config.js
module.exports = {
  plugins: [
    // ...
    {
      resolve: `gatsby-source-cloudinary-metadata`,
      options: {
        cloud_name: "YOUR_CLOUD_NAME", // required
        api_key: "YOUR_API_KEY", // required
        api_secret: "YOUR_API_SECRET", // required
        max_results: 500, // optional, default: 10
        prefix: `uploads/`, // optional
      },
    },
  ],
}
```

That's it.

## Example

To see the newly created Gatsby nodes you can go to your site's GraphiQL (`http://localhost:8000/___graphql`) and try something like the following.

### Sample query

If we wanted to get all the nodes this plugin created (`allCloudinaryMedia`) sorted by the embedded metadata's creation date (`CreateDate`) we could do something like this:

```graphql
{
  allCloudinaryMedia(
    sort: { order: ASC, fields: image_metadata___CreateDate }
  ) {
    totalCount
    nodes {
      public_id
      image_metadata {
        CreateDate
      }
    }
  }
}
```

### Sample response

And we should get something like this:

```graphql
{
  "data": {
    "allCloudinaryMedia": {
      "totalCount": 2,
      "nodes": [
        {
          "public_id": "uploads/some_image",
          "image_metadata": {
            "CreateDate": "2019:10:19 20:21:28"
          }
        },
        {
          "public_id": "uploads/some_other",
          "image_metadata": {
            "CreateDate": "2019:10:20 16:10:44"
          }
        }
      ]
    }
  }
}
```

## Notes

The plugin makes a first query to the Cloudinary API to get your images based on the options provided at configuration. Then uses the images `public_id` values to query them again one by one, to get the `image_metadata` from each.

In theory, every optional parameter for the `resources` endpoint should work to query and/or filter your images for the _first query_ mentioned above.

You can check all optional parameters at the [Get resources](https://cloudinary.com/documentation/admin_api#get_resources) section of the Cloudinary API documentation.
