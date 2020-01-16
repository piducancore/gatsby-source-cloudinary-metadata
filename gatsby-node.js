const cloudinary = require("cloudinary").v2

exports.sourceNodes = async (gatsby, options) => {
  const { actions, createNodeId, createContentDigest } = gatsby
  const { createNode } = actions
  try {
    // Configure credentials.
    cloudinary.config({
      cloud_name: options.cloud_name,
      api_key: options.api_key,
      api_secret: options.api_secret,
    })
    // Get data for all images (resources endpoint).
    const data = await cloudinary.api.resources(options)
    // Get embedded metadata for each image.
    await Promise.all(
      data.resources.map(async resource => {
        const metadata = await cloudinary.api.resource(resource.public_id, {
          image_metadata: true,
        })
        // Prepare data for node creation.
        const nodeData = {
          ...metadata,
          id: createNodeId(`cloudinary-media-${metadata.public_id}`),
          parent: null,
          internal: {
            type: `CloudinaryMedia`,
            content: JSON.stringify(metadata),
            contentDigest: createContentDigest(metadata),
          },
        }
        createNode(nodeData) // That's it.
      })
    )
    // We're done, return.
    return
  } catch (e) {
    console.error(e)
  }
}
