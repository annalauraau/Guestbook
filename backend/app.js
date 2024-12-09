app.get('/guestbook', async (req, res) => {
  const searchQuery = req.query.search || '';  // Default to an empty string if no search query is provided

  console.log("Search Query:", searchQuery);  // This will log the search query from the URL

  try {
    // Search for messages that match the search query in either 'name' or 'country'
    const messages = await Message.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },  // Search by name (case-insensitive)
        { country: { $regex: searchQuery, $options: 'i' } }  // Search by country (case-insensitive)
      ]
    });

    // Log the results to make sure you're getting the expected messages
    console.log("Found messages:", messages);

    // Pass both the messages and the searchQuery to the view (guestbook.ejs)
    res.render('guestbook', { title: "Guestbook", messages, searchQuery });
  } catch (error) {
    console.error("Error reading messages from MongoDB:", error);  // Log the error if there's one
    res.status(500).send("Error reading messages from MongoDB");
  }
});
