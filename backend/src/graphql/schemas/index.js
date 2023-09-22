
const typeDefs = `#graphql
    type Book {
        _id: ID,
        name: String,
        genre: String,
        author: Author
    }
    type Author {
        _id: ID!,
        name: String,
        age: Int,
        books: [Book]
    }
    # ROOT TYPE
    type Query {
        books: [Book]
        book (_id: ID!): Book
        authors: [Author]
        author (_id: ID!): Author
    }
    type Mutation {
        createAuthor (name: String, age: Int): Author
        createBook (name: String, genre: String, authorId: ID!): Book
    }
`

module.exports = {
    typeDefs
}