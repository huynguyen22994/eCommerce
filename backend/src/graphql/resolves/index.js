
const resolvers = {
    // Query
    Query: {
        books: async (parent, agrs) => {  },
        book: (parent, agrs) =>{},
        authors: async (parent, agrs) => {},
        author: async (parent, agrs) => {}
    },
    // Do Book có trường author là Type Author, nên add thêm query cho Book để xử lý trả ra đúng kiểu dữ liệu cho trường author
    Book: {
        author: async (parrent, agrs, context) => { 
            return {}
         }
    },
    Author: {
        books: async (parrent, agrs) => {}
    },

    // Mutation
    Mutation: {
        createAuthor: async (parent, agrs) => {},
        createBook: async (parent, agrs) => {}
    }
}

module.exports = {
    resolvers
};