import { gql } from '@apollo/client';


export const ADD_USER = gql`
  mutation addUser ($name: String!){
    addUser(name: $name){
      _id
      name
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const SAVE_BOOK = gql`
mutation AddBook($input: BookInput!) {
  saveBook(input: $input) {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`;

export const REMOVE_BOOK= gql`
mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
    username
  }
}`
