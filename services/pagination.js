exports.getPaginatedResults = async (model,page,limit) => {
    console.log(model,page,limit)
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const results = {};
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        };
      }
  
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        };
      }
  
      try {
        results.results = await model.find()
          .limit(limit)
          .skip(startIndex)
          .exec();
          console.log(results.results)
        return results.results;
      } catch (error) {
        
      }
    };
  