export default async function executeQuery(collection, queryOptions) {
  try {
    let query = {};

    // Sort
    let sort = {};
    if (queryOptions.sort) {
      sort = queryOptions.sort;
    }

    // Filter
    if (queryOptions.filter) {
      query = { ...query, ...queryOptions.filter };
    }

    // Pagination
    let cursor = collection.find(query).sort(sort);

    if (queryOptions.page && queryOptions.pageSize) {
      cursor = cursor.skip((queryOptions.page - 1) * queryOptions.pageSize)
                     .limit(queryOptions.pageSize);
    }

    // Search (replace with your specific search logic)
    if (queryOptions.search) {
      // Option 1: Full-text search (MongoDB or Atlas Search)
      // query = { ...query, $text: { $search: queryOptions.search } };

      // Option 2: Regular expression search
      query = { ...query, name: { $regex: queryOptions.search, $options: 'i' } }; // Case-insensitive search
    }

    const data = await cursor.toArray();

    let totalCount = 0;
    if (queryOptions.page && queryOptions.pageSize) {
      totalCount = await collection.countDocuments(query);
    } else {
      totalCount = data.length;
    }

    return { data, totalCount };
  } catch (error) {
    // Handle specific error types (e.g., MongoDB errors) here
    throw error;
  }
}
